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

## Implementation Plan — 6 Phases

### Phase 1: Database schema

- Add columns to `kiy_users`: `role`, `phone`, `street`, `city`, `zip`
- New table `kiy_orders`: order details, status, variable symbol, guest name
- Update Prisma schema + regenerate

### Phase 2: Profile completion

- User must fill name, phone, address before purchasing
- Store on the user record (not per-order)
- `/vstupenky` redirects to profile form if incomplete

### Phase 3: Ticket selection & checkout

- `/vstupenky` page — three ticket cards (Early Bird grayed out if unavailable)
- Order creates `PENDING` record with unique variable symbol
- Checkout screen shows **payment QR code** (generated server-side, Czech QR standard)
- Variable symbol = order ID suffix (for matching bank payments later)

### Phase 4: Email ticket with entry QR

- Triggered when admin confirms payment
- Generates visually styled HTML ticket (Lovecraftian theme) with **entry QR code** embedded
- Entry QR contains a signed verification token (ticket ID + order ID)

### Phase 5: Admin panel

- `/admin` — list all orders, filter by status, confirm payments manually
- Role-gated via middleware (only `ADMIN` role)
- You get `ADMIN` role set manually in DB initially

### Phase 6: Check-in

- `/checkin` — separate page for door staff
- Scan or manually enter ticket token → marks as `CHECKED_IN`
- Prevents duplicate check-in
- Role-gated (only `CHECKIN` role)

## New Dependencies

- `qrcode` — generate QR code images (payment + entry)

## Scope

~15 new files: Prisma schema update, 3 API routes, 4 pages, middleware updates, email template.
