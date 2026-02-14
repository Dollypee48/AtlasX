import type { ReactNode } from 'react'

interface ShellProps {
  sidebar: ReactNode
  header: ReactNode
  children: ReactNode
}

export const Shell = ({ sidebar, header, children }: ShellProps) => {
  return (
    <div className="app-shell grid grid-cols-[260px,minmax(0,1fr)] h-screen bg-background text-slate-100">
      <aside className="app-shell__sidebar border-r border-slate-800 bg-gradient-to-b from-slate-950/80 to-slate-950/40">
        {sidebar}
      </aside>
      <main className="app-shell__main flex flex-col min-w-0">
        <header className="app-shell__header px-6 pt-4 pb-1 border-b border-slate-800 bg-gradient-to-b from-slate-950/90 to-transparent backdrop-blur-md">
          {header}
        </header>
        <section className="app-shell__content flex-1 px-6 pb-5 pt-3 overflow-auto">
          {children}
        </section>
      </main>
    </div>
  )
}

