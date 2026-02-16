# Deriverse Analytics

A comprehensive trading analytics solution for [Deriverse](https://deriverse.xyz) — the next-gen, fully on-chain, decentralized Solana trading ecosystem. This dashboard provides professional trading journal and portfolio analysis for active traders across spot, perpetual, and options markets.

---

## Live deployment

| App        | URL |
|------------|-----|
| **Frontend** | [https://atlas-x-roan.vercel.app/](https://atlas-x-roan.vercel.app/) |
| **Backend API** | [https://atlas-x-rg57.vercel.app](https://atlas-x-rg57.vercel.app) |

The production frontend is wired to the backend API above. **Try the live app:** open the Frontend URL → **Connect wallet** → choose **Demo (no wallet)** or a Solana wallet → **Go to dashboard**.

---

## Features

### Core analytics

| Feature | Description |
|--------|--------------|
| **Total PnL tracking** | Realized and unrealized PnL with color-coded indicators (green/red) |
| **Volume & fee analysis** | Total volume, total fees, fee-to-profit ratio, daily fee breakdown |
| **Win rate & trade count** | Win rate % and total trade count |
| **Average trade duration** | Mean holding time per trade (minutes) |
| **Long/Short ratio** | Directional bias (long vs short counts) and filter |
| **Largest gain/loss** | Single-trade extremes for risk management |
| **Average win/loss** | Mean profit per winning trade, mean loss per losing trade |

### Filtering & charts

| Feature | Description |
|--------|--------------|
| **Symbol filter** | Filter by trading pair (e.g. SOL-PERP, BTC-PERP, ETH-PERP) |
| **Date range** | From/To date filters for historical analysis |
| **Historical PnL** | Equity curve and drawdown over time |
| **Time-based performance** | Daily PnL, best/worst sessions, time-of-day (hourly) analysis |

### Journal & insights

| Feature | Description |
|--------|--------------|
| **Trade history table** | Sortable table: entry/exit, symbol, direction, PnL, fees |
| **Annotations** | Add and edit notes per trade for journaling |
| **Fee composition** | Daily fee breakdown and cumulative fee chart |
| **Order type performance** | Per-type metrics: PnL, win rate, avg win/loss (MARKET, LIMIT, STOP, STOP_LIMIT) |

### Innovation

- **Composite risk score** (0–100) from win rate, drawdown, and fee efficiency
- **Behavioral insights**: win/loss streaks, best and worst symbols and sessions
- **Portfolio overview** with allocation by symbol and volatility estimate
- **Multi-wallet support**: Phantom, Solflare, Backpack, or Demo (no wallet required)

---

## Tech stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Recharts |
| **Backend** | Node.js, Express, CORS, express-rate-limit |
| **Wallet** | Solana wallets: Phantom, Solflare, Backpack, or Demo (no extension required) |

---

## Project structure

```
deriverse-analytics/
├── frontend/                    # Vite + React app
│   ├── src/
│   │   ├── api/                  # tradesClient — fetches /api/trades
│   │   ├── components/           # Charts, tables, filters, layout, landing, wallet
│   │   ├── context/              # TradeContext (filters, loading, notes)
│   │   ├── data/                 # mockTrades.ts (fallback when API unavailable)
│   │   ├── utils/                # analytics.ts — metrics, equity, drawdown
│   │   ├── solanaWallet.tsx      # Wallet context & multi-wallet support
│   │   ├── types.ts
│   │   └── ...
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts            # Proxies /api to backend
│   └── tailwind.config.js
│
└── backend/                      # Express API
    ├── data/
    │   └── mockTrades.cjs        # Demo trade data
    ├── server.cjs                # GET /api/trades, GET /api/health
    └── package.json
```

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Dollypee48/AtlasX.git
cd AtlasX
```

*(If your repo is under a different name or path, `cd` into the cloned folder.)*

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

---

## Running the project

### 1. Start the backend

From the project root:

```bash
cd backend
npm run dev
```

The API runs at **http://localhost:5001**.

**Endpoints:**

- `GET /api/health` — health check
- `GET /api/trades?wallet=<pubkey>` — returns trade array (mock data in demo; use `demo-wallet` or a Solana base58 address)

### 2. Start the frontend

In a **second terminal**:

```bash
cd frontend
npm run dev
```

The app runs at **http://localhost:5173** (or the next free port if 5173 is in use). Vite proxies `/api` to `http://localhost:5001`.

### 3. First run

1. Start the **backend** first, then the **frontend**.
2. Open **http://localhost:5173** in your browser.
3. Click **Connect wallet** → choose **Demo (no wallet)** or connect Phantom/Solflare/Backpack.
4. Click **Go to dashboard** in the hero section.
5. Use **Overview**, **Journal**, **Portfolio**, and **Insights** in the sidebar.

---

## Deployment

### Backend (e.g. Vercel, Render, Railway)

- **Build:** `npm install`
- **Start:** `node server.cjs` (or `npm run start`)
- **Environment variables:**
  - `PORT` — set by the host (e.g. Vercel)
  - `CORS_ORIGIN` — your frontend origin, e.g. `https://atlas-x-roan.vercel.app`

### Frontend (e.g. Vercel, Netlify)

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment (optional):**
  - `VITE_API_BASE_URL` — backend URL. If unset, the production build uses `https://atlas-x-rg57.vercel.app` (see `frontend/src/api/tradesClient.ts`).

---

## Security

- **Input validation:** Wallet query param validated (Solana base58 or `demo-wallet`).
- **Rate limiting:** 60 requests per minute per IP on `/api/*`.
- **CORS:** Set `CORS_ORIGIN` to your frontend URL in production.
- **No custody:** The app never holds private keys; users connect via Phantom, Solflare, Backpack, or use the demo wallet.

---

## Real Deriverse integration

The app currently uses **mock trade data** for the demo. To plug in real Deriverse/Solana data:

1. Replace the mock loader in `backend/server.cjs` with:
   - Deriverse HTTP APIs (if available), or
   - A Solana indexer (e.g. Helius, Flipside).
2. Map on-chain fills/positions to the `Trade` shape expected by the frontend.
3. Return arrays that match the `Trade` interface in `frontend/src/types.ts`.

---

## License

MIT

---

## Author & submission

| Item | Link |
|------|------|
| **Author** | [Akinola Dolapo](https://x.com/AkinolaDolapo6) |
| **GitHub** | [github.com/Dollypee48/AtlasX](https://github.com/Dollypee48/AtlasX) |
| **Live app** | [atlas-x-roan.vercel.app](https://atlas-x-roan.vercel.app/) |
| **Backend API** | [atlas-x-rg57.vercel.app](https://atlas-x-rg57.vercel.app) |
