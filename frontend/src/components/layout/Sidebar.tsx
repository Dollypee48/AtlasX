const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'journal', label: 'Trading Journal' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'insights', label: 'Insights' },
]

interface SidebarProps {
  active: string
  onChange: (id: string) => void
}

export const Sidebar = ({ active, onChange }: SidebarProps) => {
  return (
    <div className="sidebar flex h-full flex-col px-4 pb-5 pt-4">
      <div className="sidebar__brand mb-4 flex items-center gap-2.5">
        <span className="sidebar__brand-mark inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-semibold text-slate-950 shadow-[0_0_18px_rgba(34,197,94,0.45)]">
          A
        </span>
        <div className="hidden md:block">
          <div className="sidebar__brand-name text-[15px] font-semibold tracking-wide">
            AtlasX
          </div>
          <div className="sidebar__brand-sub text-[11px] text-slate-400">
            Trading Analytics
          </div>
        </div>
      </div>
      <nav className="sidebar__nav flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar__nav-item flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${
              active === item.id
                ? 'sidebar__nav-item--active border border-emerald-500/50 bg-gradient-to-r from-emerald-500/10 to-transparent text-slate-50'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
            }`}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar__footer mt-auto border-t border-slate-900 pt-3 text-xs text-slate-500">
        <span className="sidebar__footer-label block text-[10px] uppercase tracking-[0.16em] text-slate-500">
          Environment
        </span>
        <span className="sidebar__footer-pill mt-1 inline-flex items-center gap-1 rounded-full border border-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
          Solana · Demo Data
        </span>
      </div>
    </div>
  )
}

