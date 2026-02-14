import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { format } from 'date-fns'
import { useTradeContext } from '../../context/TradeContext'
import { buildDrawdownSeries, buildEquityCurve } from '../../utils/analytics'

export const DrawdownChart = () => {
  const { filteredTrades } = useTradeContext()
  const data = useMemo(() => {
    const equity = buildEquityCurve(filteredTrades)
    return buildDrawdownSeries(equity).map((d) => ({
      ...d,
      ts: new Date(d.timestamp),
      ddPct: d.peak !== 0 ? (d.drawdown / d.peak) * 100 : 0,
    }))
  }, [filteredTrades])

  return (
    <div className="rounded-xl border border-atlasx-border bg-solana-card px-3 pt-2.5 pb-3 shadow-card-soft">
      <div className="mb-1.5 flex items-center justify-between">
        <div className="text-[12px] font-medium text-text-primary">Drawdown</div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="ddGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#1f2933"
              vertical={false}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="ts"
              tickFormatter={(v) => format(v, 'dd MMM')}
              tick={{ fill: '#9ca3af', fontSize: 11 }}
            />
            <YAxis
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              tickFormatter={(v) => `${v.toFixed(1)}%`}
            />
            <Tooltip
              contentStyle={{
                background: '#020617',
                border: '1px solid #1f2933',
                borderRadius: 8,
              }}
              labelFormatter={(v) => format(v as Date, 'dd MMM yyyy HH:mm')}
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'Drawdown']}
            />
            <Area
              type="monotone"
              dataKey="ddPct"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#ddGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

