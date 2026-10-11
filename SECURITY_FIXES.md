# Security Hardening & Remediation Log (SECURITY_FIXES.md)

**Project:** Woody Home E-Commerce Platform  
**Target:** Node.js Express Backend & Supabase PostgreSQL  
**Audit Standard:** OWASP Top 10:2025 & OWASP ASVS 5.0 Level 2  
**Date:** October 2026  

---

## 1. Summary of Modified Files

| File | Primary Fix Applied | Severity | Compatibility Impact |
|------|---------------------|----------|----------------------|
| `src/middleware/authMiddleware.js` | Multi-tier durable token revocation (Memory + Disk `.session_revocations.json` + PostgreSQL `revoked_tokens`) & Fail-Closed Admin MFA (`mfa_verified === true`) | CRITICAL | Survives server restarts and cluster scaling |
| `src/controllers/authController.js` | Awaited durable token revocation on `logoutUser`; fail-closed admin login issuing `mfa_verified: false` by default; TOTP setup & verification | CRITICAL | Zero UI disruption |
| `src/controllers/checkoutController.js` | High-entropy HMAC-SHA256 tracking token (`computeTrackingToken`); strict token verification on `trackOrder`; PII masking; atomic stock/coupon updates | CRITICAL | Eliminates phone/email guessing attacks; returns `tracking_token` and `tracking_url` |
| `src/controllers/stripeController.js` | Enforced strict HMAC-SHA256 signature validation via official Stripe SDK, transactional idempotency, and payment status checks | CRITICAL | Fully backward-compatible with official Stripe webhooks |
| `src/utils/totp.js` | RFC 6238 TOTP engine with 90-second replay window protection and timing-safe comparison | HIGH | Native Node.js crypto, zero external packages |
| `src/middleware/csrfProtection.js` | Cross-origin state mutation defense checking `Origin` and `Referer` headers for cookie sessions | HIGH | Transparent to legitimate frontend |
| `supabase/schema.sql` | Replaced public `USING (true)` RLS with strict tenant isolation; added `revoked_tokens` and `tracking_token` schemas | CRITICAL | Backward-compatible; guest tracking preserved via Express API |
| `test/security.regression.test.js` | 22 comprehensive regression tests with real Supertest HTTP requests, cryptographic HMAC generation, and fail-closed MFA checks | TEST | Integrated into `npm test` |

---

## 2. Remediation Details for the 5 Specific Production Risks

### Risk 1: Durable JWT Token Revocation Persistence
- **Files:** `src/middleware/authMiddleware.js`, `src/controllers/authController.js`
- **Problem:** In-memory `Set()` wipes on server restarts or between clustered backend instances.
- **Remediation:**
  1. Synchronous persistent write on logout (`await revokeToken(token)`).
  2. Multi-tier lookup:
     - Tier 1: Fast in-memory cache for high-throughput validation.
     - Tier 2: Persistent local disk store (`.session_revocations.json`) loaded on server boot, ensuring zero state loss across restarts.
     - Tier 3: PostgreSQL `revoked_tokens` table with `jti` and `expires_at` for multi-instance cluster synchronization.
  3. Verified via Supertest: Logged-out token immediately rejected with HTTP 401 (`Token Revoked`).

### Risk 2: Admin MFA Fail-Closed Enforcement
- **Files:** `src/middleware/authMiddleware.js`, `src/utils/totp.js`, `src/controllers/authController.js`
- **Problem:** Relying only on `mfa_pending === true` is fail-open if the claim is missing, false, or tampered.
- **Remediation:**
  1. `requireAdmin` strictly requires `req.user.mfa_verified === true` (strict boolean check).
  2. Tokens with missing claims, `mfa_verified: false`, string `"true"` (type confusion), or `mfa_pending: true` are rejected with HTTP 403 (`MFA Verification Required`).
  3. `generateToken` sets `mfa_verified: false` for all admin logins until 6-digit TOTP code is verified.
  4. TOTP replay protection: Codes cached for 90 seconds (full +/- 1 drift window). Replayed codes are rejected.

### Risk 3: Stripe End-to-End Payments
- **File:** `src/controllers/stripeController.js`
- **Remediation:**
  1. Strictly validates raw body with `stripe.webhooks.constructEvent(req.body, sig, webhookSecret)`.
  2. Valid signatures return HTTP 200; forged signatures return HTTP 400.
  3. Verifies `session.payment_status === 'paid'` before fulfillment.
  4. Transactional idempotency prevents double fulfillment for duplicate webhook retries.
  5. Documented exact Stripe CLI commands for live test-mode event verification.

### Risk 4: Secure Guest Order Tracking (Eliminating Phone/Email Guessing)
- **File:** `src/controllers/checkoutController.js`
- **Problem:** Allowing anyone with an order number and phone number or email to view orders exposes private customer PII.
- **Remediation:**
  1. Generated cryptographically high-entropy 256-bit tracking tokens (`computeTrackingToken(order_number)`).
  2. In `createOrder`, returns `tracking_token` and prefilled `tracking_url: /orders/track/${order.order_number}?token=${tracking_token}`.
  3. In `trackOrder`, requests without the high-entropy token or authenticated owner login return HTTP 403 Forbidden.
  4. Phone numbers and email addresses are masked (`******1234`, `al***@***`) in all output.

### Risk 5: Distributed Database Concurrency
- **Files:** `src/controllers/checkoutController.js`, `supabase/schema.sql`
- **Remediation:**
  1. Conditional stock updates: `.eq('id', variant.id).gte('inventory_quantity', item.quantity)`.
  2. Conditional coupon updates: `.eq('id', coupon.id).lt('times_used', coupon.usage_limit)`.
  3. Added PostgreSQL check constraint: `ALTER TABLE product_variants ADD CONSTRAINT chk_inventory_non_negative CHECK (inventory_quantity >= 0);`.
  4. Automated concurrency test: 10 parallel requests competing for 1 unit of stock; exactly 1 succeeds, 9 fail, stock never goes negative.
