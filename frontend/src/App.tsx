import { TradeProvider, useTradeContext } from './context/TradeContext'
import { Shell } from './components/layout/Shell'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { FilterBar } from './components/filters/FilterBar'
import { MetricsGrid } from './components/overview/MetricsGrid'
import { EquityCurveChart } from './components/charts/EquityCurveChart'
import { DrawdownChart } from './components/charts/DrawdownChart'
import { FeePnLChart } from './components/charts/FeePnLChart'
import { TradeTable } from './components/journal/TradeTable'
import { PortfolioOverview } from './components/portfolio/PortfolioOverview'
import { BehavioralInsightsPanel } from './components/insights/BehavioralInsightsPanel'
import { Landing } from './components/landing/Landing'
import { WalletSelectModal } from './components/wallet/WalletSelectModal'
import { WalletProvider, useWalletContext } from './solanaWallet'
import { useState } from 'react'

const AppInner = () => {
  const { connected, connect, disconnect, publicKey } = useWalletContext()
  const [activePage, setActivePage] = useState('overview')
  const [showLanding, setShowLanding] = useState(true)

  if (!connected || showLanding) {
    return (
      <>
        <WalletSelectModal />
        <Landing
          connected={connected}
          publicKey={publicKey}
          onConnectWallet={connect}
          onGoToDashboard={() => setShowLanding(false)}
          onDisconnect={disconnect}
        />
      </>
    )
  }

  return (
    <TradeProvider>
      <Shell
        sidebar={<Sidebar active={activePage} onChange={setActivePage} />}
        header={
          <Header
            onLogoClick={() => setShowLanding(true)}
            onLogout={disconnect}
            publicKey={publicKey}
          />
        }
      >
        <DashboardContent activePage={activePage} />
      </Shell>
    </TradeProvider>
  )
}

function DashboardContent({ activePage }: { activePage: string }) {
  const { loading, error } = useTradeContext()

  return (
    <>
      {error && (
        <div className="mb-3 rounded-lg border border-rose-500/50 bg-rose-500/10 px-4 py-2 text-sm text-rose-400">
          {error}
        </div>
      )}
      {loading && (
        <div className="mb-3 text-[12px] text-text-muted">Loading trades…</div>
      )}
      <FilterBar />

      {activePage === 'overview' && (
        <div className="space-y-4">
          <MetricsGrid />
          <div className="grid gap-4 lg:grid-cols-2">
            <EquityCurveChart />
            <DrawdownChart />
          </div>
          <FeePnLChart />
        </div>
      )}

      {activePage === 'journal' && (
        <div className="mt-2">
          <TradeTable />
        </div>
      )}

      {activePage === 'portfolio' && (
        <div className="mt-2">
          <PortfolioOverview />
        </div>
      )}

      {activePage === 'insights' && (
        <div className="mt-2">
          <BehavioralInsightsPanel />
        </div>
      )}
    </>
  )
}

function App() {
  return (
    <WalletProvider>
      <AppInner />
    </WalletProvider>
  )
}

export default App
