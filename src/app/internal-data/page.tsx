
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { AssetComparisonTable } from '@/components/internal-data/asset-comparison-table';
import { TechnicalAnalysisGrid } from '@/components/internal-data/technical-analysis/technical-analysis-grid';
import { ExchangeStatus } from '@/components/internal-data/exchange-status';
import RealtimeAlerts from '@/components/internal-data/sniper-feed';

const navigationItems = [
  { name: '거래소 현황', value: 'status', href: '#', hidden: false },
  { name: '실시간 알림', value: 'sniper', href: '#', hidden: false },
  { name: '가상자산 검색', value: 'comparison', href: '#', hidden: false },
  { name: '기술적분석', value: 'analysis', href: '#', hidden: true },
];

function InternalDataSidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (value: string) => void;
}) {
  return (
    <aside>
      <h2 className="text-lg font-semibold text-foreground mb-4">
        내부 데이터
      </h2>
      <nav>
        <ul className="space-y-1">
          {navigationItems.filter(item => !item.hidden).map((item) => (
            <li key={item.name}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.value);
                }}
                className={cn(
                  'block w-full text-left px-3 py-2 rounded-md text-base font-medium',
                  activeTab === item.value
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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

function InternalDataContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('status');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // URL 파라미터에서 필터 정보 추출
  const filterParams = {
    filter: searchParams.get('filter'),
    direction: searchParams.get('direction'),
    sentiment: searchParams.get('sentiment'),
    range: searchParams.get('range'),
    crossover: searchParams.get('crossover'),
    category: searchParams.get('category'),
    multiplier: searchParams.get('multiplier'),
    executionStrength: searchParams.get('executionStrength'),
    tradeType: searchParams.get('tradeType'),
    amount: searchParams.get('amount'),
    betaDirection: searchParams.get('betaDirection'),
    betaMultiplier: searchParams.get('betaMultiplier'),
    volatilityThreshold: searchParams.get('volatilityThreshold'),
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <main className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 items-start">
            <InternalDataSidebar
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
                    <TabsTrigger key={item.value} value={item.value}>
                      {item.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="status">
                  <ExchangeStatus />
                </TabsContent>
                <TabsContent value="comparison">
                  <AssetComparisonTable initialFilter={filterParams} />
                </TabsContent>
                <TabsContent value="analysis">
                  <TechnicalAnalysisGrid />
                </TabsContent>
                <TabsContent value="sniper">
                  <RealtimeAlerts />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function InternalDataPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background font-body flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <InternalDataContent />
    </Suspense>
  );
}
