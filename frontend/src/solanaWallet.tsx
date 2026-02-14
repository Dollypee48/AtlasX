import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type WalletId = 'phantom' | 'solflare' | 'backpack' | 'demo'

interface WalletOption {
  id: WalletId
  name: string
  available: boolean
}

declare global {
  interface Window {
    phantom?: { solana?: SolanaProvider }
    solana?: SolanaProvider
    solflare?: SolanaProvider
    backpack?: SolanaProvider
  }
}

interface SolanaProvider {
  isPhantom?: boolean
  isSolflare?: boolean
  isBackpack?: boolean
  connect: () => Promise<{ publicKey: unknown }>
  disconnect?: () => Promise<void>
}

interface WalletContextValue {
  connected: boolean
  connecting: boolean
  publicKey: string | null
  connect: () => void
  connectWallet: (id: WalletId) => Promise<void>
  disconnect: () => Promise<void>
  error: string | null
  walletOptions: WalletOption[]
  showWalletModal: boolean
  setShowWalletModal: (show: boolean) => void
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined)

function getProvider(id: WalletId): SolanaProvider | null {
  switch (id) {
    case 'phantom':
      return window.phantom?.solana ?? window.solana ?? null
    case 'solflare':
      return window.solflare ?? null
    case 'backpack':
      return window.backpack ?? null
    case 'demo':
      return null
    default:
      return null
  }
}

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showWalletModal, setShowWalletModal] = useState(false)

  const walletOptions: WalletOption[] = useMemo(() => [
    { id: 'phantom', name: 'Phantom', available: !!(window.phantom?.solana ?? window.solana) },
    { id: 'solflare', name: 'Solflare', available: !!window.solflare },
    { id: 'backpack', name: 'Backpack', available: !!window.backpack },
    { id: 'demo', name: 'Demo (no wallet)', available: true },
  ], [])

  const connectWallet = useCallback(async (id: WalletId) => {
    setError(null)

    if (id === 'demo') {
      setPublicKey('demo-wallet')
      setConnected(true)
      setShowWalletModal(false)
      return
    }

    const provider = getProvider(id)
    if (!provider) {
      const name = walletOptions.find((w) => w.id === id)?.name ?? id
      setError(`${name} is not installed. Install the extension and refresh the page.`)
      return
    }

    try {
      setConnecting(true)
      const resp = await provider.connect()
      const pubkey = resp?.publicKey as
        | { toBase58?: () => string; toString?: () => string }
        | null
        | undefined
      const pk =
        typeof pubkey?.toBase58 === 'function'
          ? pubkey.toBase58()
          : typeof pubkey?.toString === 'function'
            ? pubkey.toString()
            : pubkey != null
              ? String(pubkey)
              : null
      if (pk) {
        setPublicKey(pk)
        setConnected(true)
        setShowWalletModal(false)
      } else {
        setError('Connected but could not read wallet address.')
      }
    } catch (e) {
      console.error('Wallet connect error:', e)
      const message = e instanceof Error ? e.message : 'Failed to connect. Please try again.'
      setError(message)
    } finally {
      setConnecting(false)
    }
  }, [walletOptions])

  const connect = useCallback(() => {
    setError(null)
    setShowWalletModal(true)
  }, [])

  const disconnect = useCallback(async () => {
    try {
      const p = window.phantom?.solana ?? window.solana ?? window.solflare ?? window.backpack
      if (p?.disconnect) await p.disconnect()
    } catch (e) {
      console.error(e)
    } finally {
      setConnected(false)
      setPublicKey(null)
      setError(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      connected,
      connecting,
      publicKey,
      connect,
      connectWallet,
      disconnect,
      error,
      walletOptions,
      showWalletModal,
      setShowWalletModal,
    }),
    [connected, connecting, publicKey, connect, connectWallet, disconnect, error, walletOptions, showWalletModal],
  )

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWalletContext = (): WalletContextValue => {
  const ctx = useContext(WalletContext)
  if (!ctx) {
    throw new Error('useWalletContext must be used within WalletProvider')
  }
  return ctx
}
