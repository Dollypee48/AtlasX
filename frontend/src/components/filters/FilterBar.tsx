import { useTradeContext } from '../../context/TradeContext'

export const FilterBar = () => {
  const { filters, setFilters, allTrades } = useTradeContext()

  const symbols = Array.from(new Set(allTrades.map((t) => t.symbol)))
  const orderTypes = Array.from(new Set(allTrades.map((t) => t.orderType)))

  return (
    <div className="filter-bar mb-2 flex items-center justify-between gap-3">
      <div className="filter-bar__group flex flex-wrap items-center gap-3">
        <label className="filter-bar__label flex flex-col text-[11px] text-slate-400">
          From
          <input
            type="date"
            className="filter-bar__input mt-0.5 min-w-[140px] rounded-md border border-slate-800 bg-slate-950/70 px-2 py-1 text-xs text-slate-100 outline-none ring-emerald-500/60 focus:border-emerald-500 focus:ring-1"
            value={filters.startDate ?? ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                startDate: e.target.value || undefined,
              })
            }
          />
        </label>
        <label className="filter-bar__label flex flex-col text-[11px] text-slate-400">
          To
          <input
            type="date"
            className="filter-bar__input mt-0.5 min-w-[140px] rounded-md border border-slate-800 bg-slate-950/70 px-2 py-1 text-xs text-slate-100 outline-none ring-emerald-500/60 focus:border-emerald-500 focus:ring-1"
            value={filters.endDate ?? ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                endDate: e.target.value || undefined,
              })
            }
          />
        </label>
      </div>
      <div className="filter-bar__group flex flex-wrap items-center gap-3">
        <label className="filter-bar__label flex flex-col text-[11px] text-slate-400">
          Symbol
          <select
            className="filter-bar__input mt-0.5 min-w-[120px] rounded-md border border-slate-800 bg-slate-950/70 px-2 py-1 text-xs text-slate-100 outline-none ring-emerald-500/60 focus:border-emerald-500 focus:ring-1"
            value={filters.symbol ?? ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                symbol: e.target.value || undefined,
              })
            }
          >
            <option value="">All</option>
            {symbols.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-bar__label flex flex-col text-[11px] text-slate-400">
          Direction
          <select
            className="filter-bar__input mt-0.5 min-w-[110px] rounded-md border border-slate-800 bg-slate-950/70 px-2 py-1 text-xs text-slate-100 outline-none ring-emerald-500/60 focus:border-emerald-500 focus:ring-1"
            value={filters.direction ?? ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                direction: (e.target.value || undefined) as
                  | 'LONG'
                  | 'SHORT'
                  | undefined,
              })
            }
          >
            <option value="">All</option>
            <option value="LONG">Long</option>
            <option value="SHORT">Short</option>
          </select>
        </label>
        <label className="filter-bar__label flex flex-col text-[11px] text-slate-400">
          Order Type
          <select
            className="filter-bar__input mt-0.5 min-w-[130px] rounded-md border border-slate-800 bg-slate-950/70 px-2 py-1 text-xs text-slate-100 outline-none ring-emerald-500/60 focus:border-emerald-500 focus:ring-1"
            value={filters.orderType ?? ''}
            onChange={(e) =>
              setFilters({
                ...filters,
                orderType: e.target.value || undefined,
              })
            }
          >
            <option value="">All</option>
            {orderTypes.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}

