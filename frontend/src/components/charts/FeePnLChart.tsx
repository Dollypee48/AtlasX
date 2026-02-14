import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { format } from 'date-fns'
import { useTradeContext } from '../../context/TradeContext'
import { computeDailyPerformance } from '../../utils/analytics'

export const FeePnLChart = () => {
  const { filteredTrades } = useTradeContext()

  const data = useMemo(
    () =>
      computeDailyPerformance(filteredTrades).reduce(
        (acc, d) => {
          const dateObj = new Date(d.date)
          const cumulativeFees =
            (acc.length > 0 ? acc[acc.length - 1].cumulativeFees : 0) + d.fees
          acc.push({
            ...d,
            dateObj,
            cumulativeFees,
          })
          return acc
        },
        [] as Array<
          ReturnType<typeof computeDailyPerformance>[number] & {
            dateObj: Date
            cumulativeFees: number
          }
        >,
      ),
    [filteredTrades],
  )

  return (
    <div className="rounded-xl border border-atlasx-border bg-solana-card px-3 pt-2.5 pb-3 shadow-card-soft">
      <div className="mb-1.5 flex items-center justify-between">
        <div className="text-[12px] font-medium text-text-primary">
          Daily PnL &amp; Fees
        </div>
      </div>
      <div className="grid h-72 gap-3 md:grid-cols-2">
        <div className="min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid
                stroke="#1f2933"
                vertical={false}
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="dateObj"
                tickFormatter={(v) => format(v, 'dd MMM')}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
              />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: '#020617',
                  border: '1px solid #1f2933',
                  borderRadius: 8,
                }}
                labelFormatter={(v) => format(v as Date, 'dd MMM yyyy')}
              />
              <Legend />
              <Bar dataKey="realizedPnl" name="PnL" fill="#22c55e" />
              <Bar dataKey="fees" name="Fees" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                stroke="#1f2933"
                vertical={false}
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="dateObj"
                tickFormatter={(v) => format(v, 'dd MMM')}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
              />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: '#020617',
                  border: '1px solid #1f2933',
                  borderRadius: 8,
                }}
                labelFormatter={(v) => format(v as Date, 'dd MMM yyyy')}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="volume"
                name="Volume"
                stroke="#38bdf8"
              />
              <Line
                type="monotone"
                dataKey="cumulativeFees"
                name="Cumulative fees"
                stroke="#f97316"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

