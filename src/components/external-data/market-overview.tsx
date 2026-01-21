'use client';

import { TrendingDown, TrendingUp, Check, Plus, X as XIcon, ChevronDown, ArrowLeft, ArrowRight, Calculator } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useMemo, useEffect } from 'react';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { allAssets as themeAllAssets } from '@/components/themes/data';


const allAssets = [
  { id: 'BTC', name: '비트코인', value: '98,000,000', change: {'1D': -0.5, '1W': 1.5, '1M': -3.0, '1Y': 45.0}, isCrypto: true, symbol: '₩', color: '#F7931A', img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg', averagePrice: 95000000, quantity: 0.5 },
  { id: 'ETH', name: '이더리움', value: '4,500,000', change: {'1D': 0.1, '1W': 2.5, '1M': -1.0, '1Y': 35.0}, isCrypto: true, symbol: '₩', color: '#627EEA', img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg', averagePrice: 4200000, quantity: 2.5 },
  { id: 'SP500', name: 'S&P 500', value: '5,477.90', change: {'1D': -0.16, '1W': 0.5, '1M': 1.2, '1Y': 15.0}, isCrypto: false, symbol: '$', color: '#4B8B3B', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/S%26P_500_Index_logo.svg/200px-S%26P_500_Index_logo.svg.png' },
  { id: 'NASDAQ', name: '나스닥', value: '19,700.43', change: {'1D': -0.26, '1W': 0.8, '1M': 2.5, '1Y': 22.0}, isCrypto: false, symbol: '$', color: '#2A7FFF', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/NASDAQ_logo.svg/200px-NASDAQ_logo.svg.png' },
  { id: 'KOSPI', name: '코스피', value: '2,774.40', change: {'1D': -0.70, '1W': -1.2, '1M': 0.8, '1Y': 8.0}, isCrypto: false, symbol: '₩', color: '#0033A0', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/KRX_logo.svg/200px-KRX_logo.svg.png' },
  { id: 'KOSDAQ', name: '코스닥', value: '841.52', change: {'1D': -1.42, '1W': -2.1, '1M': -0.5, '1Y': 5.0}, isCrypto: false, symbol: '₩', color: '#FF7F00', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/KRX_logo.svg/200px-KRX_logo.svg.png' },
  { id: 'GOLD', name: '금', value: '2,320.50', change: {'1D': 0.35, '1W': -0.5, '1M': -2.0, '1Y': 12.0}, isCrypto: false, symbol: '$', color: '#FFD700', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Gold_ingots.jpg/200px-Gold_ingots.jpg' },
  { id: 'USDE_trend', name: '유에스디이', value: '1,200', change: {'1D': 0.00, '1W': 0.5, '1M': 1.2, '1Y': 5.0}, isCrypto: true, symbol: '₩', color: '#4B8B3B', daysAgo: 7 },
  { id: 'BREVIS_trend', name: '브레비스', value: '850', change: {'1D': -7.51, '1W': -5.2, '1M': -2.0, '1Y': 10.0}, isCrypto: true, symbol: '₩', color: '#2A7FFF', daysAgo: 14 },
  { id: 'XAUT_trend', name: '테더 골드', value: '3,200,000', change: {'1D': 2.90, '1W': 1.5, '1M': 3.0, '1Y': 8.0}, isCrypto: true, symbol: '₩', color: '#FFD700', daysAgo: 20 },
  { id: 'GK_PASS_trend', name: '지케이패스', value: '450', change: {'1D': -3.45, '1W': -2.1, '1M': -1.0, '1Y': 5.0}, isCrypto: true, symbol: '₩', color: '#FF7F00', daysAgo: 26 },
  { id: 'THEORIC_trend', name: '테오릭', value: '1,800', change: {'1D': -7.90, '1W': -5.5, '1M': -3.0, '1Y': 2.0}, isCrypto: true, symbol: '₩', color: '#8A2BE2', daysAgo: 29 },
  { id: 'AI', name: '인공지능(AI)', value: '3,888조 6856억', change: {'1D': 15.2, '1W': 25.5, '1M': 45.0, '1Y': 320.0}, isCrypto: true, symbol: '', color: '#FF6B6B', rising: 46, falling: 75 },
  { id: 'L2', name: '레이어2', value: '1,200조 1122억', change: {'1D': 12.8, '1W': 18.2, '1M': 33.0, '1Y': 280.0}, isCrypto: true, symbol: '', color: '#4ECDC4', rising: 32, falling: 21 },
  { id: 'GAME', name: '게임', value: '850조 4500억', change: {'1D': 8.5, '1W': 11.0, '1M': 21.0, '1Y': 150.0}, isCrypto: true, symbol: '', color: '#45B7D1', rising: 55, falling: 12 },
  { id: 'DeFi', name: '디파이', value: '510조 9870억', change: {'1D': 5.1, '1W': 8.9, '1M': 18.0, '1Y': 180.0}, isCrypto: true, symbol: '', color: '#F9D423', rising: 80, falling: 40 },
  { id: 'RWA', name: '실물자산(RWA)', value: '390조 3300억', change: {'1D': 3.9, '1W': 6.1, '1M': 12.0, '1Y': 450.0}, isCrypto: true, symbol: '', color: '#A9A9A9', rising: 18, falling: 5 },
  { id: 'DOGE_owned', name: '도지코인', value: '215', change: {'1D': 3.5, '1W': 6.8, '1M': 1.2, '1Y': 80.0}, isCrypto: true, symbol: '₩', color: '#C2A633', img: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg', averagePrice: 850, quantity: 5000 },
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
  { id: 'AGIX', name: '싱귤래리티넷', value: '1,200', change: {'1D': 8.5, '1W': 15.2, '1M': 28.0, '1Y': 180.0}, isCrypto: true, symbol: '₩', color: '#FB542B', img: 'https://cryptologos.cc/logos/singularitynet-agix-logo.svg' },
  { id: 'FET', name: '페치', value: '2,800', change: {'1D': 12.3, '1W': 22.5, '1M': 35.0, '1Y': 250.0}, isCrypto: true, symbol: '₩', color: '#202020', img: 'https://cryptologos.cc/logos/fetch-ai-fet-logo.svg' },
  { id: 'OCEAN', name: '오션 프로토콜', value: '950', change: {'1D': 5.8, '1W': 11.2, '1M': 20.0, '1Y': 150.0}, isCrypto: true, symbol: '₩', color: '#141414', img: 'https://cryptologos.cc/logos/ocean-protocol-ocean-logo.svg' },
  { id: 'MATIC', name: '폴리곤', value: '850', change: {'1D': 4.2, '1W': 8.5, '1M': 15.0, '1Y': 120.0}, isCrypto: true, symbol: '₩', color: '#8247E5', img: 'https://cryptologos.cc/logos/polygon-matic-logo.svg' },
  { id: 'MKR', name: '메이커', value: '3,500,000', change: {'1D': 2.1, '1W': 5.5, '1M': 12.0, '1Y': 180.0}, isCrypto: true, symbol: '₩', color: '#1AAB9B', img: 'https://cryptologos.cc/logos/maker-mkr-logo.svg' },
];

const dataSets: { [key: string]: any[] } = {
    indices: allAssets.filter(a => ['BTC', 'ETH', 'SP500', 'NASDAQ', 'KOSPI', 'KOSDAQ', 'GOLD'].includes(a.id)),
    themes: allAssets.filter(a => ['L1', 'L2', 'AI', 'DePIN', 'RWA', 'GAME', 'DeFi', 'SERVICE', 'MEME', 'SOCIAL', 'NFT', 'PAYMENT', 'METAVERSE', 'FAN'].includes(a.id)),
    trending: allAssets.filter(a => a.id.endsWith('_trend')),
    owned: allAssets.filter(a => ['BTC', 'ETH', 'DOGE_owned'].includes(a.id)),
    watchlist: [],
};

const themeAssets: Record<string, string[]> = {
    'L1': ['BTC', 'ETH', 'SOL'],
    'L2': ['ARB', 'IMX', 'MATIC'],
    'AI': ['WLD_watch', 'AGIX', 'OCEAN'],
    'DePIN': ['PYTH', 'SNX'],
    'RWA': ['PYTH', 'SNX', 'MKR'],
    'GAME': ['AXS', 'SAND', 'IMX'],
    'DeFi': ['UNI', 'AAVE', 'COMP'],
    'SERVICE': ['UNI', 'AAVE', 'COMP'],
    'MEME': ['DOGE', 'BTC', 'ETH'],
    'SOCIAL': ['WLD_watch', 'BTC', 'ETH'],
    'NFT': ['IMX', 'SAND'],
    'PAYMENT': ['XRP', 'BTC', 'ETH'],
    'METAVERSE': ['SAND', 'AXS'],
    'FAN': ['DOGE', 'BTC', 'ETH'],
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
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calculatorMode, setCalculatorMode] = useState<'average' | 'marketcap'>('average');
  const [selectedAssetForCalc, setSelectedAssetForCalc] = useState<any>(null);

  // 티커명 매핑 (id -> 티커명)
  const tickerMapping: Record<string, string> = {
    'USDE_trend': 'USDE',
    'BREVIS_trend': 'BREV',
    'XAUT_trend': 'XAUT',
    'GK_PASS_trend': 'ZKP',
    'THEORIC_trend': 'THQ',
  };

  const getTicker = (id: string): string => {
    if (tickerMapping[id]) {
      return tickerMapping[id];
    }
    // _trend를 제거한 것을 기본 티커명으로 사용
    return id.replace('_trend', '');
  };

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
    (asset) => !watchlistAssets.some(wa => wa.id === asset.id) && !asset.id.includes('trend') && !['L1','L2','AI','DePIN','RWA','GAME','DeFi','SERVICE','MEME','SOCIAL','NFT','PAYMENT','METAVERSE','FAN','RNDR','ONDO','OP'].includes(asset.id) && !asset.id.includes('owned') && asset.img
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
                        {(activeTab === 'indices' || activeTab === 'owned') && item.img && (
                            <Avatar className="h-6 w-6 mr-3 shrink-0">
                                <AvatarImage src={item.img} alt={item.name} />
                                <AvatarFallback className="text-[10px]" style={{ backgroundColor: item.color, color: 'white' }}>{item.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        )}
                        <div className="flex-1 text-left min-w-0" onClick={() => !isCompareMode && handleAssetSelection(item.id)}>
                            <span className="text-sm font-semibold text-foreground truncate">
                                {item.name}
                                {(activeTab === 'indices' || activeTab === 'owned') && (
                                    <span className="text-xs text-muted-foreground ml-1">
                                        ({item.id.replace('_owned', '')})
                                    </span>
                                )}
                                {activeTab === 'trending' && item.id.includes('_trend') && (
                                    <span className="text-xs text-muted-foreground ml-1">
                                        ({getTicker(item.id)})
                                    </span>
                                )}
                            </span>
                            {activeTab === 'themes' && item.rising !== undefined && (
                                <div className="text-xs text-muted-foreground mt-1">
                                    <span className="text-red-500">↑{item.rising}</span>
                                    <span className="mx-1">/</span>
                                    <span className="text-blue-500">↓{item.falling}</span>
                                </div>
                            )}
                            {activeTab === 'trending' && (item as any).daysAgo !== undefined && (
                                <div className="text-xs text-muted-foreground mt-1">
                                    {(item as any).daysAgo}일 전 상장
                                </div>
                            )}
                            {activeTab === 'watchlist' && (
                                <div className="text-xs text-muted-foreground mt-1">
                                    {item.id.replace('_watch', '')}
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
                         <Collapsible key={item.id} open={activeIndex === item.id} onOpenChange={(isOpen) => {
                                if (isOpen) {
                                    setActiveIndex(item.id);
                                    if (!isCompareMode) {
                                        setChartActiveIndex(item.id);
                                    }
                                } else if(activeIndex === item.id) {
                                    setActiveIndex("");
                                    // 드롭다운을 닫을 때는 차트를 유지 (chartActiveIndex는 변경하지 않음)
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
                                    {assetsInTheme.length > 0 ? assetsInTheme.map((subItem, index) => {
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
                                                <span className="text-sm font-semibold text-muted-foreground mr-2 w-6">{index + 1}.</span>
                                                <Avatar className="h-6 w-6 mr-3">
                                                <AvatarImage src={subItem.img} alt={subItem.name} />
                                                <AvatarFallback>{subItem.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-semibold truncate">{subItem.name}</div>
                                                    <div className="text-xs text-muted-foreground">{subItem.id}</div>
                                                </div>
                                                <div className="w-24 text-right">
                                                    <div className="font-mono text-sm">{subItem.symbol}{subItem.value}</div>
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
                {activeTab === 'owned' && (
                    <Button 
                        variant="outline" 
                        className="w-full mt-2 h-12"
                        onClick={() => setIsCalculatorOpen(true)}
                    >
                        <Calculator className="w-4 h-4 mr-2" />
                        계산기
                    </Button>
                )}
                {activeTab === 'watchlist' && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full mt-2 h-12 border-dashed">
                                <Plus className="w-4 h-4 mr-2" />
                                관심 종목 추가
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[360px]" align="start">
                            <div className="max-h-[400px] overflow-y-auto">
                                {unselectedWatchlistAssets.map(asset => {
                                    const assetChange = asset.change[activePeriod as keyof typeof asset.change];
                                    const assetIsPositive = assetChange >= 0;
                                    const assetColor = assetIsPositive ? redColor : blueColor;
                                    
                                    return (
                                        <DropdownMenuItem 
                                            key={asset.id} 
                                            onSelect={() => addToWatchlist(asset.id)}
                                            className="p-3 cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <Avatar className="h-8 w-8 shrink-0">
                                                        <AvatarImage src={asset.img} alt={asset.name} />
                                                        <AvatarFallback>{asset.name?.charAt(0) || asset.id.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-semibold text-foreground truncate">{asset.name}</div>
                                                        <div className="text-xs text-muted-foreground">{asset.id.replace('_watch', '')}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right ml-4 shrink-0">
                                                    <div className="text-sm font-bold text-foreground">{asset.symbol}{asset.value}</div>
                                                    <div className={`text-xs font-semibold`} style={{ color: assetColor }}>
                                                        {assetIsPositive ? '+' : ''}{assetChange.toFixed(2)}%
                                                    </div>
                                                </div>
                                            </div>
                                        </DropdownMenuItem>
                                    );
                                })}
                            </div>
                            {unselectedWatchlistAssets.length === 0 && (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    추가할 수 있는 종목이 없습니다.
                                </div>
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
      
      {/* 계산기 다이얼로그 */}
      <Dialog open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>보유종목 계산기</DialogTitle>
            <DialogDescription>
              물타기 평단가 계산 또는 시가총액 비교 시뮬레이션을 선택하세요
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-2 mb-6">
            <Button
              variant={calculatorMode === 'average' ? 'default' : 'outline'}
              onClick={() => {
                setCalculatorMode('average');
                setSelectedAssetForCalc(null);
              }}
              className="flex-1"
            >
              물타기/평단 계산기
            </Button>
            <Button
              variant={calculatorMode === 'marketcap' ? 'default' : 'outline'}
              onClick={() => {
                setCalculatorMode('marketcap');
                setSelectedAssetForCalc(null);
              }}
              className="flex-1"
            >
              시가총액 비교 계산기
            </Button>
          </div>

          {calculatorMode === 'average' ? (
            <AveragePriceCalculator 
              assets={marketData} 
              selectedAsset={selectedAssetForCalc}
              onAssetSelect={setSelectedAssetForCalc}
            />
          ) : (
            <MarketCapCalculator 
              assets={marketData}
              selectedAsset={selectedAssetForCalc}
              onAssetSelect={setSelectedAssetForCalc}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// 물타기/평단 계산기 컴포넌트
function AveragePriceCalculator({ assets, selectedAsset, onAssetSelect }: { assets: any[], selectedAsset: any, onAssetSelect: (asset: any) => void }) {
  const [currentPrice, setCurrentPrice] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [additionalQuantity, setAdditionalQuantity] = useState('');

  // selectedAsset이 변경될 때 자동으로 값 채우기
  useEffect(() => {
    if (selectedAsset) {
      if (selectedAsset.averagePrice) {
        setCurrentPrice(selectedAsset.averagePrice.toString());
      } else {
        const price = parseFloat(selectedAsset.value.replace(/,/g, '').replace(/[^0-9.-]/g, ''));
        setCurrentPrice(price.toString());
      }
      if (selectedAsset.quantity) {
        setCurrentQuantity(selectedAsset.quantity.toString());
      }
      setAdditionalQuantity('');
    } else {
      setCurrentPrice('');
      setCurrentQuantity('');
      setAdditionalQuantity('');
    }
  }, [selectedAsset]);

  const calculations = useMemo(() => {
    if (!selectedAsset || !currentPrice || !currentQuantity) {
      return null;
    }

    const currentPriceNum = parseFloat(currentPrice.replace(/,/g, ''));
    const currentQuantityNum = parseFloat(currentQuantity.replace(/,/g, ''));
    
    if (isNaN(currentPriceNum) || isNaN(currentQuantityNum)) {
      return null;
    }

    // 추가 매수 정보가 있으면 포함, 없으면 현재 정보만으로 계산
    // 추가 매수가는 현재 시장 가격으로 고정
    const currentMarketPrice = parseFloat(selectedAsset.value.replace(/,/g, '').replace(/[^0-9.-]/g, ''));
    const additionalPriceNum = additionalQuantity ? currentMarketPrice : 0;
    const additionalQuantityNum = additionalQuantity ? parseFloat(additionalQuantity.replace(/,/g, '')) : 0;

    const totalInvestment = (currentPriceNum * currentQuantityNum) + (additionalPriceNum * additionalQuantityNum);
    const totalQuantity = currentQuantityNum + (additionalQuantityNum || 0);
    const averagePrice = totalQuantity > 0 ? totalInvestment / totalQuantity : currentPriceNum;
    const profitLossPercent = ((currentMarketPrice - averagePrice) / averagePrice) * 100;

    return {
      averagePrice,
      totalQuantity,
      totalInvestment,
      profitLossPercent,
      currentMarketPrice
    };
  }, [selectedAsset, currentPrice, currentQuantity, additionalQuantity]);

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-semibold mb-2 block">보유 종목 선택</Label>
        <div className="grid grid-cols-2 gap-2">
          {assets.map((asset) => (
            <Button
              key={asset.id}
              variant={selectedAsset?.id === asset.id ? 'default' : 'outline'}
              onClick={() => {
                onAssetSelect(asset);
              }}
              className="justify-start"
            >
              {asset.img && (
                <Avatar className="h-5 w-5 mr-2">
                  <AvatarImage src={asset.img} alt={asset.name} />
                  <AvatarFallback className="text-[10px]" style={{ backgroundColor: asset.color, color: 'white' }}>
                    {asset.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              {asset.name}
            </Button>
          ))}
        </div>
      </div>

      {selectedAsset && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current-price" className="text-sm font-medium mb-2 block">
                현재 평단가
              </Label>
              <Input
                id="current-price"
                type="text"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value.replace(/[^0-9.,]/g, ''))}
                className="w-full"
                disabled={!!selectedAsset?.averagePrice}
              />
            </div>
            <div>
              <Label htmlFor="current-quantity" className="text-sm font-medium mb-2 block">
                현재 보유 수량
              </Label>
              <Input
                id="current-quantity"
                type="text"
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(e.target.value.replace(/[^0-9.,]/g, ''))}
                className="w-full"
                disabled={!!selectedAsset?.quantity}
              />
            </div>
          </div>

          <div className="border-t pt-4">
     
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="additional-price" className="text-sm font-medium mb-2 block">
                  추가 매수가
                </Label>
                <Input
                  id="additional-price"
                  type="text"
                  value={selectedAsset ? parseFloat(selectedAsset.value.replace(/,/g, '').replace(/[^0-9.-]/g, '')).toLocaleString('ko-KR') : ''}
                  className="w-full"
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">현재 시장 가격</p>
              </div>
              <div>
                <Label htmlFor="additional-quantity" className="text-sm font-medium mb-2 block">
                  추가 수량
                </Label>
                <Input
                  id="additional-quantity"
                  type="text"
                  value={additionalQuantity}
                  onChange={(e) => setAdditionalQuantity(e.target.value.replace(/[^0-9.,]/g, ''))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {calculations && (
            <div className="bg-muted/50 rounded-lg p-6 space-y-4 border">
              <div>
                <div className="text-xs text-muted-foreground mb-1">예상 평단가</div>
                <div className="text-2xl font-bold text-orange-500">
                  {calculations.averagePrice.toLocaleString('ko-KR')}원
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">현재 수익률</div>
                <div className={cn(
                  "text-2xl font-bold",
                  calculations.profitLossPercent >= 0 ? 'text-green-500' : 'text-red-500'
                )}>
                  {calculations.profitLossPercent >= 0 ? '+' : ''}{calculations.profitLossPercent.toFixed(2)}%
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">총 보유량</div>
                  <div className="text-lg font-semibold">
                    {calculations.totalQuantity.toLocaleString('ko-KR')} {selectedAsset.id.replace('_owned', '')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">총 투자금</div>
                  <div className="text-lg font-semibold">
                    {Math.round(calculations.totalInvestment).toLocaleString('ko-KR')}원
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// 시가총액 비교 계산기 컴포넌트
function MarketCapCalculator({ assets, selectedAsset, onAssetSelect }: { assets: any[], selectedAsset: any, onAssetSelect: (asset: any) => void }) {
  const [compareAsset, setCompareAsset] = useState<any>(null);
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [currentAveragePrice, setCurrentAveragePrice] = useState('');

  // selectedAsset이 변경될 때 자동으로 값 채우기
  useEffect(() => {
    if (selectedAsset) {
      if (selectedAsset.averagePrice) {
        setCurrentAveragePrice(selectedAsset.averagePrice.toString());
      }
      if (selectedAsset.quantity) {
        setCurrentQuantity(selectedAsset.quantity.toString());
      }
      setCompareAsset(null);
    } else {
      setCurrentQuantity('');
      setCurrentAveragePrice('');
      setCompareAsset(null);
    }
  }, [selectedAsset]);

  const topAssets = useMemo(() => {
    return themeAllAssets.filter(a => ['BTC', 'ETH', 'SOL', 'DOGE', 'XRP'].includes(a.id));
  }, []);

  const calculations = useMemo(() => {
    if (!selectedAsset || !compareAsset || !currentQuantity || !currentAveragePrice) {
      return null;
    }

    // themeAllAssets에서 marketCap 가져오기
    const selectedThemeAsset = themeAllAssets.find(a => a.id === selectedAsset.id.replace('_owned', ''));
    const compareThemeAsset = themeAllAssets.find(a => a.id === compareAsset.id);
    
    if (!selectedThemeAsset?.marketCap || !compareThemeAsset?.marketCap) return null;

    // "1,382조" 형식을 숫자로 변환 (조 = 1조 = 1e12)
    const parseMarketCap = (str: string): number => {
      const cleaned = str.replace(/[^0-9.,조억]/g, '');
      if (cleaned.includes('조')) {
        const parts = cleaned.split('조');
        const jo = parseFloat(parts[0].replace(/,/g, '')) || 0;
        const eok = parts[1] ? parseFloat(parts[1].replace(/[억,]/g, '')) || 0 : 0;
        return jo * 1e12 + eok * 1e8;
      } else if (cleaned.includes('억')) {
        return parseFloat(cleaned.replace(/[억,]/g, '')) * 1e8;
      }
      return parseFloat(cleaned.replace(/,/g, '')) || 0;
    };

    const selectedMarketCap = parseMarketCap(selectedThemeAsset.marketCap);
    const compareMarketCap = parseMarketCap(compareThemeAsset.marketCap);
    
    if (!selectedMarketCap || !compareMarketCap) return null;

    const currentPrice = parseFloat(selectedAsset.value.replace(/,/g, '').replace(/[^0-9.-]/g, ''));
    const targetPrice = (currentPrice * compareMarketCap) / selectedMarketCap;
    const requiredIncrease = ((targetPrice - currentPrice) / currentPrice) * 100;
    
    const quantity = parseFloat(currentQuantity.replace(/,/g, ''));
    const averagePrice = parseFloat(currentAveragePrice.replace(/,/g, '').replace(/[^0-9.-]/g, ''));
    
    if (isNaN(quantity) || isNaN(averagePrice)) return null;

    const currentValue = quantity * currentPrice;
    const targetValue = quantity * targetPrice;

    return {
      targetPrice,
      requiredIncrease,
      currentValue,
      targetValue
    };
  }, [selectedAsset, compareAsset, currentQuantity, currentAveragePrice]);

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-semibold mb-2 block">내 보유 종목</Label>
        <div className="grid grid-cols-2 gap-2">
          {assets.map((asset) => (
            <Button
              key={asset.id}
              variant={selectedAsset?.id === asset.id ? 'default' : 'outline'}
              onClick={() => {
                onAssetSelect(asset);
              }}
              className="justify-start"
            >
              {asset.img && (
                <Avatar className="h-5 w-5 mr-2">
                  <AvatarImage src={asset.img} alt={asset.name} />
                  <AvatarFallback className="text-[10px]" style={{ backgroundColor: asset.color, color: 'white' }}>
                    {asset.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              {asset.name}
            </Button>
          ))}
        </div>
      </div>

      {selectedAsset && (
        <>
          <div>
            <Label className="text-sm font-semibold mb-2 block">비교할 대상 코인</Label>
            <div className="flex flex-wrap gap-2">
              {topAssets.map((asset) => (
                <Button
                  key={asset.id}
                  variant={compareAsset?.id === asset.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCompareAsset(asset)}
                >
                  {asset.img && (
                    <Avatar className="h-4 w-4 mr-1.5">
                      <AvatarImage src={asset.img} alt={asset.name} />
                      <AvatarFallback className="text-[8px]" style={{ backgroundColor: asset.color, color: 'white' }}>
                        {asset.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {asset.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="calc-quantity" className="text-sm font-medium mb-2 block">
                보유 수량
              </Label>
              <Input
                id="calc-quantity"
                type="text"
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(e.target.value.replace(/[^0-9.,]/g, ''))}
                className="w-full"
                disabled={!!selectedAsset?.quantity}
              />
            </div>
            <div>
              <Label htmlFor="calc-avg-price" className="text-sm font-medium mb-2 block">
                평단가
              </Label>
              <Input
                id="calc-avg-price"
                type="text"
                value={currentAveragePrice}
                onChange={(e) => setCurrentAveragePrice(e.target.value.replace(/[^0-9.,]/g, ''))}
                className="w-full"
                disabled={!!selectedAsset?.averagePrice}
              />
            </div>
          </div>

          {calculations && compareAsset && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-6 space-y-6 border border-purple-200 dark:border-purple-800">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">
                  {selectedAsset.name}이(가) {compareAsset.name} 시가총액이 되면
                </div>
                <div className="text-3xl font-bold text-orange-500 mb-4">
                  {calculations.targetPrice.toLocaleString('ko-KR')}원
                </div>
                <div className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  현재가 대비 {calculations.requiredIncrease >= 0 ? '+' : ''}{calculations.requiredIncrease.toFixed(2)}% 상승 필요
                </div>
              </div>

              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">현재 평가금액</span>
                  <span className="text-lg font-semibold">
                    {(calculations.currentValue / 10000).toFixed(1)}만원
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">예상 평가금액</span>
                  <span className="text-2xl font-bold text-orange-500">
                    {(calculations.targetValue / 10000).toFixed(1)}만원
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
