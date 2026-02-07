import { ConnectButton } from "@mysten/dapp-kit";
import { MarketsList } from "./components/MarketsList";

function App() {
  return (
    <div className="min-h-screen p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Invisible DEX</h1>
        <ConnectButton />
      </header>
      <main>
        <MarketsList />
      </main>
    </div>
  );
}

export default App;
