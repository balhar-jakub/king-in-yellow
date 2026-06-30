# Magic Link Authentication — Implementation Plan

## Architecture Overview

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Database** | New `king_in_yellow` DB in PostgreSQL 18 (port 5433) | Already running — no new service |
| **ORM** | Prisma | First-class Next.js support, type-safe queries |
| **Email** | Nodemailer + external SMTP (Resend, SendGrid, or Gmail SMTP) | No local mail server; borrow from `csld` app experience |
| **Token store** | PostgreSQL table with expiry | No Redis, simple schema |
| **Sessions** | Signed JWT in httpOnly cookie | Stateless — no session store needed |
| **Auth flow** | Next.js API routes (`/api/auth/*`) | All server-side, no extra service |

## Server State

- PostgreSQL 18 running on `127.0.0.1:5433`
- No Redis available (not needed)
- No postfix/sendmail (use external SMTP)
- The `csld` app already uses `nodemailer` — SMTP credentials likely exist
- Database credentials stored in `~/.pgpass`:
  ```
  localhost:5433:csld:csld:csld
  ```

## Database Schema

```sql
-- Run as 'csld' user (or create dedicated user):
-- CREATE DATABASE king_in_yellow OWNER csld;

CREATE TABLE IF NOT EXISTS magic_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) NOT NULL,
    token       VARCHAR(128) NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ NOT NULL,
    used        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_magic_tokens_token ON magic_tokens(token);
CREATE INDEX idx_magic_tokens_email_expires ON magic_tokens(email, expires_at);

CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) NOT NULL UNIQUE,
    name        VARCHAR(255),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Auth Flow

### 1. Request Magic Link

```
POST /api/auth/request
Content-Type: application/json
{ "email": "user@example.com" }
```

**Server-side:**
1. Validate email format
2. Generate token: `crypto.randomUUID()` + `crypto.randomBytes(32).toString('hex')`
3. Store in `magic_tokens`: `{ email, token, expires_at: NOW() + 15 minutes, used: false }`
4. Invalidate any previous unused tokens for this email
5. Send email via Nodemailer (SMTP provider TBD)
6. Return `{ ok: true }` (always, to prevent email enumeration)

**Email template:**
```
Subject: Vstupte do Žluté — Váš odkaz

Ve stínu králova pláště…

Klikněte pro vstup:
https://plesvezlute.cz/api/auth/verify?token=<TOKEN>

Odkaz vyprší za 15 minut.

— Ve Žluté, 20. 2. 2027
```

### 2. Verify Token

```
GET /api/auth/verify?token=<TOKEN>
```

**Server-side:**
1. Look up token in `magic_tokens`
2. Reject if: not found, expired (`expires_at < NOW()`), or already used (`used = TRUE`)
3. Mark token as `used = TRUE`
4. Upsert user into `users` table, update `last_login`
5. Generate JWT: `{ sub: user.id, email: user.email }`, signed with `JWT_SECRET`, expiry 7 days
6. Set cookie: `auth_token=<JWT>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`
7. Redirect to `/` (or `/loterie` if coming from lottery flow)

### 3. Check Auth (Middleware)

```
// src/middleware.ts
- Runs on every request
- Reads auth_token cookie
- Verifies JWT signature
- Injects user into request context
- Public routes: /, /login, /loterie, /api/auth/*
- Protected routes: /loterie/objednavka (future), /admin (future)
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── request/route.ts    # POST /api/auth/request
│   │       └── verify/route.ts     # GET  /api/auth/verify
│   ├── login/page.tsx              # Updated: email input + magic link
│   └── layout.tsx                  # Updated: auth context provider
├── lib/
│   ├── auth.ts                     # JWT sign/verify, cookie helpers
│   ├── db.ts                       # Prisma client singleton
│   └── email.ts                    # Nodemailer sendMagicLink()
├── middleware.ts                   # Auth check middleware
└── prisma/
    └── schema.prisma               # Database schema
```

## Environment Variables

```bash
# .env.local (server only, never committed)
DB_CONNECTION="postgresql://csld:csld@127.0.0.1:5433/king_in_yellow"
JWT_SECRET="<random-64-char-hex>"
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="user@example.com"
SMTP_PASS="app-password"
SMTP_FROM="Ve Žluté <ples@plesvezlute.cz>"
SITE_URL="https://plesvezlute.cz"
```

## Package Additions

```bash
npm install prisma @prisma/client nodemailer jsonwebtoken
npm install -D @types/jsonwebtoken @types/nodemailer
```

## Remaining Questions

| Question | Options |
|----------|---------|
| **SMTP provider** | Resend (free tier, 3k/month), SendGrid, Gmail SMTP, or reuse `csld` app's credentials |
| **Database user** | Create `king_in_yellow` user, or reuse `csld` user with new database |
| **Access control** | Invite-only (whitelist emails) or open to anyone? |
| **Post-login redirect** | Always /, or remember the page the user was trying to access? |

## Migration Steps

1. Create database + tables
2. Install packages + configure Prisma
3. Implement `src/lib/auth.ts` (JWT helpers)
4. Implement `src/lib/email.ts` (Nodemailer)
5. Implement `POST /api/auth/request`
6. Implement `GET /api/auth/verify`
7. Update `/login` page to email-only form
8. Add `middleware.ts`
9. Test end-to-end
10. Set up environment variables on the server
