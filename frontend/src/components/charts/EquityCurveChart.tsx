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
import { buildEquityCurve } from '../../utils/analytics'

export const EquityCurveChart = () => {
  const { filteredTrades } = useTradeContext()
  const data = useMemo(
    () =>
      buildEquityCurve(filteredTrades).map((p) => ({
        ...p,
        ts: new Date(p.timestamp),
      })),
    [filteredTrades],
  )

  return (
    <div className="rounded-xl border border-atlasx-border bg-solana-card px-3 pt-2.5 pb-3 shadow-card-soft">
      <div className="mb-1.5 flex items-center justify-between">
        <div className="text-[12px] font-medium text-text-primary">
          Equity curve
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
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
              tickFormatter={(v) => v.toFixed(0)}
            />
            <Tooltip
              contentStyle={{
                background: '#020617',
                border: '1px solid #1f2933',
                borderRadius: 8,
              }}
              labelFormatter={(v) => format(v as Date, 'dd MMM yyyy HH:mm')}
              formatter={(value: number) => [value.toFixed(2), 'Equity']}
            />
            <Area
              type="monotone"
              dataKey="equity"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#equityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

