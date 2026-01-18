
'use client';

import { AllInTrend } from './all-in-trend';
import { WhaleTrades } from '../membership/whale-trades';

export function ExchangeStatus() {
  return (
    <div className="space-y-12">
      <WhaleTrades />
      <AllInTrend />
    </div>
  );
}
