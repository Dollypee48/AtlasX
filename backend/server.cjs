// Deriverse analytics backend — GET /api/trades?wallet=<pubkey>
// Replace mock loader with Deriverse/Solana indexer for production.

const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const { mockTrades } = require('./data/mockTrades.cjs')

const app = express()
const PORT = process.env.PORT || 5001

const PUBKEY_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/

const corsOptions = {
  origin: process.env.CORS_ORIGIN || true,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Too many requests' },
})
app.use('/api/', limiter)

function validateWallet(wallet) {
  if (typeof wallet !== 'string' || wallet.length === 0) {
    return { ok: false, error: 'wallet query param is required' }
  }
  if (wallet.length > 64) {
    return { ok: false, error: 'invalid wallet format' }
  }
  if (!PUBKEY_REGEX.test(wallet) && wallet !== 'demo-wallet') {
    return { ok: false, error: 'invalid Solana wallet address' }
  }
  return { ok: true }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/trades', (req, res) => {
  const { wallet } = req.query
  const validation = validateWallet(wallet)
  if (!validation.ok) {
    return res.status(400).json({ error: validation.error })
  }
  res.json(mockTrades)
})

app.listen(PORT, () => {
  console.log(`Deriverse analytics API listening on port ${PORT}`)
})
