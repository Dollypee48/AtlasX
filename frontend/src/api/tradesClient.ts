import type { Trade } from '../types'
import { mockTrades } from '../data/mockTrades'

/** Backend API base URL. In dev, Vite proxies /api to localhost. In production, use deployed backend. */
const DEFAULT_PRODUCTION_API = 'https://atlas-x-rg57.vercel.app'
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.PROD ? DEFAULT_PRODUCTION_API : '')

export async function fetchTradesForWallet(wallet: string): Promise<Trade[]> {
  const url = API_BASE
    ? `${API_BASE.replace(/\/$/, '')}/api/trades?wallet=${encodeURIComponent(wallet)}`
    : `/api/trades?wallet=${encodeURIComponent(wallet)}`

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`API error ${res.status}`)
    const data = await res.json()
    if (!Array.isArray(data)) throw new Error('Invalid response')
    return data as Trade[]
  } catch (e) {
    console.warn('Trades API unavailable, using mock data:', e)
    return mockTrades
  }
}
