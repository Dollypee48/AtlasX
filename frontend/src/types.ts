export type TradeDirection = 'LONG' | 'SHORT'

export type OrderType = 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT'

export interface Trade {
  id: string
  symbol: string
  direction: TradeDirection
  orderType: OrderType
  size: number // position size in base units
  entryPrice: number
  exitPrice?: number // undefined => still open
  entryTime: string // ISO string
  exitTime?: string // ISO string
  fees: number // total fees paid for this trade (quote currency)
  notes?: string
  strategyTag?: string
}

export interface EquityPoint {
  timestamp: string
  equity: number
}

export interface DrawdownPoint {
  timestamp: string
  drawdown: number
  peak: number
}

export interface DailyPerformance {
  date: string
  realizedPnl: number
  fees: number
  volume: number
  tradeCount: number
}

export interface TimeOfDayPerformance {
  bucket: string // e.g. "09:00-10:00"
  realizedPnl: number
  tradeCount: number
}

export interface SymbolPerformance {
  symbol: string
  realizedPnl: number
  volume: number
  tradeCount: number
  winRate: number
}

export interface PortfolioSnapshot {
  symbol: string
  netPosition: number
  averageEntryPrice: number
  marketPrice: number
}

export interface PortfolioMetrics {
  totalEquity: number
  capitalGrowthSeries: EquityPoint[]
  volatility: number
  sharpeRatio?: number
}

