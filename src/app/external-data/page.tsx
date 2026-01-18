
'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { cn } from '@/lib/utils';
import { EtfFlowTracker } from '@/components/external-data/etf-flow-tracker';
import { OnchainWhales } from '@/components/external-data/onchain-whales';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketOverview } from '@/components/external-data/market-overview';
import { EtfNews } from '@/components/external-data/etf-news';

const navigationItems = [
  { name: '현물 ETF 흐름', value: 'etf-treasury' },
  { name: '온체인 고래', value: 'whales' },
  { name: '뉴스', value: 'news', disabled: false },
];

function ExternalDataSidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (value: string) => void;
}) {
  return (
    <aside>
      <h2 className="text-lg font-semibold text-foreground mb-4">외부 데이터</h2>
      <nav>
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (!item.disabled) {
                    setActiveTab(item.value);
                  }
                }}
                disabled={item.disabled}
                className={cn(
                  'block w-full text-left px-3 py-2 rounded-md text-base font-medium',
                  activeTab === item.value
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default function ExternalDataPage() {
  const [activeTab, setActiveTab] = useState('etf-treasury');

  return (
    <div className="min-h-screen bg-background font-body">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <main className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 items-start">
            <ExternalDataSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <div className="lg:col-span-1">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="hidden">
                  {navigationItems.map((item) => (
                    <TabsTrigger
                      key={item.value}
                      value={item.value}
                      disabled={item.disabled}
                    >
                      {item.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="etf-treasury">
                  <EtfFlowTracker />
                </TabsContent>
                <TabsContent value="whales">
                  <OnchainWhales />
                </TabsContent>
                <TabsContent value="news">
                  <EtfNews />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
