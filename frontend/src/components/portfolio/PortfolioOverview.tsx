import { useMemo } from 'react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useTradeContext } from '../../context/TradeContext'
import {
  buildEquityCurve,
  computeDailyPerformance,
} from '../../utils/analytics'

const COLORS = ['#22c55e', '#38bdf8', '#a855f7', '#f97316', '#e5e7eb']

export const PortfolioOverview = () => {
  const { filteredTrades } = useTradeContext()

  const allocation = useMemo(() => {
    const volumeBySymbol = new Map<string, number>()
    filteredTrades.forEach((t) => {
      const vol = Math.abs(t.size * t.entryPrice)
      volumeBySymbol.set(t.symbol, (volumeBySymbol.get(t.symbol) ?? 0) + vol)
    })
    const total = Array.from(volumeBySymbol.values()).reduce(
      (acc, v) => acc + v,
      0,
    )
    return Array.from(volumeBySymbol.entries()).map(([symbol, vol]) => ({
      symbol,
      value: vol,
      pct: total ? (vol / total) * 100 : 0,
    }))
  }, [filteredTrades])

  const equitySeries = useMemo(() => buildEquityCurve(filteredTrades), [
    filteredTrades,
  ])

  const volatility = useMemo(() => {
    const daily = computeDailyPerformance(filteredTrades)
    if (daily.length === 0) return 0
    const mean =
      daily.reduce((acc, d) => acc + d.realizedPnl, 0) / daily.length
    const variance =
      daily.reduce((acc, d) => {
        const diff = d.realizedPnl - mean
        return acc + diff * diff
      }, 0) / daily.length
    return Math.sqrt(variance)
  }, [filteredTrades])

  const lastEquity = equitySeries[equitySeries.length - 1]?.equity ?? 0

  return (
    <div className="h-[calc(100vh-180px)] rounded-xl border border-atlasx-border bg-solana-card px-4 pb-4 pt-3 shadow-card-soft">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-text-primary">
            Portfolio overview
          </div>
          <div className="text-[11px] text-text-muted">
            Allocation, capital growth, and risk metrics
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <div className="text-[11px] text-text-muted">Estimated equity</div>
            <div className="text-base font-semibold text-text-primary">
              {lastEquity.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-text-muted">
              Volatility (daily PnL)
            </div>
            <div className="text-base font-semibold text-text-primary">
              {volatility.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.6fr)]">
          <div className="rounded-lg border border-atlasx-borderSoft bg-atlasx-surfaceSoft px-3 py-2.5">
            <div className="text-[12px] font-medium text-text-primary">
              Allocation by symbol
            </div>
            <div className="mt-2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={allocation}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {allocation.map((entry, index) => (
                      <Cell
                        key={entry.symbol}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#020617',
                      border: '1px solid #1f2933',
                      borderRadius: 8,
                    }}
                    formatter={(value: number, _name, props) => {
                      const pct =
                        (props?.payload as any)?.pct != null
                          ? (props.payload as any).pct
                          : 0
                      return [`${value.toFixed(0)} (${pct.toFixed(1)}%)`, 'Volume']
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-col gap-1 text-[11px] text-text-secondary">
              {allocation.map((a, idx) => (
                <div key={a.symbol} className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span>
                    {a.symbol} · {a.pct.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-atlasx-borderSoft bg-atlasx-surfaceSoft px-3 py-2.5">
            <div className="text-[12px] font-medium text-text-primary">
              Portfolio notes
            </div>
            <ul className="mt-1 list-disc space-y-1 pl-4 text-[12px] text-text-secondary">
              <li>
                This view approximates capital distribution using trade notional
                volume per symbol over the selected period.
              </li>
              <li>
                For on-chain integration, replace mock data with positions and
                PnL sourced from Deriverse Solana programs.
              </li>
              <li>
                Volatility is estimated from daily realized PnL; you can evolve
                this into a full return-based risk model.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

