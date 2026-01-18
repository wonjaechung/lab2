
'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Plus, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const allAvailableAssets = [
  {
    id: 'bitcoin',
    name: '비트코인',
    ticker: 'BTC',
    price: '₩98,179,003',
    change: 0.18,
    color: 'hsl(var(--primary))',
    img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032',
  },
  {
    id: 'ethereum',
    name: '이더리움',
    ticker: 'ETH',
    price: '₩4,880,190',
    change: -1.2,
    color: '#6079E2',
    img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032',
  },
  {
    id: 'solana',
    name: '솔라나',
    ticker: 'SOL',
    price: '₩231,050',
    change: 2.5,
    color: '#14F195',
    img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032',
  },
  {
    id: 'ripple',
    name: '리플',
    ticker: 'XRP',
    price: '₩705',
    change: -0.5,
    color: '#23292F',
    img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032',
  },
  {
    id: 'dogecoin',
    name: '도지코인',
    ticker: 'DOGE',
    price: '₩215',
    change: 1.5,
    color: '#C2A633',
    img: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=032'
  },
  {
    id: 'cardano',
    name: '카르다노',
    ticker: 'ADA',
    price: '₩640',
    change: -2.1,
    color: '#0D1E43',
    img: 'https://cryptologos.cc/logos/cardano-ada-logo.svg?v=032'
  }
];

const generateMockData = (period: string, assets: { id: string }[]) => {
  const data = [];
  let points = 30;
  if (period === '24H') points = 24;
  if (period === '1W') points = 7;
  if (period === '1M') points = 30;

  const assetIds = assets.map(a => a.id);

  for (let i = 0; i < points; i++) {
    const point: { [key: string]: any } = { name: `t${i}` };
    assetIds.forEach(id => {
        point[id] = (Math.random() - 0.5) * 10;
    });
    data.push(point);
  }

  // Ensure start is 0
  const firstPoint = data[0];
  const startValues = { ...firstPoint };

  const normalizedData = data.map(point => {
    const newPoint: any = { name: point.name };
    for (const key in startValues) {
      if (key !== 'name') {
        // @ts-ignore
        newPoint[key] = point[key] - startValues[key];
      }
    }
    return newPoint;
  });

  return normalizedData;
};

export function PriceComparisonWidget() {
  const [activePeriod, setActivePeriod] = useState('1M');
  const [displayedAssets, setDisplayedAssets] = useState(
    allAvailableAssets.slice(0, 4)
  );
  
  const chartData = generateMockData(activePeriod, displayedAssets);

  const addAsset = (assetId: string) => {
    if (displayedAssets.some(a => a.id === assetId)) return;
    const assetToAdd = allAvailableAssets.find(a => a.id === assetId);
    if (assetToAdd) {
        setDisplayedAssets(prev => [...prev, assetToAdd]);
    }
  };

  const removeAsset = (assetId: string) => {
    setDisplayedAssets(prev => prev.filter(a => a.id !== assetId));
  }
  
  const unselectedAssets = allAvailableAssets.filter(
    (asset) => !displayedAssets.some((dAsset) => dAsset.id === asset.id)
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center justify-end gap-1">
          {['24H', '1W', '1M'].map((period) => (
            <Button
              key={period}
              variant={activePeriod === period ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActivePeriod(period)}
              className="rounded-full w-12"
            >
              {period}
            </Button>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Plus className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {unselectedAssets.map((asset) => (
                     <DropdownMenuItem key={asset.id} onClick={() => addAsset(asset.id)}>
                        <Avatar className="h-5 w-5 mr-2">
                            <AvatarImage src={asset.img} />
                            <AvatarFallback>{asset.ticker.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{asset.name}</span>
                    </DropdownMenuItem>
                ))}
                {unselectedAssets.length === 0 && (
                    <DropdownMenuItem disabled>
                        모든 자산이 추가되었습니다.
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="h-80 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ display: 'none' }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(value) => `${value}%`}
              domain={[-15, 15]}
              allowDataOverflow={true}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
              labelStyle={{ fontWeight: 'bold' }}
              formatter={(value: number, name) => {
                const assetName = displayedAssets.find(a => a.id === name)?.name || name;
                return [`${value.toFixed(2)}%`, assetName]
              }}
            />
            <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            {displayedAssets.map(
              (asset) => (
                  <Line
                    key={asset.id}
                    type="monotone"
                    dataKey={asset.id}
                    stroke={asset.color}
                    strokeWidth={2}
                    dot={false}
                    name={asset.name}
                  />
                )
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2">
        {displayedAssets.map((asset) => (
          <div key={asset.id} className="flex items-center p-2 rounded-md hover:bg-muted/50">
            <div
              className="w-1 h-4 rounded-full mr-3"
              style={{ backgroundColor: asset.color }}
            ></div>
            <Avatar className='h-6 w-6 mr-3'>
                <AvatarImage src={asset.img} />
                <AvatarFallback>{asset.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-sm flex-1">{asset.name}</span>
            <span className="font-mono text-sm mr-4 text-right w-32">{asset.price}</span>
            <span
              className={cn(
                'font-mono text-sm w-20 text-right',
                asset.change > 0 ? 'text-green-500' : 'text-red-500'
              )}
            >
              {asset.change > 0 ? '+' : ''}
              {asset.change.toFixed(2)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-2"
              onClick={() => removeAsset(asset.id)}
            >
              <XIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
