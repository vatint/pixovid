# Monetization — Phase 0 / 1 engineering checklist

Concrete build order for turning Pixovid into a paid product.  
Sorted by **implementation effort (low → high)** within each phase.  
Each item has: **owner surface**, **files**, **acceptance criteria**, **estimate**.

Legend: `[ ]` todo · `[~]` partial / exists · `[x]` done in this pass

---

## Phase 0 — Turn money on (ship this week)

Goal: real rupees can move, costs are visible, free abuse is bounded.

### 0.1 Live Razorpay + webhooks  ·  *ops / backend*  ·  **2–4 h**

| | |
|--|--|
| **Status** | `[ ]` (code ready; needs live keys) |
| **Files** | `apps/backend/.env`, `apps/backend/src/lib/razorpay.ts`, `routes/credits.ts` |
| **Steps** | 1. Razorpay dashboard → live Key ID/Secret<br>2. Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`<br>3. Webhook URL: `https://<api>/api/credits/webhook` events: `payment.captured`<br>4. Buy Starter pack end-to-end; confirm ledger `PURCHASE` + balance |
| **Done when** | `/billing` shows packs enabled; paid credits appear within 5s; webhook alone can credit if client verify fails |

### 0.2 Public pricing page  ·  *frontend*  ·  **3–5 h**

| | |
|--|--|
| **Status** | `[x]` |
| **Files** | `apps/frontend/src/pages/PricingPage.tsx`, `App.tsx`, `Navbar.tsx`, `Footer.tsx` |
| **Done when** | Logged-out users see `/pricing` with pack prices, action costs, and “videos you can make” math; CTA → signup or billing |

### 0.3 Public packs API (no auth)  ·  *backend*  ·  **30 m**

| | |
|--|--|
| **Status** | `[x]` |
| **Files** | `apps/backend/src/routes/credits.ts` |
| **Done when** | `GET /api/credits/packs` works without session (checkout still auth) |

### 0.4 Cost dashboard (internal)  ·  *backend + ops*  ·  **4–8 h**

| | |
|--|--|
| **Status** | `[x]` |
| **Files** | `routes/adminMetrics.ts`, `pages/AdminMetricsPage.tsx` → `/admin/metrics` |
| **Metrics** | Revenue (PAID payments), credits ledger, gens by status, provider cost sum, pack sales |
| **Done when** | Admin can open `/admin/metrics` with last-30d + lifetime proxies |

### 0.5 Free-tier abuse caps  ·  *backend*  ·  **4–6 h**

| | |
|--|--|
| **Status** | `[x]` (in-process IP limits; Redis later) |
| **Files** | `lib/rateLimit.ts`, `index.ts` `/api/auth` middleware |
| **Rules** | 1 welcome grant per email (done); signup **5/hour/IP**; sign-in **30/15min/IP** |
| **Done when** | Excess signups return **429** with Retry-After |

### 0.6 GST / invoice PDF (India)  ·  *backend*  ·  **1–2 d**

| | |
|--|--|
| **Status** | `[ ]` |
| **Files** | payment success path, `Payment` model fields for invoice # |
| **Done when** | Each successful pack purchase has a downloadable invoice (GSTIN when entity ready) |

### 0.7 Legal copy refresh  ·  *content*  ·  **2–3 h**

| | |
|--|--|
| **Status** | `[x]` |
| **Files** | `TermsPage.tsx`, `RefundPage.tsx` |
| **Must state** | Credits non-transferable; refunds only on failed gens; no cash for unused credits; watermark free tier; commercial use after purchase |

---

## Phase 1 — Convert better (next 2–4 weeks)

Goal: more % of activated users buy; no dead-end on 402.

### 1.1 Live credit cost on Generate  ·  *frontend*  ·  **done / verify**

| | |
|--|--|
| **Status** | `[x]` video, image, template already show `(N credits)` |
| **Files** | `TextToVideoForm.tsx`, `TextToImageForm.tsx`, `TemplateRenderDialog.tsx` |
| **Follow-up** | Face-swap form if it becomes paid; model multipliers later |

### 1.2 Insufficient-credits upsell modal  ·  *frontend*  ·  **3–5 h**

| | |
|--|--|
| **Status** | `[x]` |
| **Files** | `components/InsufficientCreditsModal.tsx`, `lib/api.ts` (`ApiError`), wired into generate forms |
| **Done when** | 402 → modal with required vs balance, recommended pack, link to `/billing` |

### 1.3 Free-export watermark  ·  *backend + ffmpeg*  ·  **1–2 d**

| | |
|--|--|
| **Status** | `[x]` |
| **Files** | `lib/watermark.ts`; wired in `routes/videos.ts`, `routes/images.ts`, `lib/runRender.ts` |
| **Rule** | No `PURCHASE` ledger row → watermark on video/image/template final; any PURCHASE → clean |
| **Done when** | Free user outputs show `pixovid` / `FREE TIER`; paid users get clean new gens |

### 1.4 Referral credits  ·  *full stack*  ·  **1–2 d**

| | |
|--|--|
| **Status** | `[ ]` |
| **Schema** | `User.referralCode`, `User.referredById` |
| **Rule** | Invitee signs up → both get 60 credits once invitee completes first successful gen |
| **Done when** | Share link `?ref=CODE` attributes signup; fraud: no self-ref |

### 1.5 Model / resolution credit multipliers  ·  *backend*  ·  **1–2 d**

| | |
|--|--|
| **Status** | `[ ]` |
| **Files** | `lib/credits.ts` `actionCost()` → `computeVideoCost({ model, resolution, duration, audio })` |
| **Done when** | Generate button + spend path use same formula; expensive models never sell at loss |

### 1.6 Soft credit expiry (optional)  ·  *backend*  ·  **2–3 d**

| | |
|--|--|
| **Status** | `[ ]` |
| **Rule** | Pack credits expire 12 months after purchase (FIFO); welcome credits expire 30 days |
| **Done when** | Ledger supports expiry job; UI shows “expiring soon” |

### 1.7 Email / low-balance nudges  ·  *backend*  ·  **1–2 d**

| | |
|--|--|
| **Status** | `[ ]` |
| **Triggers** | balance &lt; one video cost; 3 days after welcome; abandoned checkout |
| **Done when** | At least one transactional email/WhatsApp path live |

---

## Phase 2 — Recurring revenue (after first paid users)

| # | Item | Effort | Notes |
|---|------|--------|-------|
| 2.1 | `Plan` + `Subscription` Prisma models | 1 d | Creator / Pro / Studio |
| 2.2 | Razorpay Subscriptions or Stripe Billing | 3–5 d | Prefer Stripe if global early |
| 2.3 | Monthly credit grant cron | 1 d | + rollover cap |
| 2.4 | Priority queue for paid plans | 2–3 d | Job priority field |
| 2.5 | Commercial license flag on account | 0.5 d | Gates watermark + ToS |

---

## Phase 3 — Platform (later)

| # | Item | Effort |
|---|------|--------|
| 3.1 | Template marketplace + revenue share | 2–4 w |
| 3.2 | API keys + metered billing | 2–3 w |
| 3.3 | Team workspaces / shared pool | 2–3 w |
| 3.4 | Enterprise SSO / private FaceFusion | custom |

---

## Suggested build order (this repo)

```
Week 1  0.1 Razorpay live                         ← ops (keys)
        0.2 + 0.3 Pricing page + public packs     ← done
        1.2 Insufficient credits modal            ← done
        0.7 Legal copy                            ← done
Week 2  0.5 Abuse caps                            ← done (IP rate limits)
        1.3 Watermark free exports                ← done
        0.4 Metrics dashboard                     ← done
Week 3  1.5 Cost multipliers
        1.4 Referrals
Week 4+ Phase 2 subscriptions
```

---

## Acceptance gates before paid ads

- [ ] At least 5 real paid transactions in production  
- [ ] Gross margin on sample gens ≥ 30% at Studio pack rate  
- [ ] Watermark or hard credit gate on free path  
- [ ] Refund path verified on forced provider failure  
- [ ] Support email + refund policy published  

---

## Quick reference — current product numbers

| Action | Credits (default) |
|--------|-------------------|
| Image | 6 |
| Video | 60 |
| Template render | 1000 |
| Welcome bonus | 120 |

| Pack | INR | Credits |
|------|-----|---------|
| Starter | 499 | 500 |
| Pro | 1999 | 2200 |
| Studio | 4999 | 6000 |

Env knobs: `CREDITS_PER_*`, `CREDIT_PACKS` in `apps/backend/src/lib/credits.ts`.
