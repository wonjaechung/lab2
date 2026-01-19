
'use client';
import { Header } from '@/components/layout/header';
import { TotalAssetsChart } from '@/components/dashboard/total-assets-chart';
import { MarketOverview } from '@/components/external-data/market-overview';
import { MarketSummary } from '@/components/dashboard/market-summary';
import { CoinFinder } from '@/components/dashboard/coin-finder';
import { ScheduleBanner } from '@/components/dashboard/schedule-banner';
import { TradingViewTickerTape } from '@/components/internal-data/technical-analysis/tradingview-ticker-tape';
import { AiBriefingBanner } from '@/components/dashboard/ai-briefing-banner';

const mainPageSymbols = [
  { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
  { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
  { proName: "COINBASE:SOLUSD", title: "Solana" },
  { proName: "BITSTAMP:XRPUSD", title: "XRP" },
  { proName: "BINANCE:DOGEUSDT", title: "Dogecoin" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background font-body">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <main className="py-8">
          <div className="grid grid-cols-1 gap-6 items-start">
            <MarketOverview />
            <MarketSummary />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <TotalAssetsChart />
              </div>
              <div className="lg:col-span-1 flex flex-col gap-4">
                <ScheduleBanner />
                <CoinFinder />
                <AiBriefingBanner />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
