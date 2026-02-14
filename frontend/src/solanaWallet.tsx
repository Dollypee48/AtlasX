import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

declare global {
  interface Window {
    // Phantom / Solana provider injected in the browser
    solana?: {
      isPhantom?: boolean
      connect: () => Promise<{ publicKey: { toString: () => string } }>
      disconnect?: () => Promise<void>
    }
  }
}

interface WalletContextValue {
  connected: boolean
  connecting: boolean
  publicKey: string | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  error: string | null
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined)

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(async () => {
    setError(null)
    const provider = window.solana

    // If Phantom is available, use the real provider.
    if (provider && provider.isPhantom) {
      try {
        setConnecting(true)
        const resp = await provider.connect()
        const pk = resp.publicKey.toString()
        setPublicKey(pk)
        setConnected(true)
      } catch (e) {
        console.error(e)
        setError('Failed to connect wallet. Please try again.')
      } finally {
        setConnecting(false)
      }
      return
    }

    // Fallback: demo wallet so the app works without Phantom.
    setPublicKey('demo-wallet')
    setConnected(true)
  }, [])

  const disconnect = useCallback(async () => {
    try {
      const provider = window.solana
      if (provider?.disconnect) {
        await provider.disconnect()
      }
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
      disconnect,
      error,
    }),
    [connected, connecting, publicKey, connect, disconnect, error],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export const useWalletContext = (): WalletContextValue => {
  const ctx = useContext(WalletContext)
  if (!ctx) {
    throw new Error('useWalletContext must be used within WalletProvider')
  }
  return ctx
}

