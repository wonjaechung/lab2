'use client';

import { TrendingDown, TrendingUp, Check, Plus, X as XIcon, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';


const allAssets = [
  { id: 'BTC', name: '비트코인', value: '98,000,000', change: {'1D': -0.5, '1W': 1.5, '1M': -3.0, '1Y': 45.0}, isCrypto: true, symbol: '₩', color: '#F7931A', img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg' },
  { id: 'ETH', name: '이더리움', value: '4,500,000', change: {'1D': 0.1, '1W': 2.5, '1M': -1.0, '1Y': 35.0}, isCrypto: true, symbol: '₩', color: '#627EEA', img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg' },
  { id: 'SP500', name: 'S&P 500', value: '5,477.90', change: {'1D': -0.16, '1W': 0.5, '1M': 1.2, '1Y': 15.0}, isCrypto: false, symbol: '', color: '#4B8B3B' },
  { id: 'NASDAQ', name: '나스닥', value: '19,700.43', change: {'1D': -0.26, '1W': 0.8, '1M': 2.5, '1Y': 22.0}, isCrypto: false, symbol: '', color: '#2A7FFF' },
  { id: 'KOSPI', name: '코스피', value: '2,774.40', change: {'1D': -0.70, '1W': -1.2, '1M': 0.8, '1Y': 8.0}, isCrypto: false, symbol: '', color: '#0033A0' },
  { id: 'KOSDAQ', name: '코스닥', value: '841.52', change: {'1D': -1.42, '1W': -2.1, '1M': -0.5, '1Y': 5.0}, isCrypto: false, symbol: '', color: '#FF7F00' },
  { id: 'GOLD', name: '금', value: '2,320.50', change: {'1D': 0.35, '1W': -0.5, '1M': -2.0, '1Y': 12.0}, isCrypto: false, symbol: '$', color: '#FFD700' },
  { id: 'HYPER_trend', name: '하이퍼레인', value: '1,234', change: {'1D': 15.2, '1W': 25.5, '1M': 45.0, '1Y': 320.0}, isCrypto: true, symbol: '₩', color: '#8A2BE2' },
  { id: 'MEV_trend', name: '미버스', value: '567', change: {'1D': 12.8, '1W': 18.2, '1M': 33.0, '1Y': 280.0}, isCrypto: true, symbol: '₩', color: '#FF69B4' },
  { id: 'API3_trend', name: '에이피아이쓰리', value: '3,456', change: {'1D': 8.5, '1W': 11.0, '1M': 21.0, '1Y': 150.0}, isCrypto: true, symbol: '₩', color: '#00CED1' },
  { id: 'DEEP_trend', name: '딥북', value: '89', change: {'1D': 5.1, '1W': 8.9, '1M': 18.0, '1Y': 180.0}, isCrypto: true, symbol: '₩', color: '#FFD700' },
  { id: 'WOO_trend', name: '우', value: '450', change: {'1D': 3.9, '1W': 6.1, '1M': 12.0, '1Y': 450.0}, isCrypto: true, symbol: '₩', color: '#32CD32' },
  { id: 'ERA_trend', name: '칼데라', value: '789', change: {'1D': -2.1, '1W': -5.2, '1M': -10.0, '1Y': 50.0}, isCrypto: true, symbol: '₩', color: '#FF4500' },
  { id: 'CUDIS_trend', name: '쿠디스', value: '1,010', change: {'1D': 1.0, '1W': 2.0, '1M': 5.0, '1Y': 100.0}, isCrypto: true, symbol: '₩', color: '#1E90FF' },
  { id: 'AI', name: '인공지능(AI)', value: '3,888조 6856억', change: {'1D': 15.2, '1W': 25.5, '1M': 45.0, '1Y': 320.0}, isCrypto: true, symbol: '', color: '#FF6B6B', rising: 46, falling: 75 },
  { id: 'L2', name: '레이어2', value: '1,200조 1122억', change: {'1D': 12.8, '1W': 18.2, '1M': 33.0, '1Y': 280.0}, isCrypto: true, symbol: '', color: '#4ECDC4', rising: 32, falling: 21 },
  { id: 'GAME', name: '게임', value: '850조 4500억', change: {'1D': 8.5, '1W': 11.0, '1M': 21.0, '1Y': 150.0}, isCrypto: true, symbol: '', color: '#45B7D1', rising: 55, falling: 12 },
  { id: 'DeFi', name: '디파이', value: '510조 9870억', change: {'1D': 5.1, '1W': 8.9, '1M': 18.0, '1Y': 180.0}, isCrypto: true, symbol: '', color: '#F9D423', rising: 80, falling: 40 },
  { id: 'RWA', name: '실물자산(RWA)', value: '390조 3300억', change: {'1D': 3.9, '1W': 6.1, '1M': 12.0, '1Y': 450.0}, isCrypto: true, symbol: '', color: '#A9A9A9', rising: 18, falling: 5 },
  { id: 'DOGE_owned', name: '도지코인', value: '215', change: {'1D': 3.5, '1W': 6.8, '1M': 1.2, '1Y': 80.0}, isCrypto: true, symbol: '₩', color: '#C2A633', img: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg' },
  { id: 'SOL_watch', name: '솔라나', value: '210,000', change: {'1D': 5.1, '1W': 8.2, '1M': 15.0, '1Y': 250.0}, isCrypto: true, symbol: '₩', color: '#14F195', img: 'https://cryptologos.cc/logos/solana-sol-logo.svg' },
  { id: 'XRP_watch', name: '리플', value: '705', change: {'1D': -1.2, '1W': -3.5, '1M': -8.0, '1Y': -15.0}, isCrypto: true, symbol: '₩', color: '#B0B0B0', img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg' },
  { id: 'WLD_watch', name: '월드코인', value: '6,200', change: {'1D': 12.4, '1W': 18.2, '1M': 25.0, '1Y': 300.0}, isCrypto: true, symbol: '₩', color: '#7D7D7D', img: 'https://cryptologos.cc/logos/worldcoin-org-wld-logo.svg' },
  { id: 'RNDR', name: '렌더', value: '14,500', change: {'1D': 7.8, '1W': 15.2, '1M': 22.0, '1Y': 280.0}, isCrypto: true, symbol: '₩', color: '#6A0DAD', img: 'https://cryptologos.cc/logos/render-rndr-logo.svg' },
  { id: 'ARB', name: '아비트럼', value: '1,500', change: {'1D': 3.2, '1W': 8.1, '1M': 12.5, '1Y': 180.0}, isCrypto: true, symbol: '₩', color: '#2D3748', img: 'https://cryptologos.cc/logos/arbitrum-arb-logo.svg' },
  { id: 'OP', name: '옵티미즘', value: '3,200', change: {'1D': 2.5, '1W': 6.8, '1M': 10.2, '1Y': 160.0}, isCrypto: true, symbol: '₩', color: '#FF0420', img: 'https://cryptologos.cc/logos/optimism-op-logo.svg' },
  { id: 'IMX', name: '이뮤터블엑스', value: '3,100', change: {'1D': -3.10, '1W': -1.2, '1M': 5.5, '1Y': 120.0}, isCrypto: true, symbol: '₩', color: '#1a1a1a', img: 'https://cryptologos.cc/logos/immutable-x-imx-logo.svg' },
  { id: 'AXS', name: '엑시인피니티', value: '9,800', change: {'1D': 2.1, '1W': 4.5, '1M': 11.0, '1Y': 90.0}, isCrypto: true, symbol: '₩', color: '#0057ff', img: 'https://cryptologos.cc/logos/axie-infinity-axs-logo.svg' },
  { id: 'SAND', name: '더샌드박스', value: '620', change: {'1D': 1.5, '1W': 3.2, '1M': 8.0, '1Y': 75.0}, isCrypto: true, symbol: '₩', color: '#0033ff', img: 'https://cryptologos.cc/logos/the-sandbox-sand-logo.svg' },
  { id: 'UNI', name: '유니스왑', value: '13,500', change: {'1D': -0.8, '1W': 2.1, '1M': -5.0, '1Y': 110.0}, isCrypto: true, symbol: '₩', color: '#ff007a', img: 'https://cryptologos.cc/logos/uniswap-uni-logo.svg' },
  { id: 'AAVE', name: '에이브', value: '125,000', change: {'1D': 1.2, '1W': 5.8, '1M': 15.0, '1Y': 200.0}, isCrypto: true, symbol: '₩', color: '#B6509E', img: 'https://cryptologos.cc/logos/aave-aave-logo.svg' },
  { id: 'COMP', name: '컴파운드', value: '82,000', change: {'1D': 0.5, '1W': 3.9, '1M': 9.0, '1Y': 150.0}, isCrypto: true, symbol: '₩', color: '#00D395', img: 'https://cryptologos.cc/logos/compound-comp-logo.svg' },
  { id: 'ONDO', name: '온도', value: '1,650', change: {'1D': -4.5, '1W': -12.0, '1M': 25.0, '1Y': 500.0}, isCrypto: true, symbol: '₩', color: '#f4b41a', img: 'https://cryptologos.cc/logos/ondo-ondo-logo.svg' },
  { id: 'PYTH', name: '파이스네트워크', value: '450', change: {'1D': 3.8, '1W': 9.2, '1M': 18.0, '1Y': 300.0}, isCrypto: true, symbol: '₩', color: '#E6007A', img: 'https://cryptologos.cc/logos/pyth-network-pyth-logo.svg' },
  { id: 'SNX', name: '신세틱스', value: '3,800', change: {'1D': -1.5, '1W': 1.8, '1M': 6.0, '1Y': 80.0}, isCrypto: true, symbol: '₩', color: '#00d1ff', img: 'https://cryptologos.cc/logos/synthetix-snx-logo.svg' },
];

const dataSets: { [key: string]: any[] } = {
    indices: allAssets.filter(a => ['BTC', 'ETH', 'SP500', 'NASDAQ', 'KOSPI', 'KOSDAQ', 'GOLD'].includes(a.id)),
    themes: allAssets.filter(a => ['AI', 'L2', 'GAME', 'DeFi', 'RWA'].includes(a.id)),
    trending: allAssets.filter(a => a.id.endsWith('_trend')),
    owned: allAssets.filter(a => ['BTC', 'ETH', 'DOGE_owned'].includes(a.id)),
    watchlist: [],
};

const themeAssets: Record<string, string[]> = {
    'AI': ['WLD_watch', 'RNDR', 'API3_trend'],
    'L2': ['ARB', 'OP', 'IMX'],
    'GAME': ['AXS', 'SAND', 'IMX'],
    'DeFi': ['UNI', 'AAVE', 'COMP'],
    'RWA': ['ONDO', 'PYTH', 'SNX'],
}

const createSeededRandom = (seedString: string) => {
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
        hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
        hash |= 0;
    }
    let seed = Math.abs(hash);
    return () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };
};

const generateChartData = (period: string, baseValueStr: string, seed: string) => {
    const data = [];
    let points = 30;
    if (period === '1D') points = 24 * 4; 
    if (period === '1W') points = 7 * 24; 
    if (period === '1M') points = 30; 
    if (period === '1Y') points = 365;

    let value = parseFloat(baseValueStr.replace(/[^0-9.-]+/g,""));
    const today = new Date();
    const rng = createSeededRandom(seed);

    for (let i = points - 1; i >= 0; i--) {
        const date = new Date(today);
        if (period === '1D') date.setMinutes(today.getMinutes() - i * 15);
        else if (period === '1W') date.setHours(today.getHours() - i);
        else date.setDate(today.getDate() - i);
        
        value += (rng() - 0.5) * (value * 0.01);
        data.push({
            date: date.getTime(),
            value: value,
        });
    }
    return data;
};

const generateNormalizedChartData = (period: string, assets: any[]) => {
    if (assets.length === 0) return [];
    
    const individualData = assets.map(asset => ({
        id: asset.id,
        data: generateChartData(period, asset.value, asset.id),
        color: asset.color
    }));

    if (individualData.length === 0 || individualData[0].data.length === 0) return [];

    const points = individualData[0].data.length;
    const normalizedData = [];

    for (let i = 0; i < points; i++) {
        const dataPoint: { [key: string]: any } = { date: individualData[0].data[i].date };
        individualData.forEach(assetData => {
            const startValue = assetData.data[0].value;
            const currentValue = assetData.data[i].value;
            dataPoint[assetData.id] = ((currentValue - startValue) / startValue) * 100;
        });
        normalizedData.push(dataPoint);
    }
    return normalizedData;
};


const MiniChart = ({ data, color }: { data: number[], color: string }) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const height = 24;
    const width = 60;
    
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </svg>
    );
};

const getChartDataForListItem = (change: number, name: string) => {
    const rng = createSeededRandom(name + change);
    const points = 10;
    const data = [100];
    let current = 100;
    const trend = change > 0 ? 1 : -1;
    const volatility = 2;

    for (let i = 0; i < points - 1; i++) {
        const move = (rng() - 0.4 + (trend * 0.1)) * volatility;
        current += move;
        data.push(current);
    }
    const finalChange = ((data[data.length - 1] - data[0]) / data[0]) * 10;
    
    if (Math.sign(finalChange) !== Math.sign(change)) {
       data[data.length - 1] = data[0] + change * 0.5;
    }

    return data;
};

export function MarketOverview() {
  const [activeTab, setActiveTab] = useState<keyof typeof dataSets>('indices');
  const [activePeriod, setActivePeriod] = useState('1D');
  const [activeIndex, setActiveIndex] = useState('');
  const [chartActiveIndex, setChartActiveIndex] = useState('BTC');
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<string[]>(['BTC', 'ETH', 'SP500']);
  const [watchlistAssets, setWatchlistAssets] = useState<any[]>(dataSets['watchlist']);

  const marketData = activeTab === 'watchlist' ? watchlistAssets : dataSets[activeTab];

  const activeItem = useMemo(() => {
    if (!chartActiveIndex) return null;
    return allAssets.find(item => item.id === chartActiveIndex);
  }, [chartActiveIndex]);

  const singleChartData = useMemo(() => {
    if (!activeItem) return [];
    return generateChartData(activePeriod, activeItem.value, activeItem.id);
  }, [activePeriod, activeItem]);
  
  const compareChartData = useMemo(() => {
    const assetsToCompare = allAssets.filter(item => selectedAssets.includes(item.id));
    return generateNormalizedChartData(activePeriod, assetsToCompare);
  }, [activePeriod, selectedAssets]);
  
  const changeForPeriod = activeItem?.change[activePeriod as keyof typeof activeItem.change] ?? 0;
  const isPositive = changeForPeriod >= 0;
  const redColor = '#ef4444';
  const blueColor = '#3b82f6';
  
  const handleAssetSelection = (id: string) => {
    if (isCompareMode) {
        setSelectedAssets(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id)
                : [...prev, id]
        )
    } else {
      if (activeIndex === id) {
        setActiveIndex('');
        setChartActiveIndex('');
      } else {
        setActiveIndex(id);
        setChartActiveIndex(id);
      }
    }
  }

  const onTabChange = (tab: string) => {
      const newTab = tab as keyof typeof dataSets;
      setActiveTab(newTab);
      
      const newMarketData = newTab === 'watchlist' ? watchlistAssets : dataSets[newTab];
      setActiveIndex('');
      if (newMarketData.length > 0) {
        setChartActiveIndex(newMarketData[0].id);
        setSelectedAssets([newMarketData[0].id]);
      } else {
          setChartActiveIndex('');
          setSelectedAssets([]);
      }
      setIsCompareMode(false);
  }

  const addToWatchlist = (id: string) => {
    const assetToAdd = allAssets.find(a => a.id === id);
    if (assetToAdd && !watchlistAssets.some(a => a.id === id)) {
        setWatchlistAssets(prev => [...prev, assetToAdd]);
    }
  }

  const removeFromWatchlist = (id: string) => {
    setWatchlistAssets(prev => prev.filter(a => a.id !== id));
    setSelectedAssets(prev => prev.filter(assetId => assetId !== id));
    if (activeIndex === id && watchlistAssets.length > 1) {
        setActiveIndex(watchlistAssets.find(a => a.id !== id)!.id)
    } else if (watchlistAssets.length <= 1) {
        setActiveIndex('');
    }
  }

  const unselectedWatchlistAssets = allAssets.filter(
    (asset) => !watchlistAssets.some(wa => wa.id === asset.id) && !asset.id.includes('trend') && !['AI','L2','GAME','DeFi','RWA'].includes(asset.id) && !asset.id.includes('owned')
  );

  const CompareModeTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 backdrop-blur-sm p-3 border rounded-lg shadow-xl text-xs z-50">
          <p className="font-bold mb-2">{new Date(label).toLocaleString('ko-KR')}</p>
          <div className="space-y-1">
            {payload.map((p: any) => {
              const asset = allAssets.find(item => item.id === p.dataKey);
              return (
                <p key={p.dataKey} className="flex justify-between items-center gap-4">
                    <span className="font-semibold flex items-center gap-1.5" style={{ color: p.color }}>
                        <span className="w-2 h-2 rounded-full" style={{backgroundColor: p.color}} />
                        {asset?.name || p.name}
                    </span>
                    <span className="font-mono" style={{ color: p.value > 0 ? redColor : blueColor }}>
                        {p.value.toFixed(2)}%
                    </span>
                </p>
              )
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderAssetList = () => {

    return (
        <div className="space-y-1">
            {marketData.map((item) => {
                const currentChange = item.change[activePeriod as keyof typeof item.change];
                const itemIsPositive = currentChange >= 0;
                const itemColor = itemIsPositive ? redColor : blueColor;
                const miniChartData = getChartDataForListItem(currentChange, item.name);
                const isSelected = isCompareMode ? selectedAssets.includes(item.id) : activeIndex === item.id;
                
                const itemContent = (
                     <div
                        className={cn(
                            "w-full flex items-center p-2 rounded-lg transition-colors relative",
                        )}
                    >
                         {isCompareMode && (
                            <div 
                                onClick={() => handleAssetSelection(item.id)}
                                className={cn("w-5 h-5 rounded-sm border-2 flex items-center justify-center mr-3 cursor-pointer", isSelected ? 'bg-primary border-primary' : 'border-muted-foreground')}>
                                {isSelected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                            </div>
                        )}
                        <div className="flex-1 text-left min-w-0" onClick={() => !isCompareMode && handleAssetSelection(item.id)}>
                            <span className="text-sm font-semibold text-foreground truncate">{item.name}</span>
                            {activeTab === 'themes' && item.rising !== undefined && (
                                <div className="text-xs text-muted-foreground mt-1">
                                    <span className="text-red-500">↑{item.rising}</span>
                                    <span className="mx-1">/</span>
                                    <span className="text-blue-500">↓{item.falling}</span>
                                </div>
                            )}
                        </div>
                        <div className="w-16 h-8 mr-4" onClick={() => !isCompareMode && handleAssetSelection(item.id)}>
                                <MiniChart data={miniChartData} color={itemColor} />
                        </div>
                        <div className="w-32 text-right" onClick={() => !isCompareMode && handleAssetSelection(item.id)}>
                            <span className="text-sm font-bold tracking-tight text-foreground truncate">
                                {item.symbol}{item.value}
                            </span>
                        </div>
                        <div className={`flex items-center text-xs font-bold w-20 justify-end`} style={{color: itemColor}} onClick={() => !isCompareMode && handleAssetSelection(item.id)}>
                            {itemIsPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                            {Math.abs(currentChange).toFixed(2)}%
                        </div>
                    </div>
                );

                if (activeTab === 'themes') {
                    const assetsInTheme = (themeAssets[item.id] || [])
                        .map(assetId => allAssets.find(a => a.id === assetId))
                        .filter(Boolean) as (typeof allAssets[0])[];
                     return (
                         <Collapsible key={item.id} open={!isCompareMode ? activeIndex === item.id : undefined} onOpenChange={(isOpen) => {
                             if(!isCompareMode) {
                                if (isOpen) setActiveIndex(item.id);
                                else if(activeIndex === item.id) setActiveIndex("");
                             }
                         }}>
                            <div className={cn('group flex items-center', isSelected && !isCompareMode ? "bg-muted" : "hover:bg-muted/50")}>
                                <div className='w-full flex items-center rounded-lg'>
                                    {isCompareMode && (
                                        <div onClick={() => handleAssetSelection(item.id)} className={cn("w-5 h-5 rounded-sm border-2 flex items-center justify-center ml-2 mr-3 cursor-pointer", isSelected ? 'bg-primary border-primary' : 'border-muted-foreground')}>
                                          {isSelected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                                        </div>
                                    )}
                                    <CollapsibleTrigger asChild>
                                      <div className='flex-1 flex items-center p-2 cursor-pointer min-w-0'>
                                        <div className="flex-1 text-left min-w-0">
                                            <span className="text-sm font-semibold text-foreground truncate">{item.name}</span>
                                            {item.rising !== undefined && (
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    <span className="text-red-500">↑{item.rising}</span>
                                                    <span className="mx-1">/</span>
                                                    <span className="text-blue-500">↓{item.falling}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-16 h-8 mr-4">
                                            <MiniChart data={getChartDataForListItem(item.change[activePeriod as keyof typeof item.change], item.name)} color={item.change[activePeriod as keyof typeof item.change] >= 0 ? redColor : blueColor} />
                                        </div>
                                        <div className="w-32 text-right">
                                            <span className="text-sm font-bold tracking-tight text-foreground truncate">
                                                {item.symbol}{item.value}
                                            </span>
                                        </div>
                                         <div className={`flex items-center text-xs font-bold w-20 justify-end`} style={{ color: item.change[activePeriod as keyof typeof item.change] >= 0 ? redColor : blueColor }}>
                                            {item.change[activePeriod as keyof typeof item.change] >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                                            {Math.abs(item.change[activePeriod as keyof typeof item.change]).toFixed(2)}%
                                        </div>
                                        <div className={cn("w-8 h-8 flex items-center justify-center ml-auto")}>
                                          <ChevronDown className="w-4 h-4 mr-1 transition-transform group-data-[state=open]:rotate-180" />
                                        </div>
                                      </div>
                                    </CollapsibleTrigger>
                                </div>
                            </div>
                            <CollapsibleContent>
                               <div className="pl-8 mt-2 space-y-1 max-h-[320px] overflow-y-auto pr-2">
                                    {assetsInTheme.length > 0 ? assetsInTheme.map(subItem => {
                                        const subItemIsSelected = selectedAssets.includes(subItem.id);
                                        const subItemChange = subItem.change[activePeriod as keyof typeof subItem.change];
                                        const subItemIsPositive = subItemChange >= 0;

                                        return (
                                            <div key={subItem.id} className="flex items-center p-2 rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => {
                                                if (isCompareMode) {
                                                    handleAssetSelection(subItem.id)
                                                } else {
                                                    setChartActiveIndex(subItem.id);
                                                }
                                            }}>
                                                {isCompareMode && (
                                                    <div className={cn("w-5 h-5 rounded-sm border-2 flex items-center justify-center mr-3", subItemIsSelected ? 'bg-primary border-primary' : 'border-muted-foreground')}>
                                                        {subItemIsSelected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                                                    </div>
                                                )}
                                                <Avatar className="h-6 w-6 mr-3">
                                                <AvatarImage src={subItem.img} alt={subItem.name} />
                                                <AvatarFallback>{subItem.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-semibold truncate">{subItem.name}</div>
                                                </div>
                                                <div className="w-24 text-right">
                                                    <div className="font-mono text-sm">{subItem.value}</div>
                                                     <div className={`text-xs font-semibold`} style={{ color: subItemIsPositive ? redColor : blueColor }}>
                                                        {subItemIsPositive ? '▲' : '▼'} {Math.abs(subItemChange).toFixed(2)}%
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }) : (
                                        <div className="text-center p-4 text-sm text-muted-foreground">
                                            포함된 종목이 없습니다.
                                        </div>
                                    )}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                     )
                }

                return (
                    <div key={item.id} className="group flex items-center" onClick={() => handleAssetSelection(item.id)}>
                        <div className={cn("w-full cursor-pointer", isSelected && !isCompareMode ? "bg-muted" : "hover:bg-muted/50")}>
                         {itemContent}
                        </div>
                        {activeTab === 'watchlist' && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); removeFromWatchlist(item.id)}}>
                                <XIcon className="w-4 h-4 text-muted-foreground" />
                            </Button>
                        )}
                    </div>
                );
            })}
             {activeTab === 'themes' && (
              <div className="mt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/themes">
                    전체 테마 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
        </div>
    );
  }

  return (
    <Card className="bg-card/30">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
                <TabsList className="bg-transparent p-0 h-auto">
                    <TabsTrigger value="indices" className="text-lg font-semibold text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 pb-2 mr-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                        글로벌 지수
                    </TabsTrigger>
                    <TabsTrigger value="themes" className="text-lg font-semibold text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 pb-2 mr-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                        테마
                    </TabsTrigger>
                    <TabsTrigger value="trending" className="text-lg font-semibold text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 pb-2 mr-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                        신규상장
                    </TabsTrigger>
                    <TabsTrigger value="owned" className="text-lg font-semibold text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 pb-2 mr-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                        보유 종목
                    </TabsTrigger>
                    <TabsTrigger value="watchlist" className="text-lg font-semibold text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 pb-2 mr-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                        관심 종목
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            <div className="flex items-center space-x-2 shrink-0">
                <Label htmlFor="compare-mode" className="text-sm font-medium">비교</Label>
                <Switch 
                    id="compare-mode" 
                    checked={isCompareMode} 
                    onCheckedChange={(checked) => {
                      setIsCompareMode(checked);
                      if (checked) {
                        if (activeIndex) {
                          setSelectedAssets([activeIndex]);
                        } else if (marketData.length > 0) {
                           setSelectedAssets([marketData[0].id]);
                        }
                      }
                    }}
                />
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
                {renderAssetList()}
                {activeTab === 'watchlist' && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full mt-2 h-12 border-dashed">
                                <Plus className="w-4 h-4 mr-2" />
                                관심 종목 추가
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[300px]" align="start">
                            {unselectedWatchlistAssets.map(asset => (
                                <DropdownMenuItem key={asset.id} onSelect={() => addToWatchlist(asset.id)}>
                                    {asset.name} ({asset.id})
                                </DropdownMenuItem>
                            ))}
                            {unselectedWatchlistAssets.length === 0 && (
                                <DropdownMenuItem disabled>추가할 수 있는 종목이 없습니다.</DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                 {activeTab === 'watchlist' && marketData.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">관심 종목을 추가해주세요.</div>
                 )}
            </div>
            <div className="lg:col-span-3">
                 <div className="flex justify-between items-center mb-4">
                     <div>
                        {!isCompareMode && activeItem ? (
                           <>
                                <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    {activeItem.name}
                                </h4>
                                <div className="flex items-baseline gap-2">
                                    <p className={cn("text-2xl font-bold", isPositive ? 'text-red-500' : 'text-blue-500')}>
                                        {activeItem.symbol}{activeItem.value}
                                    </p>
                                    <p className={cn("text-sm font-semibold", isPositive ? 'text-red-500' : 'text-blue-500')}>
                                       ({isPositive ? '+' : ''}{changeForPeriod}%)
                                    </p>
                                </div>
                                <p className="text-xs text-muted-foreground">오늘 17:58 기준</p>
                           </>
                        ) : (
                             <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                                {isCompareMode ? "주요 자산 수익률 비교" : (marketData.length > 0 && chartActiveIndex) ? "" : "종목을 선택해주세요"}
                            </h4>
                        )}
                     </div>
                     <div className="flex gap-1 rounded-md bg-muted p-1">
                        {(['1D', '1W', '1M', '1Y']).map((period) => (
                            <Button
                            key={period}
                            variant={activePeriod === period ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActivePeriod(period)}
                            className="h-8 px-4 text-xs rounded"
                            >
                            {period === '1D' ? '오늘' : period === '1W' ? '1주' : period === '1M' ? '1개월' : '1년'}
                            </Button>
                        ))}
                    </div>
                 </div>
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {isCompareMode ? (
                            <LineChart data={compareChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                                <XAxis 
                                    dataKey="date"
                                    tickFormatter={(timeStr) => {
                                        const date = new Date(timeStr);
                                        if (activePeriod === '1D') return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
                                        return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
                                    }}
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />
                                <YAxis 
                                    tickFormatter={(val) => `${val.toFixed(0)}%`}
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    orientation="right"
                                    tickMargin={8}
                                />
                                <Tooltip content={<CompareModeTooltip />} />
                                {selectedAssets.map(id => {
                                    const asset = allAssets.find(item => item.id === id);
                                    return <Line key={id} name={asset?.name} type="monotone" dataKey={id} stroke={asset?.color || '#8884d8'} strokeWidth={2} dot={false} />
                                })}
                                <Legend />
                            </LineChart>
                        ) : (
                            <LineChart data={singleChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                                <XAxis 
                                    dataKey="date"
                                    tickFormatter={(timeStr) => {
                                        const date = new Date(timeStr);
                                        if (activePeriod === '1D') return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
                                        return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
                                    }}
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />
                                <YAxis 
                                    domain={['dataMin - (dataMin * 0.01)', 'dataMax + (dataMax * 0.01)']}
                                    tickFormatter={(val) => val.toLocaleString()}
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    orientation="right"
                                    tickMargin={8}
                                />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background)/0.9)',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: '0.5rem',
                                        backdropFilter: 'blur(4px)',
                                    }}
                                    labelFormatter={(label) => new Date(label).toLocaleString('ko-KR')}
                                    formatter={(value: number) => [`${activeItem?.symbol || ''}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, activeItem?.name]}
                                />
                                <Line type="monotone" dataKey="value" stroke={isPositive ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))'} strokeWidth={2} dot={false} />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                 </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
