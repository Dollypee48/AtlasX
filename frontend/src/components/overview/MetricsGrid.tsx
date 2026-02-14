import { useMemo } from 'react'
import { useTradeContext } from '../../context/TradeContext'
import { computeCoreMetrics } from '../../utils/analytics'

export const MetricsGrid = () => {
  const { filteredTrades } = useTradeContext()
  const core = useMemo(
    () => computeCoreMetrics(filteredTrades),
    [filteredTrades],
  )

  const items = [
    {
      label: 'Realized PnL',
      value: core.totalRealizedPnl,
      format: (v: number) => v.toFixed(2),
      type: 'pnl',
    },
    {
      label: 'Unrealized PnL',
      value: core.totalUnrealizedPnl,
      format: (v: number) => v.toFixed(2),
      type: 'pnl',
    },
    {
      label: 'Largest gain',
      value: core.largestGain,
      format: (v: number) => v.toFixed(2),
      type: 'pnl',
    },
    {
      label: 'Largest loss',
      value: core.largestLoss,
      format: (v: number) => v.toFixed(2),
      type: 'pnl',
    },
    {
      label: 'Avg win',
      value: core.averageWin,
      format: (v: number) => v.toFixed(2),
      type: 'pnl',
    },
    {
      label: 'Avg loss',
      value: core.averageLoss,
      format: (v: number) => v.toFixed(2),
      type: 'pnl',
    },
    {
      label: 'Risk / Reward',
      value: core.riskRewardRatio,
      format: (v: number) => v.toFixed(2),
    },
    {
      label: 'Win rate',
      value: core.winRate,
      format: (v: number) => `${v.toFixed(1)}%`,
    },
    {
      label: 'Trades',
      value: core.tradeCount,
      format: (v: number) => v.toString(),
    },
    {
      label: 'Long / Short',
      value: core.longCount,
      format: () => `${core.longCount} / ${core.shortCount}`,
    },
    {
      label: 'Avg duration',
      value: core.averageDurationMinutes,
      format: (v: number) => `${v.toFixed(0)} min`,
    },
    {
      label: 'Volume',
      value: core.totalVolume,
      format: (v: number) => v.toFixed(0),
    },
    {
      label: 'Fees',
      value: core.totalFees,
      format: (v: number) => v.toFixed(2),
      type: 'pnl',
    },
    {
      label: 'Fee / Profit',
      value: core.feeToProfitRatio,
      format: (v: number) => `${(v * 100).toFixed(1)}%`,
    },
  ]

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const numeric = typeof item.value === 'number' ? item.value : 0
        const tone =
          item.type === 'pnl'
            ? numeric > 0
              ? 'text-profit'
              : numeric < 0
                ? 'text-loss'
                : 'text-text-secondary'
            : 'text-text-primary'

        return (
          <div
            key={item.label}
            className="rounded-xl border border-atlasx-border bg-solana-card px-3 py-2.5 shadow-card-soft"
          >
            <div className="text-[11px] text-text-muted">{item.label}</div>
            <div className={`mt-1 text-sm font-semibold ${tone}`}>
              {item.format(numeric)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

