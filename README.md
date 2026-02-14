# Deriverse Analytics

A comprehensive trading analytics solution for [Deriverse](https://deriverse.xyz) — the next-gen, fully on-chain, decentralized Solana trading ecosystem. This dashboard provides professional trading journal and portfolio analysis for active traders across spot, perpetual, and options markets.

### Live deployment

| App | URL |
|-----|-----|
| **Frontend** | [https://atlas-x-roan.vercel.app/](https://atlas-x-roan.vercel.app/) |
| **Backend API** | [https://atlas-x-rg57.vercel.app](https://atlas-x-rg57.vercel.app) |

The frontend is wired to use the backend API above in production.

---

## Features

### Core Analytics
| Feature | Description |
|---------|-------------|
| **Total PnL tracking** | Realized and unrealized PnL with color-coded visual indicators (green/red) |
| **Volume & fee analysis** | Total trading volume, total fees, fee-to-profit ratio, and daily fee breakdown |
| **Win rate & trade count** | Win rate percentage and total trade count metrics |
| **Average trade duration** | Mean holding time per trade (minutes) |
| **Long/Short ratio** | Directional bias with long vs short trade counts and filter |
| **Largest gain/loss** | Single-trade extremes for risk management |
| **Average win/loss** | Mean profit per winning trade and mean loss per losing trade |

### Filtering & Charts
| Feature | Description |
|---------|-------------|
| **Symbol filter** | Filter by trading pair (e.g. SOL-PERP, BTC-PERP, ETH-PERP) |
| **Date range selection** | From/To date filters for historical analysis |
| **Historical PnL charts** | Equity curve and drawdown visualization over time |
| **Time-based performance** | Daily performance, best/worst sessions, time-of-day (hourly bucket) analysis |

### Journal & Insights
| Feature | Description |
|---------|-------------|
| **Trade history table** | Sortable table with entry/exit, symbol, direction, PnL, fees |
| **Annotation capabilities** | Add and edit notes per trade for journaling |
| **Fee composition & cumulative fees** | Daily fee breakdown and cumulative fee tracking chart |
| **Order type performance** | Per-order-type metrics: PnL, win rate, average win/loss (MARKET, LIMIT, STOP, STOP_LIMIT) |

### Innovation
- **Composite risk score** (0–100) from win rate, drawdown, and fee efficiency  
- **Behavioral insights**: win/loss streaks, best and worst symbols, best and worst sessions  
- **Portfolio overview** with allocation by symbol and volatility estimate  

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Recharts |
| **Backend** | Node.js, Express, CORS, express-rate-limit |
| **Wallet** | Phantom (Solana), with demo wallet fallback when Phantom is not installed |

---

## Project Structure

```
deriverse-analytics/
├── frontend/                 # Vite + React application
│   ├── src/
│   │   ├── api/              # tradesClient — fetches /api/trades
│   │   ├── components/       # Charts, tables, filters, layout
│   │   ├── context/          # TradeContext, filters, loading/error
│   │   ├── data/             # mockTrades.ts (fallback when API unavailable)
│   │   ├── utils/            # analytics.ts — metrics, equity, drawdown
│   │   └── ...
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts        # Proxies /api to backend
│   └── tailwind.config.js
│
└── backend/                  # Express API
    ├── data/
    │   └── mockTrades.cjs    # Demo trade data
    ├── server.cjs            # GET /api/trades, /api/health
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
git clone https://github.com/YOUR_USERNAME/deriverse-analytics.git
cd deriverse-analytics
```

### 2. Install backend dependencies

```bash
cd backend
npm install
cd ..
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

---

## Running the Project

### Backend (API)

```bash
cd backend
npm run dev
```

The API listens on **http://localhost:5001**. Endpoints:
- `GET /api/health` — health check
- `GET /api/trades?wallet=<pubkey>` — returns trade array (mock data in demo)

### Frontend

In a **separate terminal**:

```bash
cd frontend
npm run dev
```

The app runs at **http://localhost:5173**. Vite proxies `/api` to the backend.

### First run

1. Start the **backend** first.
2. Start the **frontend**.
3. Open http://localhost:5173, click **Dashboard** (Phantom optional; demo wallet works without it).
4. Explore Overview, Journal, Portfolio, and Insights pages.

---

## Deployment

### Backend (Render, Railway, Fly.io, etc.)

- **Build**: `npm install`
- **Start**: `node server.cjs` (or `npm run start`)
- **Environment**:
  - `PORT` — usually set by the host
  - `CORS_ORIGIN` — your frontend URL (e.g. `https://your-app.vercel.app`)

### Frontend (Vercel, Netlify, Cloudflare Pages)

- **Build command**: `npm run build`
- **Build output**: `dist`
- **Environment** (optional):
  - `VITE_API_BASE_URL` — backend URL. If unset, production build uses `https://atlas-x-rg57.vercel.app` by default (see `frontend/src/api/tradesClient.ts`).

---

## Security

- **Input validation**: Wallet parameter validated (Solana base58 or `demo-wallet`)
- **Rate limiting**: 60 requests/minute per IP on `/api/*`
- **CORS**: Configurable via `CORS_ORIGIN` for production
- **No custody**: Frontend never holds private keys; Phantom or demo wallet only

---

## Real Deriverse Integration

The project uses **mock trade data** for demo purposes. To integrate with real Deriverse/Solana data:

1. Replace the mock loader in `backend/server.cjs` with calls to:
   - Deriverse HTTP APIs (if available), or
   - A Solana indexer (Helius, Flipside, etc.)
2. Map on-chain fills/positions to the `Trade` shape used by the frontend.
3. Ensure the backend returns arrays matching the frontend `Trade` interface in `frontend/src/types.ts`.

---

## License

MIT

---

## Author

[Akinola Dolapo](https://x.com/AkinolaDolapo6)

## Submission

- **GitHub**: [github.com/Dollypee48/AtlasX](https://github.com/Dollypee48/AtlasX)
- **Live app**: [atlas-x-roan.vercel.app](https://atlas-x-roan.vercel.app/)
- **Author / Twitter**: [Akinola Dolapo](https://x.com/AkinolaDolapo6)

---


