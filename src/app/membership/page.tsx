'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { MyRoiRanking } from '@/components/membership/my-roi-ranking';
import { NextTierGauge } from '@/components/membership/next-tier-gauge';
import { TierBenefitCalculator } from '@/components/membership/tier-benefit-calculator';
import { InvestmentCalendar } from '@/components/membership/investment-calendar';
import type { JournalEntry } from '@/components/membership/trading-journal';
import { MembershipAssetDistribution } from '@/components/membership/membership-asset-distribution';
import { MembershipAssetDistribution2 } from '@/components/membership/membership-asset-distribution2';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const navigationItems = [
  { name: '멤버십 현황', value: 'overview' },
  { name: '투자 캘린더', value: 'calendar' },
];

function MembershipSidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (value: string) => void;
}) {
  return (
    <aside>
      <h2 className="text-lg font-semibold text-foreground mb-4">멤버십</h2>
      <nav>
        <ul className="space-y-1">
          {navigationItems.map((item) => (
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


export default function MembershipPage() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background font-body">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <main className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 items-start">
            <MembershipSidebar
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
                    >
                      {item.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="overview">
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <MyRoiRanking />
                            <NextTierGauge />
                            <TierBenefitCalculator />
                        </div>
                        <MembershipAssetDistribution />
                        <MembershipAssetDistribution2 />
                    </div>
                </TabsContent>
                <TabsContent value="calendar">
                    <InvestmentCalendar 
                        journalEntries={journalEntries}
                        setJournalEntries={setJournalEntries}
                    />
                </TabsContent>
               </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
