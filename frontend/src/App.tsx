import { MarketsList } from "./components/market/MarketsList";
import { WalletConnect } from "./components/wallet/WalletConnect";
import { BalanceDisplay } from "./components/wallet/BalanceDisplay";

function App() {
  return (
    <div className="min-h-screen p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Invisible DEX</h1>
        <div className="flex items-center gap-3">
          <BalanceDisplay />
          <WalletConnect />
        </div>
      </header>
      <main>
        <MarketsList />
      </main>
    </div>
  );
}

export default App;
