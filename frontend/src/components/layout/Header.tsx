import { useMemo } from 'react'
import { format } from 'date-fns'
import { useTradeContext } from '../../context/TradeContext'
import { computeCoreMetrics } from '../../utils/analytics'

interface HeaderProps {
  onLogoClick?: () => void
  onLogout?: () => void
  publicKey?: string | null
}

function shortenAddress(pk: string, chars = 4): string {
  if (pk === 'demo-wallet') return 'Demo'
  if (pk.length <= chars * 2 + 2) return pk
  return `${pk.slice(0, chars)}…${pk.slice(-chars)}`
}

export const Header = ({ onLogoClick, onLogout, publicKey }: HeaderProps) => {
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
      <div className="flex items-center gap-3">
        {publicKey && (
          <span
            className="rounded-full border border-slate-600 bg-slate-800/60 px-2.5 py-1 text-[11px] text-slate-400"
            title={publicKey}
          >
            {shortenAddress(publicKey)}
          </span>
        )}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full border border-slate-600 bg-slate-800/60 px-3 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700/60 hover:text-white"
          >
            Log out
          </button>
        )}
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
    </div>
  )
}

