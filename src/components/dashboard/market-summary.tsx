
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, AreaChart, PieChart, GitCompareArrows, Gauge, Search, TrendingUp, TrendingDown, Flame, Waves, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '../ui/badge';


const summaryData = {
  risingAssetsCount: 88,
  fallingAssetsCount: 62,
  overboughtCount: 12,
  oversoldCount: 8,
  volumeSpikeCount: 7,
  volumeDropCount: 15,
  fearGreedIndex: 48,
  yesterdayFearGreedIndex: 45,
  goldenCrossCount: 5,
  deadCrossCount: 2,
  fearStateCount: 4,
  greedStateCount: 9,
};

// Mock Data for coin lists in dialogs
const COIN_DATABASE = [
  { id: 'btc', name: '비트코인', symbol: 'BTC', price: '98,200,000', change: '+0.80', changeValue: 0.80, icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg', tags: ['rising', 'volume', 'greed'], rvol: 1.0, rvolChange: 20, sentiment: 'greed', rsi: 55 },
  { id: 'eth', name: '이더리움', symbol: 'ETH', price: '3,520,000', change: '+1.20', changeValue: 1.20, icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg', tags: ['rising', 'golden-cross', 'volume', 'greed'], rvol: 1.2, rvolChange: 40, sentiment: 'greed', rsi: 62 },
  { id: 'xrp', name: '리플', symbol: 'XRP', price: '845', change: '-1.20', changeValue: -1.20, icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg', tags: ['falling', 'dead-cross', 'fear'], rvol: 0.8, rvolChange: -15, sentiment: 'fear', rsi: 42 },
  { id: 'sol', name: '솔라나', symbol: 'SOL', price: '210,000', change: '+5.10', changeValue: 5.10, icon: 'https://cryptologos.cc/logos/solana-sol-logo.svg', tags: ['rising', 'golden-cross', 'volume', 'overbought', 'greed'], rvol: 2.5, rvolChange: 150, sentiment: 'extreme_greed', rsi: 78 },
  { id: 'doge', name: '도지코인', symbol: 'DOGE', price: '215', change: '+3.50', changeValue: 3.50, icon: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg', tags: ['rising', 'volume', 'greed'], rvol: 1.8, rvolChange: 80, sentiment: 'greed', rsi: 65 },
  { id: 'ada', name: '카르다노', symbol: 'ADA', price: '650', change: '-2.50', changeValue: -2.50, icon: 'https://cryptologos.cc/logos/cardano-ada-logo.svg', tags: ['falling', 'oversold', 'fear', 'rvol_drop'], rvol: 0.6, rvolChange: -40, sentiment: 'fear', rsi: 25 },
  { id: 'wld', name: '월드코인', symbol: 'WLD', price: '7,200', change: '+12.40', changeValue: 12.40, icon: 'https://cryptologos.cc/logos/worldcoin-org-wld-logo.svg', tags: ['rising', 'volume', 'overbought', 'greed', 'rvol_spike'], rvol: 3.5, rvolChange: 250, sentiment: 'extreme_greed', rsi: 82 },
  { id: 'shib', name: '시바이누', symbol: 'SHIB', price: '0.035', change: '+4.50', changeValue: 4.50, icon: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.svg', tags: ['rising', 'volume', 'greed'], rvol: 2.2, rvolChange: 120, sentiment: 'greed', rsi: 68 },
  { id: 'stx', name: '스택스', symbol: 'STX', price: '3,200', change: '+8.10', changeValue: 8.10, icon: 'https://cryptologos.cc/logos/stacks-stx-logo.svg', tags: ['rising', 'golden-cross', 'volume', 'rvol_spike'], rvol: 3.2, rvolChange: 220, sentiment: 'greed', rsi: 71 },
  { id: 'imx', name: '이뮤터블엑스', symbol: 'IMX', price: '3,100', change: '-3.10', changeValue: -3.10, icon: 'https://cryptologos.cc/logos/immutable-x-imx-logo.svg', tags: ['falling', 'dead-cross', 'oversold', 'fear', 'rvol_drop'], rvol: 0.9, rvolChange: -10, sentiment: 'extreme_fear', rsi: 22 },
  { id: 'pepe', name: '페페', symbol: 'PEPE', price: '0.017', change: '+15.00', changeValue: 15.00, icon: 'https://cryptologos.cc/logos/pepe-pepe-logo.svg', tags: ['rising', 'rvol_spike'], rvol: 2.8, rvolChange: 180, sentiment: 'extreme_greed', rsi: 75 },
];

function getFearGreedSentiment(index: number): { text: string; color: string } {
    if (index <= 20) return { text: '극심한 공포', color: 'text-red-600' };
    if (index <= 45) return { text: '공포', color: 'text-orange-500' };
    if (index <= 55) return { text: '중립', color: 'text-gray-500' };
    if (index <= 80) return { text: '탐욕', color: 'text-green-400' };
    return { text: '극심한 탐욕', color: 'text-green-500' };
}

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

const PriceChangeDialogContent = ({coins}: {coins: any[]}) => {
    const [sortKey, setSortKey] = useState<'changeValue'>('changeValue');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const sortedCoins = useMemo(() => {
        return [...coins].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[sortKey] - b[sortKey];
            }
            return b[sortKey] - a[sortKey];
        });
    }, [coins, sortKey, sortOrder]);
    
    return (
      <>
        <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle>상승/하락 종목 리스트</DialogTitle>
            <DialogDescription>
                지난 24시간 동안 가격이 상승하거나 하락한 종목들입니다. 시장의 전반적인 분위기를 파악할 수 있습니다.
            </DialogDescription>
        </DialogHeader>
        <div className="p-2 h-[60vh]">
             <ScrollArea className="h-full pr-4 -mr-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>종목</TableHead>
                            <TableHead className="text-right">현재가/등락</TableHead>
                            <TableHead className="text-center">주간차트</TableHead>
                            <TableHead className="text-right cursor-pointer" onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
                                <div className="flex items-center justify-end gap-1">
                                    오늘 등락률
                                    <ChevronDown className={cn('h-4 w-4 transition-transform', sortOrder === 'asc' && 'rotate-180')} />
                                </div>
                            </TableHead>
                             <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedCoins.map((coin) => (
                            <TableRow key={coin.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={coin.icon} alt={coin.name} />
                                            <AvatarFallback>{coin.symbol}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-bold text-sm">{coin.name}</div>
                                            <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                     <div className="font-bold text-xs">{coin.price}</div>
                                    <div className={`text-[10px] font-medium ${coin.change.startsWith('+') ? 'text-red-500' : 'text-blue-500'}`}>
                                        {coin.change}%
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="w-16 h-8 mx-auto">
                                        <MiniChart data={getChartDataForListItem(coin.changeValue, coin.id)} color={coin.changeValue > 0 ? '#ef4444' : '#3b82f6'} />
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className={`font-mono font-semibold ${coin.changeValue > 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                        {coin.changeValue.toFixed(2)}%
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" className="h-8 text-[11px] px-3 bg-red-50 text-red-600 hover:bg-red-100 border-0 font-bold shrink-0 tracking-tight">
                                        매수하기
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
      </>
    );
}

const RvolDialogContent = ({coins}: {coins: any[]}) => {
    const [sortKey, setSortKey] = useState<'rvol' | 'rvolChange'>('rvol');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const sortedCoins = useMemo(() => {
        return [...coins].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[sortKey] - b[sortKey];
            }
            return b[sortKey] - a[sortKey];
        });
    }, [coins, sortKey, sortOrder]);

    const handleSort = (key: 'rvol' | 'rvolChange') => {
        if (sortKey === key) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('desc');
        }
    };

    return (
      <>
        <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle>상대거래량(RVOL) 분석</DialogTitle>
            <DialogDescription>
                평균 거래량 대비 현재 거래량의 비율을 나타냅니다. RVOL이 높을수록 시장의 관심이 뜨겁다는 것을 의미하며, 급격한 가격 변동으로 이어질 수 있습니다.
            </DialogDescription>
        </DialogHeader>
        <div className="p-2 h-[60vh]">
             <ScrollArea className="h-full pr-4 -mr-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>종목</TableHead>
                            <TableHead className="text-right">현재가/등락</TableHead>
                            <TableHead className="text-center">주간차트</TableHead>
                            <TableHead className="text-right cursor-pointer" onClick={() => handleSort('rvol')}>
                                <div className="flex items-center justify-end gap-1">
                                    RVOL
                                    {sortKey === 'rvol' && <ChevronDown className={cn('h-4 w-4 transition-transform', sortOrder === 'asc' && 'rotate-180')} />}
                                </div>
                            </TableHead>
                            <TableHead className="text-right cursor-pointer" onClick={() => handleSort('rvolChange')}>
                                <div className="flex items-center justify-end gap-1">
                                    평균 대비
                                    {sortKey === 'rvolChange' && <ChevronDown className={cn('h-4 w-4 transition-transform', sortOrder === 'asc' && 'rotate-180')} />}
                                </div>
                            </TableHead>
                             <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedCoins.map((coin) => (
                            <TableRow key={coin.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={coin.icon} alt={coin.name} />
                                            <AvatarFallback>{coin.symbol}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-bold text-sm">{coin.name}</div>
                                            <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                     <div className="font-bold text-xs">{coin.price}</div>
                                    <div className={`text-[10px] font-medium ${coin.change.startsWith('+') ? 'text-red-500' : 'text-blue-500'}`}>
                                        {coin.change}%
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="w-16 h-8 mx-auto">
                                        <MiniChart data={getChartDataForListItem(coin.rvolChange, coin.id)} color={coin.rvolChange > 0 ? '#ef4444' : '#3b82f6'} />
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-mono font-semibold">{coin.rvol.toFixed(1)}</TableCell>
                                <TableCell className="text-right">
                                    <span className="bg-red-100 text-red-600 font-bold text-xs px-2 py-1 rounded-md">
                                        +{coin.rvolChange}%
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" className="h-8 text-[11px] px-3 bg-red-50 text-red-600 hover:bg-red-100 border-0 font-bold shrink-0 tracking-tight">
                                        매수하기
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
      </>
    );
}

const RsiDialogContent = ({coins}: {coins: any[]}) => {
    const getRsiStatusBadge = (rsi?: number) => {
        if (rsi === undefined) return null;
        if (rsi > 70) return <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">과매수</Badge>;
        if (rsi < 30) return <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">과매도</Badge>;
        return <Badge variant="secondary">중립</Badge>;
    }
    return (
      <>
        <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle>RSI 과매수/과매도 종목</DialogTitle>
            <DialogDescription>
                RSI(상대강도지수)가 70 이상(과매수)이거나 30 이하(과매도)인 종목들입니다. 과매도는 저점 매수, 과매수는 매도 시그널로 해석될 수 있습니다.
            </DialogDescription>
        </DialogHeader>
        <div className="p-2 h-[60vh]">
             <ScrollArea className="h-full pr-4 -mr-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>종목</TableHead>
                            <TableHead className="text-right">현재가/등락</TableHead>
                            <TableHead className="text-center">주간차트</TableHead>
                            <TableHead className="text-center">RSI</TableHead>
                            <TableHead className="text-center">상태</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {coins.map((coin) => (
                            <TableRow key={coin.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={coin.icon} alt={coin.name} />
                                            <AvatarFallback>{coin.symbol}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-bold text-sm">{coin.name}</div>
                                            <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                     <div className="font-bold text-xs">{coin.price}</div>
                                    <div className={`text-[10px] font-medium ${coin.change.startsWith('+') ? 'text-red-500' : 'text-blue-500'}`}>
                                        {coin.change}%
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="w-16 h-8 mx-auto">
                                        <MiniChart data={getChartDataForListItem(parseFloat(coin.change), coin.id)} color={parseFloat(coin.change) > 0 ? '#ef4444' : '#3b82f6'} />
                                    </div>
                                </TableCell>
                                <TableCell className="text-center font-mono font-semibold">{coin.rsi}</TableCell>
                                <TableCell className="text-center">
                                    {getRsiStatusBadge(coin.rsi)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" className="h-8 text-[11px] px-3 bg-red-50 text-red-600 hover:bg-red-100 border-0 font-bold shrink-0 tracking-tight">
                                        매수하기
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
      </>
    );
}

const TrendSignalDialogContent = ({coins}: {coins: any[]}) => {
    const getSignalBadge = (tags: string[]) => {
        if (tags.includes('golden-cross')) {
            return (
                <div className="text-center">
                    <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">골든크로스</Badge>
                    <div className="text-xs text-muted-foreground mt-1">5일선 &gt; 20일선</div>
                </div>
            )
        }
        if (tags.includes('dead-cross')) {
             return (
                <div className="text-center">
                    <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">데드크로스</Badge>
                    <div className="text-xs text-muted-foreground mt-1">5일선 &lt; 20일선</div>
                </div>
            )
        }
        return null;
    }
    return (
      <>
        <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle>추세 신호 발생 종목</DialogTitle>
            <DialogDescription>
                골든크로스(상승 신호) 또는 데드크로스(하락 신호)가 발생하여 추세 전환이 기대되는 종목들입니다.
            </DialogDescription>
        </DialogHeader>
        <div className="p-2 h-[60vh]">
             <ScrollArea className="h-full pr-4 -mr-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>종목</TableHead>
                            <TableHead className="text-right">현재가/등락</TableHead>
                            <TableHead className="text-center">주간차트</TableHead>
                            <TableHead className="text-center">신호</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {coins.map((coin) => (
                            <TableRow key={coin.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={coin.icon} alt={coin.name} />
                                            <AvatarFallback>{coin.symbol}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-bold text-sm">{coin.name}</div>
                                            <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                     <div className="font-bold text-xs">{coin.price}</div>
                                    <div className={`text-[10px] font-medium ${coin.change.startsWith('+') ? 'text-red-500' : 'text-blue-500'}`}>
                                        {coin.change}%
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="w-16 h-8 mx-auto">
                                        <MiniChart data={getChartDataForListItem(parseFloat(coin.change), coin.id)} color={parseFloat(coin.change) > 0 ? '#ef4444' : '#3b82f6'} />
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    {getSignalBadge(coin.tags)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" className="h-8 text-[11px] px-3 bg-red-50 text-red-600 hover:bg-red-100 border-0 font-bold shrink-0 tracking-tight">
                                        매수하기
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
      </>
    );
}

const FearGreedDialogContent = ({coins}: {coins: any[]}) => {
    const getSentimentBadge = (sentiment?: string) => {
        switch (sentiment) {
            case 'extreme_greed': return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">극심한 탐욕</Badge>;
            case 'greed': return <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">탐욕</Badge>;
            case 'fear': return <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">공포</Badge>;
            case 'extreme_fear': return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">극심한 공포</Badge>;
            default: return <Badge variant="secondary">중립</Badge>;
        }
    }
    return (
      <>
        <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle>공포탐욕지수 관련 종목</DialogTitle>
            <DialogDescription>
                현재 시장의 전반적인 투자 심리를 나타냅니다. '공포'는 잠재적 매수 기회, '탐욕'은 시장 과열을 의미할 수 있습니다. 각 종목의 개별 심리 상태도 함께 확인해보세요.
            </DialogDescription>
        </DialogHeader>
        <div className="p-2 h-[60vh]">
             <ScrollArea className="h-full pr-4 -mr-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>종목</TableHead>
                            <TableHead className="text-right">현재가/등락</TableHead>
                            <TableHead className="text-center">주간차트</TableHead>
                            <TableHead className="text-center">심리상태</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {coins.map((coin) => (
                            <TableRow key={coin.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={coin.icon} alt={coin.name} />
                                            <AvatarFallback>{coin.symbol}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-bold text-sm">{coin.name}</div>
                                            <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                     <div className="font-bold text-xs">{coin.price}</div>
                                    <div className={`text-[10px] font-medium ${coin.change.startsWith('+') ? 'text-red-500' : 'text-blue-500'}`}>
                                        {coin.change}%
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="w-16 h-8 mx-auto">
                                        <MiniChart data={getChartDataForListItem(parseFloat(coin.change), coin.id)} color={parseFloat(coin.change) > 0 ? '#ef4444' : '#3b82f6'} />
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    {getSentimentBadge(coin.sentiment)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" className="h-8 text-[11px] px-3 bg-red-50 text-red-600 hover:bg-red-100 border-0 font-bold shrink-0 tracking-tight">
                                        매수하기
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
      </>
    );
}

const CoinListDialog = ({ trigger, title, description, coins, emptyText }: { trigger: React.ReactNode, title: string, description: string, coins: any[], emptyText: string }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-2xl p-0">
                <DialogHeader className="p-6 pb-4 border-b">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="p-6 h-[50vh]">
                     <ScrollArea className="h-full pr-4 -mr-4">
                        {coins.length > 0 ? (
                            <div className="space-y-2 pb-4">
                            {coins.map((coin) => (
                                <div key={coin.id} className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/50 hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-0.5 overflow-hidden shadow-sm shrink-0">
                                    <img src={coin.icon} alt={coin.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="min-w-0">
                                    <div className="font-bold text-xs truncate">{coin.name}</div>
                                    <div className="text-[10px] text-muted-foreground">{coin.symbol}</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 pl-2">
                                    <div className="text-right shrink-0">
                                    <div className="font-bold text-xs">{coin.price}</div>
                                    <div className={`text-[10px] font-medium ${coin.change.startsWith('+') ? 'text-red-500' : 'text-blue-500'}`}>
                                        {coin.change}%
                                    </div>
                                    </div>
                                    <Button size="sm" className="h-8 text-[11px] px-3 bg-red-50 text-red-600 hover:bg-red-100 border-0 font-bold shrink-0 tracking-tight">
                                        매수하기
                                    </Button>
                                </div>
                                </div>
                            ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center space-y-2 border-2 border-dashed border-muted rounded-xl bg-muted/20">
                                <Search className="w-8 h-8 opacity-20" />
                                <p className="text-xs">{emptyText}</p>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export function MarketSummary() {
  const isMarketUp = summaryData.risingAssetsCount > summaryData.fallingAssetsCount;
  const [risingFallingDialogOpen, setRisingFallingDialogOpen] = useState(false);
  const [trendSignalDialogOpen, setTrendSignalDialogOpen] = useState(false);
  const [rsiDialogOpen, setRsiDialogOpen] = useState(false);
  const [volumeDialogOpen, setVolumeDialogOpen] = useState(false);

  return (
    <>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 24시간 상승/하락 */}
                <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-sm text-foreground">상승/하락 수</h4>
                            <button
                              onClick={() => setRisingFallingDialogOpen(true)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex gap-0 mb-3">
                            <div className="flex-1 text-right pr-2">
                                <div className="text-xs text-muted-foreground mb-1">상승</div>
                                <div className="text-2xl font-bold text-green-600">{summaryData.risingAssetsCount}</div>
                            </div>
                            <div className="w-px bg-border" />
                            <div className="flex-1 text-left pl-2">
                                <div className="text-xs text-muted-foreground mb-1">하락</div>
                                <div className="text-2xl font-bold text-red-600">{summaryData.fallingAssetsCount}</div>
                            </div>
                        </div>
                        <Link href={`/internal-data?tab=comparison&filter=change&direction=${isMarketUp ? 'up' : 'down'}`}>
                            <Button variant="ghost" size="sm" className="w-full text-xs h-7 hover:bg-green-500/10">
                                {isMarketUp ? '상승 종목 전체보기' : '반등 기대주 찾기'}
                                <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* 추세 신호 */}
                <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-sm text-foreground">추세 신호</h4>
                            <button
                              onClick={() => setTrendSignalDialogOpen(true)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex gap-0 mb-3">
                            <div className="flex-1 text-right pr-2">
                                <div className="text-xs text-muted-foreground mb-1">골든크로스</div>
                                <div className="text-2xl font-bold text-orange-600">{summaryData.goldenCrossCount}</div>
                            </div>
                            <div className="w-px bg-border" />
                            <div className="flex-1 text-left pl-2">
                                <div className="text-xs text-muted-foreground mb-1">데드크로스</div>
                                <div className="text-2xl font-bold text-blue-600">{summaryData.deadCrossCount}</div>
                            </div>
                        </div>
                        <Link href="/internal-data?tab=comparison&filter=ma&crossover=golden">
                            <Button variant="ghost" size="sm" className="w-full text-xs h-7 hover:bg-orange-500/10">
                                골든크로스 전체보기
                                <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* RSI 과매수/과매도 */}
                <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-sm text-foreground">RSI 현황</h4>
                            <button
                              onClick={() => setRsiDialogOpen(true)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex gap-0 mb-3">
                            <div className="flex-1 text-right pr-2">
                                <div className="text-xs text-muted-foreground mb-1">과매수</div>
                                <div className="text-2xl font-bold text-red-600">{summaryData.overboughtCount}</div>
                            </div>
                            <div className="w-px bg-border" />
                            <div className="flex-1 text-left pl-2">
                                <div className="text-xs text-muted-foreground mb-1">과매도</div>
                                <div className="text-2xl font-bold text-blue-600">{summaryData.oversoldCount}</div>
                            </div>
                        </div>
                        <Link href="/internal-data?tab=comparison&filter=rsi&range=oversold">
                            <Button variant="ghost" size="sm" className="w-full text-xs h-7 hover:bg-purple-500/10">
                                과매수/과매도 전체보기
                                <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* 상대거래량 */}
                <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-sm text-foreground">거래량 현황</h4>
                            <button
                              onClick={() => setVolumeDialogOpen(true)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex gap-0 mb-3">
                            <div className="flex-1 text-right pr-2">
                                <div className="text-xs text-muted-foreground mb-1">거래량 과열</div>
                                <div className="text-2xl font-bold text-red-600">{summaryData.volumeSpikeCount}</div>
                            </div>
                            <div className="w-px bg-border" />
                            <div className="flex-1 text-left pl-2">
                                <div className="text-xs text-muted-foreground mb-1">거래량 침체</div>
                                <div className="text-2xl font-bold text-blue-600">{summaryData.volumeDropCount}</div>
                            </div>
                        </div>
                        <Link href="/internal-data?tab=comparison&filter=volume">
                            <Button variant="ghost" size="sm" className="w-full text-xs h-7 hover:bg-cyan-500/10">
                                거래량 과열/침체 전체보기
                                <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>

      {/* 상승/하락 수 설명 다이얼로그 */}
      <Dialog open={risingFallingDialogOpen} onOpenChange={setRisingFallingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">상승/하락 수</DialogTitle>
            <DialogDescription>
              지난 24시간 동안 가격이 오른 종목과 내린 종목의 개수를 보여줘요. 시장 전체의 분위기를 한눈에 파악할 수 있어요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="bg-muted/30 rounded-lg p-5 border border-border/50">
              <h3 className="font-semibold text-sm mb-3">어떻게 활용하나요?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">상승 종목이 많을 때</div>
                    <div className="text-muted-foreground">시장이 강세예요. 상승 종목을 중심으로 투자 기회를 찾아보세요.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">하락 종목이 많을 때</div>
                    <div className="text-muted-foreground">시장이 약세예요. 신중한 접근이 필요하고, 반등 기대주를 찾아볼 수 있어요.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-8 py-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-1">{summaryData.risingAssetsCount}</div>
                <div className="text-xs text-muted-foreground">상승 종목</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-1">{summaryData.fallingAssetsCount}</div>
                <div className="text-xs text-muted-foreground">하락 종목</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 추세 신호 설명 다이얼로그 */}
      <Dialog open={trendSignalDialogOpen} onOpenChange={setTrendSignalDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">추세 신호</DialogTitle>
            <DialogDescription>
              골든크로스와 데드크로스는 이동평균선이 교차할 때 발생하는 추세 전환 신호예요. 상승 추세와 하락 추세의 시작을 알려줘요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="bg-muted/30 rounded-lg p-5 border border-border/50">
              <h3 className="font-semibold text-sm mb-4">골든크로스 vs 데드크로스</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 border border-red-200 dark:border-red-900/30">
                  <div className="font-semibold text-red-600 dark:text-red-400 mb-2">골든크로스</div>
                  <div className="text-xs text-muted-foreground mb-3">단기 이동평균선이 장기 이동평균선을 아래에서 위로 뚫고 올라갈 때</div>
                  <div className="text-xs font-medium text-foreground">→ 상승 추세 시작 신호</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-900/30">
                  <div className="font-semibold text-blue-600 dark:text-blue-400 mb-2">데드크로스</div>
                  <div className="text-xs text-muted-foreground mb-3">단기 이동평균선이 장기 이동평균선을 위에서 아래로 뚫고 내려갈 때</div>
                  <div className="text-xs font-medium text-foreground">→ 하락 추세 시작 신호</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-8 py-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-1">{summaryData.goldenCrossCount}</div>
                <div className="text-xs text-muted-foreground">골든크로스</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-1">{summaryData.deadCrossCount}</div>
                <div className="text-xs text-muted-foreground">데드크로스</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* RSI 현황 설명 다이얼로그 */}
      <Dialog open={rsiDialogOpen} onOpenChange={setRsiDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">RSI 현황</DialogTitle>
            <DialogDescription>
              RSI(상대강도지수)는 가격의 상승과 하락의 상대적 강도를 0-100으로 나타내는 지표예요. 과매수와 과매도 상태를 판단하는 데 활용돼요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="bg-muted/30 rounded-lg p-5 border border-border/50">
              <h3 className="font-semibold text-sm mb-4">과매수 vs 과매도</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-red-600">70</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1">과매수 (RSI 70 이상)</div>
                    <div className="text-xs text-muted-foreground">가격이 과도하게 올라서 조정 가능성이 높아요. 수익 실현을 고려해볼 시점이에요.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">30</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1">과매도 (RSI 30 이하)</div>
                    <div className="text-xs text-muted-foreground">가격이 과도하게 내려서 반등 가능성이 높아요. 저점 매수 기회가 될 수 있어요.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-8 py-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-1">{summaryData.overboughtCount}</div>
                <div className="text-xs text-muted-foreground">과매수 종목</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-1">{summaryData.oversoldCount}</div>
                <div className="text-xs text-muted-foreground">과매도 종목</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 거래량 현황 설명 다이얼로그 */}
      <Dialog open={volumeDialogOpen} onOpenChange={setVolumeDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">거래량 현황</DialogTitle>
            <DialogDescription>
              거래량이 평소보다 비정상적으로 많거나 적은 종목을 보여줘요. 거래량 변화는 가격 움직임의 신뢰도를 판단하는 중요한 지표예요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="bg-muted/30 rounded-lg p-5 border border-border/50">
              <h3 className="font-semibold text-sm mb-4">거래량 과열 vs 침체</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Flame className="w-3.5 h-3.5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1">거래량 과열</div>
                    <div className="text-xs text-muted-foreground">평소보다 거래량이 급증했어요. 큰 움직임이 예상되지만 변동성도 커질 수 있어요.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Waves className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1">거래량 침체</div>
                    <div className="text-xs text-muted-foreground">평소보다 거래량이 크게 줄었어요. 관망 세력이 많아 방향성이 불분명할 수 있어요.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-8 py-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-1">{summaryData.volumeSpikeCount}</div>
                <div className="text-xs text-muted-foreground">거래량 과열</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-1">{summaryData.volumeDropCount}</div>
                <div className="text-xs text-muted-foreground">거래량 침체</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

    

    

    

    

    