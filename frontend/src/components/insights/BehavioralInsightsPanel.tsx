import { useMemo } from 'react'
import { useTradeContext } from '../../context/TradeContext'
import {
  computeBehavioralInsights,
  computeOrderTypePerformance,
  computeTimeOfDayPerformance,
} from '../../utils/analytics'

export const BehavioralInsightsPanel = () => {
  const { filteredTrades } = useTradeContext()
  const insights = useMemo(
    () => computeBehavioralInsights(filteredTrades),
    [filteredTrades],
  )
  const timeOfDay = useMemo(
    () => computeTimeOfDayPerformance(filteredTrades),
    [filteredTrades],
  )
  const orderTypePerf = useMemo(
    () => computeOrderTypePerformance(filteredTrades),
    [filteredTrades],
  )

  return (
    <div className="h-[calc(100vh-180px)] rounded-xl border border-atlasx-border bg-solana-card px-4 pb-4 pt-3 shadow-card-soft">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-text-primary">
            Behavioural insights
          </div>
          <div className="text-[11px] text-text-muted">
            Streaks, timing, and risk discipline
          </div>
        </div>
      </div>
      <div className="flex h-[calc(100%-40px)] flex-col gap-3">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-atlasx-borderSoft bg-atlasx-surfaceSoft px-3 py-2.5">
            <div className="text-[11px] text-text-muted">Risk score</div>
            <div className="mt-1 text-lg font-semibold text-text-primary">
              {insights.riskScore}/100
            </div>
            <div className="mt-1 text-[11px] text-text-muted">
              Composite of win rate, max drawdown, and fee efficiency.
            </div>
          </div>
          <div className="rounded-lg border border-atlasx-borderSoft bg-atlasx-surfaceSoft px-3 py-2.5">
            <div className="text-[11px] text-text-muted">Best session</div>
            <div className="mt-1 text-sm font-semibold text-profit">
              {insights.bestSession ?? 'N/A'}
            </div>
            <div className="mt-1 text-[11px] text-text-muted">
              Day with the highest realized PnL in the filtered range.
            </div>
          </div>
          <div className="rounded-lg border border-atlasx-borderSoft bg-atlasx-surfaceSoft px-3 py-2.5">
            <div className="text-[11px] text-text-muted">Worst session</div>
            <div className="mt-1 text-sm font-semibold text-loss">
              {insights.worstSession ?? 'N/A'}
            </div>
            <div className="mt-1 text-[11px] text-text-muted">
              Day with the largest loss — review trade notes here.
            </div>
          </div>
          <div className="rounded-lg border border-atlasx-borderSoft bg-atlasx-surfaceSoft px-3 py-2.5">
            <div className="text-[11px] text-text-muted">Best symbol</div>
            <div className="mt-1 text-sm font-semibold text-profit">
              {insights.bestSymbol ?? 'N/A'}
            </div>
            <div className="mt-1 text-[11px] text-text-muted">
              Underlying with the strongest profit contribution.
            </div>
          </div>
          <div className="rounded-lg border border-atlasx-borderSoft bg-atlasx-surfaceSoft px-3 py-2.5">
            <div className="text-[11px] text-text-muted">Worst symbol</div>
            <div className="mt-1 text-sm font-semibold text-loss">
              {insights.worstSymbol ?? 'N/A'}
            </div>
            <div className="mt-1 text-[11px] text-text-muted">
              Consider reducing risk or refining strategy here.
            </div>
          </div>
          <div className="rounded-lg border border-atlasx-borderSoft bg-atlasx-surfaceSoft px-3 py-2.5">
            <div className="text-[11px] text-text-muted">Streaks</div>
            <div className="mt-1 text-sm font-semibold text-text-primary">
              Win {insights.longestWinStreak} · Loss {insights.longestLossStreak}
            </div>
            <div className="mt-1 text-[11px] text-text-muted">
              Current:{' '}
              {insights.currentStreak.type
                ? `${insights.currentStreak.type.toLowerCase()} ×${
                    insights.currentStreak.length
                  }`
                : 'neutral'}
            </div>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-atlasx-borderSoft bg-atlasx-surfaceSoft px-3 py-2.5">
            <div className="text-[12px] font-medium text-text-primary">
              Order type performance
            </div>
            <div className="mt-2 grid gap-2 text-[11px] text-text-secondary">
              {orderTypePerf.map((ot) => (
                <div
                  key={ot.orderType}
                  className="flex items-center justify-between rounded-md border border-atlasx-borderSoft/60 bg-atlasx-bg/40 px-2 py-1.5"
                >
                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-text-primary">
                      {ot.orderType}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {ot.tradeCount} trades · {ot.winRate.toFixed(1)}% win rate
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-text-muted">
                      Avg win / loss
                    </span>
                    <span className="text-[11px] font-semibold">
                      {ot.averageWin.toFixed(2)} / {ot.averageLoss.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
              {orderTypePerf.length === 0 && (
                <div className="text-[11px] text-text-muted">
                  No closed trades in the selected range yet.
                </div>
              )}
            </div>
          </div>
          <div className="mt-1 flex-1">
            <div className="mb-1 text-[12px] font-medium text-text-primary">
              Time-of-day performance
            </div>
            <div className="grid gap-2 md:grid-cols-4">
              {timeOfDay.map((bucket) => (
                <div
                  key={bucket.bucket}
                  className="rounded-lg border border-atlasx-borderSoft bg-atlasx-surfaceSoft px-2.5 py-2 text-[11px]"
                >
                  <div className="text-text-secondary">{bucket.bucket}</div>
                  <div
                    className={`mt-0.5 text-sm font-semibold ${
                      bucket.realizedPnl > 0
                        ? 'text-profit'
                        : bucket.realizedPnl < 0
                          ? 'text-loss'
                          : 'text-text-secondary'
                    }`}
                  >
                    {bucket.realizedPnl.toFixed(2)}
                  </div>
                  <div className="mt-0.5 text-[10px] text-text-muted">
                    {bucket.tradeCount} trades
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

