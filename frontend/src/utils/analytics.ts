import { differenceInMinutes, formatISO, parseISO } from 'date-fns'
import type {
  DailyPerformance,
  DrawdownPoint,
  EquityPoint,
  SymbolPerformance,
  TimeOfDayPerformance,
  Trade,
} from '../types'

export interface CoreMetrics {
  totalRealizedPnl: number
  totalUnrealizedPnl: number
  largestGain: number
  largestLoss: number
  averageWin: number
  averageLoss: number
  riskRewardRatio: number
  tradeCount: number
  winRate: number
  longCount: number
  shortCount: number
  averageDurationMinutes: number
  totalVolume: number
  totalFees: number
  feeToProfitRatio: number
}

export interface BehavioralInsights {
  bestSession: string | null
  worstSession: string | null
  bestSymbol: string | null
  worstSymbol: string | null
  longestWinStreak: number
  longestLossStreak: number
  currentStreak: {
    type: 'WIN' | 'LOSS' | null
    length: number
  }
  riskScore: number // 0 - 100, higher is better
}

export interface OrderTypePerformance {
  orderType: string
  realizedPnl: number
  tradeCount: number
  winRate: number
  averageWin: number
  averageLoss: number
}

export const isTradeClosed = (trade: Trade) =>
  typeof trade.exitPrice === 'number' && !!trade.exitTime

export const tradePnl = (trade: Trade, markPrice?: number): number => {
  const exitPrice = isTradeClosed(trade)
    ? (trade.exitPrice as number)
    : markPrice ?? trade.entryPrice

  const directionFactor = trade.direction === 'LONG' ? 1 : -1
  const gross = directionFactor * (exitPrice - trade.entryPrice) * trade.size
  return gross - trade.fees
}

export const realizedPnl = (trade: Trade): number =>
  isTradeClosed(trade) ? tradePnl(trade) : 0

export const unrealizedPnl = (trade: Trade, markPrice: number): number =>
  !isTradeClosed(trade) ? tradePnl(trade, markPrice) : 0

export const buildEquityCurve = (
  trades: Trade[],
  startingEquity = 0,
): EquityPoint[] => {
  const closedTrades = trades
    .filter(isTradeClosed)
    .sort(
      (a, b) =>
        parseISO(a.exitTime as string).getTime() -
        parseISO(b.exitTime as string).getTime(),
    )

  let equity = startingEquity
  const points: EquityPoint[] = []

  closedTrades.forEach((t) => {
    equity += realizedPnl(t)
    points.push({
      timestamp: t.exitTime as string,
      equity,
    })
  })

  if (points.length === 0) {
    return [
      {
        timestamp: formatISO(new Date()),
        equity: startingEquity,
      },
    ]
  }

  return points
}

export const buildDrawdownSeries = (
  equity: EquityPoint[],
): DrawdownPoint[] => {
  let peak = equity[0]?.equity ?? 0
  return equity.map((p) => {
    peak = Math.max(peak, p.equity)
    const drawdown = p.equity - peak
    return {
      timestamp: p.timestamp,
      drawdown,
      peak,
    }
  })
}

export const computeCoreMetrics = (
  trades: Trade[],
  markPrices: Record<string, number> = {},
): CoreMetrics => {
  let totalRealizedPnl = 0
  let totalUnrealizedPnl = 0
  let largestGain = 0
  let largestLoss = 0
  let winSum = 0
  let lossSum = 0
  let winCount = 0
  let lossCount = 0
  let durationSum = 0
  let durationCount = 0
  let longCount = 0
  let shortCount = 0
  let totalVolume = 0
  let totalFees = 0

  trades.forEach((t) => {
    const mark = markPrices[t.symbol]
    const pnl = tradePnl(t, mark)
    const r = realizedPnl(t)

    totalRealizedPnl += r

    if (!isTradeClosed(t) && mark != null) {
      totalUnrealizedPnl += unrealizedPnl(t, mark)
    }

    largestGain = Math.max(largestGain, pnl)
    largestLoss = Math.min(largestLoss, pnl)

    if (pnl > 0) {
      winSum += pnl
      winCount += 1
    } else if (pnl < 0) {
      lossSum += pnl
      lossCount += 1
    }

    if (isTradeClosed(t) && t.exitTime) {
      durationSum += differenceInMinutes(
        parseISO(t.exitTime),
        parseISO(t.entryTime),
      )
      durationCount += 1
    }

    if (t.direction === 'LONG') longCount += 1
    else shortCount += 1

    totalVolume += Math.abs(t.size * t.entryPrice)
    totalFees += t.fees
  })

  const averageWin = winCount ? winSum / winCount : 0
  const averageLoss = lossCount ? lossSum / lossCount : 0
  const riskRewardRatio =
    averageLoss !== 0 ? Math.abs(averageWin / averageLoss) : 0

  const winRate = trades.length ? (winCount / trades.length) * 100 : 0
  const averageDurationMinutes = durationCount
    ? durationSum / durationCount
    : 0

  const feeToProfitRatio =
    totalRealizedPnl !== 0 ? totalFees / Math.abs(totalRealizedPnl) : 0

  return {
    totalRealizedPnl,
    totalUnrealizedPnl,
    largestGain,
    largestLoss,
    averageWin,
    averageLoss,
    riskRewardRatio,
    tradeCount: trades.length,
    winRate,
    longCount,
    shortCount,
    averageDurationMinutes,
    totalVolume,
    totalFees,
    feeToProfitRatio,
  }
}

export const computeDailyPerformance = (
  trades: Trade[],
): DailyPerformance[] => {
  const byDay = new Map<string, DailyPerformance>()

  trades.forEach((t) => {
    if (!isTradeClosed(t) || !t.exitTime) return
    const day = formatISO(parseISO(t.exitTime), { representation: 'date' })

    const existing = byDay.get(day) ?? {
      date: day,
      realizedPnl: 0,
      fees: 0,
      volume: 0,
      tradeCount: 0,
    }

    existing.realizedPnl += realizedPnl(t)
    existing.fees += t.fees
    existing.volume += Math.abs(t.size * t.entryPrice)
    existing.tradeCount += 1

    byDay.set(day, existing)
  })

  return Array.from(byDay.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  )
}

export const computeTimeOfDayPerformance = (
  trades: Trade[],
): TimeOfDayPerformance[] => {
  const bucketKey = (d: Date) => {
    const hour = d.getHours()
    const start = hour.toString().padStart(2, '0')
    const end = ((hour + 1) % 24).toString().padStart(2, '0')
    return `${start}:00-${end}:00`
  }

  const map = new Map<string, TimeOfDayPerformance>()

  trades.forEach((t) => {
    if (!isTradeClosed(t) || !t.exitTime) return
    const key = bucketKey(parseISO(t.exitTime))
    const existing = map.get(key) ?? { bucket: key, realizedPnl: 0, tradeCount: 0 }
    existing.realizedPnl += realizedPnl(t)
    existing.tradeCount += 1
    map.set(key, existing)
  })

  return Array.from(map.values()).sort((a, b) =>
    a.bucket.localeCompare(b.bucket),
  )
}

export const computeSymbolPerformance = (
  trades: Trade[],
): SymbolPerformance[] => {
  const map = new Map<string, SymbolPerformance>()

  trades.forEach((t) => {
    const existing = map.get(t.symbol) ?? {
      symbol: t.symbol,
      realizedPnl: 0,
      volume: 0,
      tradeCount: 0,
      winRate: 0,
    }

    if (isTradeClosed(t)) {
      const pnl = realizedPnl(t)
      existing.realizedPnl += pnl
      if (pnl > 0) {
        // we will recompute winRate later
      }
    }

    existing.volume += Math.abs(t.size * t.entryPrice)
    existing.tradeCount += 1
    map.set(t.symbol, existing)
  })

  // compute win rate per symbol
  const winCounts = new Map<string, number>()
  trades.forEach((t) => {
    if (!isTradeClosed(t)) return
    const pnl = realizedPnl(t)
    if (pnl > 0) {
      winCounts.set(t.symbol, (winCounts.get(t.symbol) ?? 0) + 1)
    }
  })

  return Array.from(map.values()).map((sp) => ({
    ...sp,
    winRate: sp.tradeCount
      ? ((winCounts.get(sp.symbol) ?? 0) / sp.tradeCount) * 100
      : 0,
  }))
}

export const computeOrderTypePerformance = (
  trades: Trade[],
): OrderTypePerformance[] => {
  const map = new Map<string, OrderTypePerformance>()

  trades.forEach((t) => {
    const existing = map.get(t.orderType) ?? {
      orderType: t.orderType,
      realizedPnl: 0,
      tradeCount: 0,
      winRate: 0,
      averageWin: 0,
      averageLoss: 0,
    }

    if (isTradeClosed(t)) {
      const pnl = realizedPnl(t)
      existing.realizedPnl += pnl
      existing.tradeCount += 1
    }

    map.set(t.orderType, existing)
  })

  // compute win / loss stats per order type
  const winStats = new Map<
    string,
    { winSum: number; winCount: number; lossSum: number; lossCount: number }
  >()

  trades.forEach((t) => {
    if (!isTradeClosed(t)) return
    const pnl = realizedPnl(t)
    const key = t.orderType
    const existing =
      winStats.get(key) ?? { winSum: 0, winCount: 0, lossSum: 0, lossCount: 0 }
    if (pnl > 0) {
      existing.winSum += pnl
      existing.winCount += 1
    } else if (pnl < 0) {
      existing.lossSum += pnl
      existing.lossCount += 1
    }
    winStats.set(key, existing)
  })

  return Array.from(map.values()).map((ot) => {
    const stats = winStats.get(ot.orderType) ?? {
      winSum: 0,
      winCount: 0,
      lossSum: 0,
      lossCount: 0,
    }
    const totalClosed = stats.winCount + stats.lossCount
    const winRate =
      totalClosed > 0 ? (stats.winCount / totalClosed) * 100 : 0
    const averageWin = stats.winCount ? stats.winSum / stats.winCount : 0
    const averageLoss = stats.lossCount ? stats.lossSum / stats.lossCount : 0

    return {
      ...ot,
      winRate,
      averageWin,
      averageLoss,
    }
  })
}

export const computeBehavioralInsights = (trades: Trade[]): BehavioralInsights => {
  const daily = computeDailyPerformance(trades)
  const symbolPerf = computeSymbolPerformance(trades)

  const bestDay = daily.reduce(
    (best, cur) => (cur.realizedPnl > (best?.realizedPnl ?? -Infinity) ? cur : best),
    null as DailyPerformance | null,
  )
  const worstDay = daily.reduce(
    (worst, cur) =>
      cur.realizedPnl < (worst?.realizedPnl ?? Infinity) ? cur : worst,
    null as DailyPerformance | null,
  )

  const bestSymbol = symbolPerf.reduce(
    (best, cur) =>
      cur.realizedPnl > (best?.realizedPnl ?? -Infinity) ? cur : best,
    null as SymbolPerformance | null,
  )
  const worstSymbol = symbolPerf.reduce(
    (worst, cur) =>
      cur.realizedPnl < (worst?.realizedPnl ?? Infinity) ? cur : worst,
    null as SymbolPerformance | null,
  )

  // streaks over closed trades sorted by exit time
  const closed = trades
    .filter(isTradeClosed)
    .sort(
      (a, b) =>
        parseISO(a.exitTime as string).getTime() -
        parseISO(b.exitTime as string).getTime(),
    )

  let longestWinStreak = 0
  let longestLossStreak = 0
  let currentType: 'WIN' | 'LOSS' | null = null
  let currentLength = 0

  closed.forEach((t) => {
    const pnl = realizedPnl(t)
    const type: 'WIN' | 'LOSS' | null = pnl > 0 ? 'WIN' : pnl < 0 ? 'LOSS' : null
    if (!type) return

    if (type === currentType) {
      currentLength += 1
    } else {
      if (currentType === 'WIN') {
        longestWinStreak = Math.max(longestWinStreak, currentLength)
      } else if (currentType === 'LOSS') {
        longestLossStreak = Math.max(longestLossStreak, currentLength)
      }
      currentType = type
      currentLength = 1
    }
  })

  if (currentType === 'WIN') {
    longestWinStreak = Math.max(longestWinStreak, currentLength)
  } else if (currentType === 'LOSS') {
    longestLossStreak = Math.max(longestLossStreak, currentLength)
  }

  const core = computeCoreMetrics(trades)
  const equity = buildEquityCurve(trades)
  const drawdownSeries = buildDrawdownSeries(equity)
  const maxDrawdown = Math.min(...drawdownSeries.map((d) => d.drawdown), 0)

  // simple risk score: combine win rate, inverse max drawdown, and fee efficiency
  const winScore = Math.min(Math.max(core.winRate / 2, 0), 50) // 0-50
  const ddScore =
    maxDrawdown < 0 ? Math.min((1 / (1 + Math.abs(maxDrawdown))) * 30, 30) : 30
  const feeScore =
    core.feeToProfitRatio > 0
      ? Math.min((1 / (1 + core.feeToProfitRatio)) * 20, 20)
      : 20

  const riskScore = Math.round(Math.min(winScore + ddScore + feeScore, 100))

  return {
    bestSession: bestDay?.date ?? null,
    worstSession: worstDay?.date ?? null,
    bestSymbol: bestSymbol?.symbol ?? null,
    worstSymbol: worstSymbol?.symbol ?? null,
    longestWinStreak,
    longestLossStreak,
    currentStreak: {
      type: currentType,
      length: currentLength,
    },
    riskScore,
  }
}

