# Finantalyst — Setup Checklist

Copy `.env.example` to `.env.local` before starting.

## Local Development (Docker)

```bash
docker-compose up -d          # starts Postgres + Redis
npx prisma migrate dev        # apply schema migrations
npx prisma db seed            # seed initial tax rule configs
npm run dev                   # start Next.js on :3000
```

---

## API Keys — Phase by Phase

### Phase 1 (now)

| Key | Where to get | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys | Free tier available; $5 credit on signup |
| `AUTH_SECRET` | Run `openssl rand -base64 32` in terminal | Any 32-char random string for dev |

> Without `ANTHROPIC_API_KEY` the app runs fully on the Mock AI adapter — all features work with placeholder responses.

### Phase 3

| Key | Where to get | Notes |
|---|---|---|
| `OCR_API_KEY` | Nanonets or Google Vision AI | For document vault / receipt scanning |

### Phase 4

| Key | Where to get | Notes |
|---|---|---|
| `MARKET_DATA_API_KEY` | Twelve Data (twelvedata.com) or Alpha Vantage | Free tier: 800 req/day — enough for dev |

### Phase 5

| Key | Where to get | Notes |
|---|---|---|
| `GSP_API_KEY` | Apply via a GST Suvidha Provider (Masters India, ClearTax) | Sandbox available |
| `GSP_USERNAME` | Same GSP onboarding | — |

### Phase 9

| Key | Where to get | Notes |
|---|---|---|
| `RAZORPAY_KEY_ID` | dashboard.razorpay.com → Settings → API Keys | Test mode available immediately |
| `RAZORPAY_KEY_SECRET` | Same location | — |

---

## Regulated Capabilities — Legal Review Required Before Shipping

| Capability | Regulation | Status |
|---|---|---|
| GST filing (real submissions) | GST Council / GSP partner agreement | 🔴 Legal review needed |
| TDS filing | Income Tax Act | 🔴 Legal review needed |
| Personalized investment advice | SEBI Investment Adviser / Research Analyst | 🔴 SEBI registration or licensed partner required |
| Money movement / payments | RBI / Payment Aggregator license | 🔴 Legal review + PA license / partner |
| Account Aggregator data | RBI AA framework | 🔴 AA partner agreement |

These are flagged in code with `// [REGULATED]` comments. Do not enable in production without legal sign-off.
