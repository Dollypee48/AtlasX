import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useTradeContext } from '../../context/TradeContext'
import { isTradeClosed, realizedPnl } from '../../utils/analytics'
import type { Trade } from '../../types'

type SortKey = 'entryTime' | 'symbol' | 'direction' | 'pnl'

const PAGE_SIZE = 8

export const TradeTable = () => {
  const { filteredTrades, updateTradeNote } = useTradeContext()
  const [page, setPage] = useState(0)
  const [sortKey, setSortKey] = useState<SortKey>('entryTime')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftNote, setDraftNote] = useState('')

  const sortedTrades = useMemo(() => {
    const copy = [...filteredTrades]
    copy.sort((a, b) => {
      let aVal: number | string = ''
      let bVal: number | string = ''
      if (sortKey === 'pnl') {
        aVal = realizedPnl(a)
        bVal = realizedPnl(b)
      } else {
        aVal = (a as any)[sortKey]
        bVal = (b as any)[sortKey]
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return copy
  }, [filteredTrades, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sortedTrades.length / PAGE_SIZE))
  const pageTrades = sortedTrades.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  )

  const changeSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const startEdit = (trade: Trade) => {
    setEditingId(trade.id)
    setDraftNote(trade.notes ?? '')
  }

  const saveEdit = () => {
    if (editingId != null) {
      updateTradeNote(editingId, draftNote)
    }
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  return (
    <div className="h-[calc(100vh-180px)] rounded-xl border border-atlasx-border bg-solana-card shadow-card-soft">
      <div className="flex items-center justify-between border-b border-atlasx-borderSoft px-4 py-2.5">
        <div>
          <div className="text-sm font-medium text-text-primary">
            Trade history
          </div>
          <div className="text-[11px] text-text-muted">
            Full trade-level view with journaling
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-text-muted">
          <button
            type="button"
            className="inline-flex items-center rounded-full border border-atlasx-borderSoft bg-atlasx-surfaceSoft/70 px-2 py-1 text-[11px] text-text-secondary hover:bg-state-hover disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Prev
          </button>
          <span>
            Page {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            className="inline-flex items-center rounded-full border border-atlasx-borderSoft bg-atlasx-surfaceSoft/70 px-2 py-1 text-[11px] text-text-secondary hover:bg-state-hover disabled:opacity-40"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Next
          </button>
        </div>
      </div>
      <div className="h-[calc(100%-52px)] overflow-auto px-2 pb-2 pt-1">
        <table className="w-full border-collapse text-xs text-text-secondary">
          <thead className="sticky top-0 z-10 bg-atlasx-surface">
            <tr className="border-b border-atlasx-borderSoft text-[11px] text-text-muted">
              <th
                onClick={() => changeSort('entryTime')}
                className="cursor-pointer px-3 py-2 text-left font-medium"
              >
                Entry
              </th>
              <th className="px-3 py-2 text-left font-medium">Exit</th>
              <th
                onClick={() => changeSort('symbol')}
                className="cursor-pointer px-3 py-2 text-left font-medium"
              >
                Symbol
              </th>
              <th
                onClick={() => changeSort('direction')}
                className="cursor-pointer px-3 py-2 text-left font-medium"
              >
                Side
              </th>
              <th className="px-3 py-2 text-left font-medium">Order</th>
              <th className="px-3 py-2 text-left font-medium">Size</th>
              <th className="px-3 py-2 text-left font-medium">Entry Px</th>
              <th className="px-3 py-2 text-left font-medium">Exit Px</th>
              <th
                onClick={() => changeSort('pnl')}
                className="cursor-pointer px-3 py-2 text-right font-medium"
              >
                PnL
              </th>
              <th className="px-3 py-2 text-right font-medium">Fees</th>
              <th className="px-3 py-2 text-left font-medium">Tag</th>
              <th className="px-3 py-2 text-left font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {pageTrades.map((t) => {
              const closed = isTradeClosed(t)
              const pnl = realizedPnl(t)
              const pnlClass =
                pnl > 0 ? 'text-profit' : pnl < 0 ? 'text-loss' : 'text-text-secondary'

              const isEditing = editingId === t.id

              return (
                <tr
                  key={t.id}
                  className="border-b border-atlasx-borderSoft hover:bg-state-hover"
                >
                  <td className="px-3 py-1.5 text-text-primary">
                    {format(new Date(t.entryTime), 'dd MMM HH:mm')}
                  </td>
                  <td className="px-3 py-1.5">
                    {closed && t.exitTime
                      ? format(new Date(t.exitTime), 'dd MMM HH:mm')
                      : 'Open'}
                  </td>
                  <td className="px-3 py-1.5 text-text-primary">{t.symbol}</td>
                  <td className="px-3 py-1.5">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                        t.direction === 'LONG'
                          ? 'border-profit-muted bg-profit-soft text-profit'
                          : 'border-loss-muted bg-loss-soft text-loss'
                      }`}
                    >
                      {t.direction}
                    </span>
                  </td>
                  <td className="px-3 py-1.5">{t.orderType}</td>
                  <td className="px-3 py-1.5">{t.size}</td>
                  <td className="px-3 py-1.5">{t.entryPrice.toFixed(2)}</td>
                  <td className="px-3 py-1.5">
                    {t.exitPrice?.toFixed(2) ?? '-'}
                  </td>
                  <td className={`px-3 py-1.5 text-right font-medium ${pnlClass}`}>
                    {pnl.toFixed(2)}
                  </td>
                  <td className="px-3 py-1.5 text-right">{t.fees.toFixed(2)}</td>
                  <td className="px-3 py-1.5">{t.strategyTag ?? '-'}</td>
                  <td className="px-3 py-1.5">
                    {isEditing ? (
                      <div className="flex flex-col gap-1">
                        <textarea
                          value={draftNote}
                          onChange={(e) => setDraftNote(e.target.value)}
                          className="w-60 min-h-[60px] resize-y rounded-md border border-atlasx-borderSoft bg-atlasx-bg px-2 py-1 text-[11px] text-text-primary outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center rounded-full bg-brand px-3 py-1 text-[11px] font-medium text-text-inverse hover:bg-emerald-400"
                            onClick={saveEdit}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center rounded-full border border-atlasx-borderSoft bg-atlasx-surfaceSoft/70 px-3 py-1 text-[11px] text-text-secondary hover:bg-state-hover"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="w-60 truncate rounded-md border border-atlasx-borderSoft bg-atlasx-surfaceSoft/70 px-2 py-1 text-left text-[11px] text-text-secondary hover:bg-state-hover"
                        onClick={() => startEdit(t)}
                      >
                        {t.notes && t.notes.length > 0
                          ? t.notes
                          : 'Add note…'}
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

