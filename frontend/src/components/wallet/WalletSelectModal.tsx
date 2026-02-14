import { useWalletContext, type WalletId } from '../../solanaWallet'

export function WalletSelectModal() {
  const {
    walletOptions,
    connectWallet,
    showWalletModal,
    setShowWalletModal,
    connecting,
    error,
  } = useWalletContext()

  if (!showWalletModal) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-modal-title"
      onClick={() => setShowWalletModal(false)}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-atlasx-border bg-solana-card p-4 shadow-card-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 id="wallet-modal-title" className="text-sm font-semibold text-text-primary">
            Connect Solana wallet
          </h2>
          <button
            type="button"
            onClick={() => setShowWalletModal(false)}
            className="rounded-full p-1 text-text-muted hover:bg-atlasx-borderSoft hover:text-text-primary"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="mb-4 text-[12px] text-text-secondary">
          Choose a wallet to connect. Demo uses sample data without a real wallet.
        </p>
        {error && (
          <div className="mb-3 rounded-lg border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-[12px] text-rose-400">
            {error}
          </div>
        )}
        <ul className="space-y-2">
          {walletOptions.map((opt) => (
            <li key={opt.id}>
              <button
                type="button"
                disabled={connecting}
                onClick={() => connectWallet(opt.id as WalletId)}
                className="flex w-full items-center justify-between rounded-xl border border-atlasx-borderSoft bg-atlasx-bg/70 px-3 py-2.5 text-left text-sm font-medium text-text-primary transition hover:border-atlasx-border hover:bg-atlasx-bg disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>{opt.name}</span>
                {!opt.available && opt.id !== 'demo' && (
                  <span className="text-[10px] text-text-muted">Not installed</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
