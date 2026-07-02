# Ticket System — Specification & Implementation Plan

## Product

New page `/vstupenky` (behind login) for purchasing ball entry tickets. Separate from `/loterie`.

## Ticket Types

| Type | Price | Capacity | Deadline |
|---|---|---|---|
| Early Bird | 777 Kč | 50 tickets | Sep 30, 2026 |
| Regular | 888 Kč | Unlimited | — |
| Couple's | 1776 Kč | Unlimited | — |

One order per account. Couple's ticket = holder + 1 unnamed guest.

## Purchase Flow (Flow A)

```
1. User logs in
2. Completes profile (name, phone, street+number, city, ZIP)
3. Selects ticket type (early bird hidden if sold out / past deadline)
4. Order created as PENDING → QR payment code shown (Czech QR standard)
5. Admin manually confirms payment (Fio API integration later)
6. Ticket generated → emailed with entry QR code → visually styled
```

### Two QR Codes (distinct purposes)

- **Payment QR** — Czech standard payment order (IBAN, amount, variable symbol) — shown on checkout screen
- **Entry QR** — on the ticket itself, contains ticket verification token — scanned at door

## Roles (database, not hardcoded)

| Role | Abilities |
|---|---|
| `USER` | Buy tickets, view own ticket |
| `ADMIN` | View all orders, confirm payments |
| `CHECKIN` | Separate profiles, scan/mark tickets as arrived |

## Address

Street + number, City, ZIP (Czech Republic).

## Payment

- **Bank:** Fio (API integration deferred — available later)
- **Flow:** Buyer pays via QR payment code → Admin manually confirms → Ticket released
- **Variable symbol:** Derived from order ID (for future bank API matching)
- **Manual confirmation required** until Fio API integration is built

## Implementation Plan

### Strategy: Mock-first, integrate later

Build the **full UI and API surface with mock data first**, validate the user experience end-to-end, then replace mocks with real integrations (database, QR generation, email, payment confirmation).

---

### Phase 1: Database schema (minimal)

- Add columns to `kiy_users`: `role` (enum: `USER`, `ADMIN`, `CHECKIN`), `phone`, `street`, `city`, `zip`
- New table `kiy_orders`: `id`, `user_id`, `ticket_type`, `amount`, `status` (enum: `PENDING`, `CONFIRMED`, `CHECKED_IN`), `variable_symbol`, `guest_name`, `created_at`, `confirmed_at`, `checked_in_at`
- Update Prisma schema + regenerate

---

### Phase 2: Mock UI + Mock APIs (validate the experience)

**Goal:** Walk through the entire user journey with mocked data — no real QR generation, no real email, no real payment. Everything returns plausible fake responses so the UX can be validated visually.

#### Pages (all behind login)

| Page | Route | What it shows (mock) |
|---|---|---|
| Profile form | `/profil` | Name, phone, street+number, city, ZIP — pre-filled with mock data |
| Ticket selection | `/vstupenky` | Three ticket cards (Early Bird / Regular / Couple's). Early Bird grayed out if past deadline or mock "sold out" |
| Checkout | `/vstupenky/pokladna` | Order summary + placeholder payment QR (static image) + "Simulate payment" button |
| My ticket | `/vstupenky/muj-listek` | Visually styled mock ticket with placeholder entry QR |
| Admin panel | `/admin` | Mock order list with statuses, "Confirm payment" buttons (no real effect) |
| Check-in | `/checkin` | Mock scan interface — enter any code → shows fake ticket → "Mark checked in" |

#### Mock API routes

| Route | Mock behavior |
|---|---|
| `GET /api/profile` | Returns mock profile data from session |
| `PUT /api/profile` | Accepts data, logs to console, returns `{ ok: true }` |
| `POST /api/orders` | Logs to console, returns mock order with fake variable symbol |
| `GET /api/orders/:id` | Returns mock order by ID |
| `GET /api/orders/mine` | Returns mock order for current user (or null) |
| `POST /api/orders/:id/simulate-payment` | Flips mock status to `CONFIRMED`, returns `{ ok: true }` |
| `GET /api/ticket/:token` | Returns mock ticket data (buyer name, type, fake entry token) |
| `GET /api/admin/orders` | Returns list of mock orders |
| `POST /api/admin/orders/:id/confirm` | Logs to console, returns `{ ok: true }` |
| `POST /api/checkin` | Accepts any token, returns mock ticket info + marks checked in |

#### What's mocked vs real

| Feature | Mock | Real (later phases) |
|---|---|---|
| Profile data | In-memory / hardcoded | Phase 3: PostgreSQL |
| Orders | In-memory array | Phase 3: PostgreSQL |
| Payment QR | Static placeholder image | Phase 4: Real QR generation (Czech standard) |
| Payment confirmation | Button "Simulate payment" | Phase 5: Admin manual confirm / Fio API |
| Email ticket | Console log + on-screen preview | Phase 4: Real nodemailer + styled HTML |
| Entry QR | Placeholder image | Phase 4: Real QR with signed token |
| Admin | Read/write mock data | Phase 5: Real DB queries |
| Check-in | Mock scan + mark | Phase 6: Real ticket verification |

#### Validation checklist

After Phase 2, we validate:
- [ ] Login flow works → lands on `/vstupenky`
- [ ] Profile form renders, validates, saves (mock)
- [ ] Three ticket cards display correctly with pricing
- [ ] Early Bird is grayed out / unavailable (test by toggling mock)
- [ ] Checkout shows order summary + payment QR placeholder
- [ ] "Simulate payment" flips status → ticket becomes available
- [ ] Ticket page shows styled ticket with entry QR placeholder
- [ ] Admin panel lists orders, confirm button works (mock)
- [ ] Check-in page accepts code, shows ticket, marks arrived (mock)
- [ ] All pages match the Lovecraftian gold-on-dark design system
- [ ] Mobile responsive

---

### Phase 3: Real database integration

- Replace mock data stores with Prisma queries
- Profile completion enforced (redirect to `/profil` if incomplete)
- Order persistence, status transitions, capacity checks (Early Bird limit)
- Early Bird deadline enforcement (Sep 30, 2026)

### Phase 4: Real QR generation + email

- `qrcode` library for both payment QR (Czech standard) and entry QR (signed token)
- Payment QR: IBAN, amount, variable symbol per Czech banking standard
- Entry QR: JWT-like signed token containing order ID + ticket holder
- Email: Styled Lovecraftian HTML ticket sent via nodemailer when order confirmed
- Ticket page: Real entry QR rendered from signed token

### Phase 5: Admin panel (real)

- `/admin` — real DB queries, order list with filters
- Manual payment confirmation → triggers email + ticket generation
- Role-gated (`ADMIN` role in DB)
- Your account gets `ADMIN` role set manually initially

### Phase 6: Check-in (real)

- `/checkin` — scan or enter ticket token
- Verifies signed entry token against DB
- Marks `CHECKED_IN`, prevents duplicate check-in
- Role-gated (`CHECKIN` role in DB)
- Separate profiles for door staff

---

## New Dependencies

- `qrcode` — generate QR code images (payment + entry) — Phase 4 only

## Scope

Phase 2 (mock): ~12 new files (6 pages, 6 mock API routes)
Full system: ~20 new files total across all phases
