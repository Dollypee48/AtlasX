interface LandingProps {
  connected: boolean
  publicKey: string | null
  onConnectWallet: () => void
  onGoToDashboard: () => void
  onDisconnect: () => void
}

function shortenAddress(pk: string, chars = 4): string {
  if (pk === 'demo-wallet') return 'Demo'
  if (pk.length <= chars * 2 + 2) return pk
  return `${pk.slice(0, chars)}…${pk.slice(-chars)}`
}

export const Landing = ({
  connected,
  publicKey,
  onConnectWallet,
  onGoToDashboard,
  onDisconnect,
}: LandingProps) => {
  return (
    <div className="min-h-screen bg-solana-main text-text-primary">
      {/* Header: Connect wallet when disconnected; wallet + Log out when connected (no Go to dashboard here) */}
      <header className="border-b border-atlasx-borderSoft bg-atlasx-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-brand shadow-glow-purple text-sm font-semibold text-text-inverse">
              A
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide">AtlasX</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-text-muted">
                Solana Trading Analytics
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {connected && publicKey && (
              <span
                className="rounded-full border border-atlasx-borderSoft bg-atlasx-bg/70 px-3 py-1 text-[11px] text-text-secondary"
                title={publicKey}
              >
                {shortenAddress(publicKey)}
              </span>
            )}
            {connected ? (
              <button
                type="button"
                onClick={onDisconnect}
                className="inline-flex items-center gap-2 rounded-full border border-atlasx-borderSoft bg-atlasx-bg/70 px-4 py-1.5 text-xs font-medium text-text-primary hover:bg-atlasx-bg hover:border-atlasx-border"
              >
                Log out
              </button>
            ) : (
              <button
                type="button"
                onClick={onConnectWallet}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-1.5 text-xs font-medium text-text-inverse shadow-glow-green hover:bg-brand.light"
              >
                Connect wallet
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-12 pt-6 md:pb-16 md:pt-8">
        {/* Section 1: Hero */}
        <section className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-atlasx-borderSoft bg-atlasx-bg/60 px-2 py-1 text-[11px] text-text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Simple Solana trading journal
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
              Understand your Solana trading in{" "}
              <span className="bg-gradient-to-r from-brand-purple via-brand to-brand-light bg-clip-text text-transparent">
                one clear view
              </span>
              .
            </h1>
            <p className="mt-3 max-w-xl text-sm text-text-secondary md:text-[15px]">
              AtlasX turns raw trades into a simple picture of your PnL, risk, and
              habits — so you can see what is working and what is not.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={connected ? onGoToDashboard : onConnectWallet}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-medium text-text-inverse shadow-glow-green hover:bg-brand.light"
              >
                {connected ? 'Go to dashboard' : 'Connect wallet'}
              </button>
              <p className="text-[11px] text-text-muted">
                No email, no signup. Designed for active Solana traders.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-atlasx-border bg-solana-card p-4 shadow-card-soft">
            <div className="mb-2 flex items-center justify-between text-[11px] text-text-muted">
              <span>Snapshot · Last 30 days (demo)</span>
            </div>
            <div className="h-40 rounded-xl border border-atlasx-borderSoft bg-gradient-to-br from-slate-900/60 via-slate-900/20 to-slate-900/80 p-3">
              <div className="flex items-end gap-1.5">
                <div className="h-6 w-[10%] rounded bg-emerald-500/40" />
                <div className="h-10 w-[10%] rounded bg-emerald-500/60" />
                <div className="h-4 w-[10%] rounded bg-rose-500/40" />
                <div className="h-14 w-[10%] rounded bg-emerald-500/70" />
                <div className="h-8 w-[10%] rounded bg-emerald-500/50" />
                <div className="h-5 w-[10%] rounded bg-rose-500/50" />
                <div className="h-12 w-[10%] rounded bg-emerald-500/70" />
                <div className="h-7 w-[10%] rounded bg-emerald-500/50" />
                <div className="h-3 w-[10%] rounded bg-rose-500/40" />
                <div className="h-11 w-[10%] rounded bg-emerald-500/60" />
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] text-text-muted">
                <span>Equity &amp; drawdown trend</span>
                <span>Demo data</span>
              </div>
            </div>
            <div className="mt-3 grid gap-3 text-[11px] text-text-secondary md:grid-cols-3">
              <div>
                <div className="text-text-muted">Realised PnL</div>
                <div className="text-sm font-semibold text-profit">+3,240.15</div>
              </div>
              <div>
                <div className="text-text-muted">Max drawdown</div>
                <div className="text-sm font-semibold text-loss">-8.7%</div>
              </div>
              <div>
                <div className="text-text-muted">Risk score</div>
                <div className="text-sm font-semibold text-text-primary">
                  81 / 100
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Simple value props */}
        <section className="mt-10 md:mt-14">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
            What you get
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-atlasx-borderSoft bg-atlasx-bg/70 px-3 py-3">
              <h3 className="text-sm font-medium text-text-primary">
                Clear performance
              </h3>
              <p className="mt-1.5 text-[13px] text-text-secondary">
                See your realised and unrealised PnL in one place instead of
                digging through fills and screenshots.
              </p>
            </div>
            <div className="rounded-xl border border-atlasx-borderSoft bg-atlasx-bg/70 px-3 py-3">
              <h3 className="text-sm font-medium text-text-primary">
                Risk overview
              </h3>
              <p className="mt-1.5 text-[13px] text-text-secondary">
                Track drawdowns and exposure so you can size positions with more
                confidence.
              </p>
            </div>
            <div className="rounded-xl border border-atlasx-borderSoft bg-atlasx-bg/70 px-3 py-3">
              <h3 className="text-sm font-medium text-text-primary">
                Behaviour insights
              </h3>
              <p className="mt-1.5 text-[13px] text-text-secondary">
                Spot patterns in when and how you trade, helping you avoid
                emotional decisions.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-atlasx-borderSoft bg-atlasx-bgAlt/90">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-[11px] text-text-muted md:flex-row">
          <div>© {new Date().getFullYear()} AtlasX · Built for Solana.</div>
          <div>Analytics only · AtlasX never holds your funds.</div>
        </div>
      </footer>
    </div>
  )
}

