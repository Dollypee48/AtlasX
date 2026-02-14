import { useMemo } from 'react'
import { format } from 'date-fns'
import { useTradeContext } from '../../context/TradeContext'
import { computeCoreMetrics } from '../../utils/analytics'

interface HeaderProps {
  onLogoClick?: () => void
}

export const Header = ({ onLogoClick }: HeaderProps) => {
  const { filteredTrades } = useTradeContext()

  const core = useMemo(
    () => computeCoreMetrics(filteredTrades),
    [filteredTrades],
  )

  const today = format(new Date(), 'dd MMM yyyy, HH:mm')

  const realizedColor =
    core.totalRealizedPnl > 0
      ? 'metric--positive'
      : core.totalRealizedPnl < 0
        ? 'metric--negative'
        : ''

  return (
    <div className="header flex items-center justify-between gap-3">
      <div
        className="cursor-pointer select-none"
        onClick={onLogoClick}
      >
        <div className="header__title text-lg font-semibold tracking-tight">
          AtlasX
        </div>
        <div className="header__subtitle text-xs text-slate-400">
          On-chain trading journal &amp; portfolio performance for Solana
        </div>
      </div>
      <div className="header__metrics hidden items-center gap-5 md:flex">
        <div className="header__metric flex flex-col items-end">
          <div className="header__metric-label text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
            Realized PnL
          </div>
          <div
            className={`header__metric-value text-sm font-semibold ${realizedColor}`}
          >
            {core.totalRealizedPnl >= 0 ? '+' : '-'}
            {Math.abs(core.totalRealizedPnl).toFixed(2)}
          </div>
        </div>
        <div className="header__metric flex flex-col items-end">
          <div className="header__metric-label text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
            Win rate
          </div>
          <div className="header__metric-value text-sm font-semibold">
            {core.winRate.toFixed(1)}%
          </div>
        </div>
        <div className="header__metric header__metric--muted flex flex-col items-end">
          <div className="header__metric-label text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
            Snapshot
          </div>
          <div className="header__metric-value text-xs text-slate-400">
            {today}
          </div>
        </div>
      </div>
    </div>
  )
}

