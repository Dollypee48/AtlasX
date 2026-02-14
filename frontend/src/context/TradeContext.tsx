import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { isWithinInterval, parseISO } from 'date-fns'
import type { Trade } from '../types'
import { useWalletContext } from '../solanaWallet'
import { fetchTradesForWallet } from '../api/tradesClient'

export interface TradeFilters {
  startDate?: string
  endDate?: string
  symbol?: string
  direction?: 'LONG' | 'SHORT'
  orderType?: string
}

interface TradeContextValue {
  allTrades: Trade[]
  filteredTrades: Trade[]
  filters: TradeFilters
  setFilters: (next: TradeFilters) => void
  updateTradeNote: (id: string, notes: string) => void
  loading: boolean
  error: string | null
}

const TradeContext = createContext<TradeContextValue | undefined>(undefined)

export const TradeProvider = ({ children }: { children: ReactNode }) => {
  const { publicKey, connected } = useWalletContext()
  const [trades, setTrades] = useState<Trade[]>([])
  const [filters, setFilters] = useState<TradeFilters>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!connected || !publicKey) {
      setTrades([])
      return
    }

    setLoading(true)
    setError(null)
    fetchTradesForWallet(publicKey)
      .then(setTrades)
      .catch((e) => {
        console.error(e)
        setError('Unable to load trades for this wallet.')
      })
      .finally(() => setLoading(false))
  }, [connected, publicKey])

  const filteredTrades = useMemo(() => {
    return trades.filter((t) => {
      if (filters.symbol && t.symbol !== filters.symbol) return false
      if (filters.direction && t.direction !== filters.direction) return false
      if (filters.orderType && t.orderType !== filters.orderType) return false

      if (filters.startDate || filters.endDate) {
        const ts = parseISO(t.entryTime)
        const start = filters.startDate
          ? parseISO(filters.startDate)
          : undefined
        const end = filters.endDate ? parseISO(filters.endDate) : undefined

        if (
          !isWithinInterval(ts, {
            start: start ?? ts,
            end: end ?? ts,
          })
        ) {
          return false
        }
      }

      return true
    })
  }, [trades, filters])

  const updateTradeNote = (id: string, notes: string) => {
    setTrades((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              notes,
            }
          : t,
      ),
    )
  }

  const value: TradeContextValue = {
    allTrades: trades,
    filteredTrades,
    filters,
    setFilters,
    updateTradeNote,
    loading,
    error,
  }

  return <TradeContext.Provider value={value}>{children}</TradeContext.Provider>
}

export const useTradeContext = (): TradeContextValue => {
  const ctx = useContext(TradeContext)
  if (!ctx) {
    throw new Error('useTradeContext must be used within TradeProvider')
  }
  return ctx
}

