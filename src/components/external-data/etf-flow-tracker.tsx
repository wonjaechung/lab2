
'use client';
import { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChartBig, Zap, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type Timeframe = '1W' | '1M' | '1Y' | 'All';

const btcEtfData = [
    { rank: 1, ticker: 'IBIT', name: 'IBIT (BlackRock)', price: 52.1, changeAbsolute: -0.39, changePercent: -0.74, daily: 162.2, aum: 19890.3, premium: 0.02 },
    { rank: 2, ticker: 'FBTC', name: 'FBTC (Fidelity)', price: 48.5, changeAbsolute: -0.21, changePercent: -0.43, daily: -8.1, aum: 11578.4, premium: -0.01 },
    { rank: 3, ticker: 'BITB', name: 'BITB (Bitwise)', price: 39.2, changeAbsolute: 0.1, changePercent: 0.26, daily: 0, aum: 2510.1, premium: 0.05 },
    { rank: 4, ticker: 'ARKB', name: 'ARKB (Ark 21Shares)', price: 55.8, changeAbsolute: -0.55, changePercent: -0.98, daily: -22.6, aum: 3223.5, premium: -0.03 },
    { rank: 5, ticker: 'GBTC', name: 'GBTC (Grayscale)', price: 63.4, changeAbsolute: -0.81, changePercent: -1.26, daily: -154.9, aum: 21750.6, premium: -0.15 },
];

const ethEtfData = [
    { rank: 1, ticker: 'ETHA', name: 'ETHA (iShares)', price: 35.2, changeAbsolute: 0.12, changePercent: 0.34, daily: 35.5, aum: 11840.0, premium: 0.11 },
    { rank: 2, ticker: 'ETHE', name: 'ETHE (Grayscale)', price: 33.1, changeAbsolute: -0.15, changePercent: -0.45, daily: -15.2, aum: 3460.0, premium: -0.25 },
    { rank: 3, ticker: 'FETH', name: 'FETH (Fidelity)', price: 34.5, changeAbsolute: 0.25, changePercent: 0.73, daily: 12.8, aum: 1340.0, premium: 0.08 },
    { rank: 4, ticker: 'ETHW', name: 'ETHW (Bitwise)', price: 32.8, changeAbsolute: 0.05, changePercent: 0.15, daily: 5.1, aum: 400.92, premium: 0.05 },
];

const solEtfData = [
    { rank: 1, ticker: 'BSOL', name: 'BSOL (Bitwise)', price: 150.5, changeAbsolute: 2.5, changePercent: 1.69, daily: 24.66, aum: 400.74, premium: 0.21 },
    { rank: 2, ticker: 'GSOL', name: 'GSOL (Grayscale)', price: 145.2, changeAbsolute: 1.8, changePercent: 1.25, daily: 2.07, aum: 72.05, premium: -0.32 },
    { rank: 3, ticker: 'FSOL', name: 'FSOL (Fidelity)', price: 148.9, changeAbsolute: 2.1, changePercent: 1.43, daily: 3.49, aum: 50.0, premium: 0.15 },
    { rank: 4, ticker: 'VSOL', name: 'VSOL (VanEck)', price: 147.1, changeAbsolute: 1.9, changePercent: 1.31, daily: 1.94, aum: 35.0, premium: 0.12 },
    { rank: 5, ticker: 'TSOL', name: 'TSOL (21Shares)', price: 146.5, changeAbsolute: 2.2, changePercent: 1.52, daily: 0.48, aum: 20.0, premium: 0.18 },
];

const xrpEtfData = [
    { rank: 1, ticker: 'BXRP', name: 'Bitwise XRP ETF', price: 0.52, changeAbsolute: 0.01, changePercent: 1.96, daily: 8.76, aum: 250.0, premium: 0.35 },
    { rank: 2, ticker: 'CXRP', name: 'Canary XRP ETF', price: 0.51, changeAbsolute: -0.005, changePercent: -0.97, daily: -4.84, aum: 862.80, premium: -0.12 },
    { rank: 3, ticker: 'FXRP', name: 'Franklin XRP ETF', price: 0.53, changeAbsolute: 0.015, changePercent: 2.91, daily: 9.04, aum: 200.0, premium: 0.41 },
    { rank: 4, ticker: 'XRPT', name: 'Grayscale XRP Trust ETF', price: 0.5, changeAbsolute: -0.01, changePercent: -1.96, daily: -2.25, aum: 150.0, premium: -0.55 },
]

const totalBtcAUM = btcEtfData.reduce((sum, etf) => sum + etf.aum, 0);
const totalEthAUM = ethEtfData.reduce((sum, etf) => sum + etf.aum, 0);
const totalSolAUM = solEtfData.reduce((sum, etf) => sum + etf.aum, 0);
const totalXrpAUM = xrpEtfData.reduce((sum, etf) => sum + etf.aum, 0);

const assetColors: { [key: string]: string } = {
  btc: '#F7931A',
  eth: '#627EEA',
  sol: '#14F195',
  xrp: '#FFD700',
  BTC: '#F7931A',
  ETH: '#627EEA',
  XRP: '#FFD700',
  SOL: '#14F195',
  BTC_Price: '#22C55E',
  ETH_Price: '#627EEA',
  XRP_Price: '#FFD700',
  SOL_Price: '#14F195',
};

const formatKoreanNumber = (value: number) => {
  const absValue = Math.abs(value);
  if (absValue >= 10000) {
      return `${(value / 10000).toFixed(2)}조`;
  }
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}억`;
}

const EtfTable = ({ data, totalAUM, assetName }: { data: {rank: number, ticker: string, name: string, price: number, changeAbsolute: number, changePercent: number, daily: number, aum: number, premium: number}[], totalAUM: number, assetName: string }) => {
    const KRW_MULTIPLIER = 14;

    return (
    <div className="h-full overflow-hidden">
        <div className="overflow-x-auto">
        <div className="w-full">
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs h-8 w-10 text-center whitespace-nowrap">순위</TableHead>
                <TableHead className="text-xs h-8 whitespace-nowrap">티커</TableHead>
                <TableHead className="text-right text-xs h-8 whitespace-nowrap">운용자산</TableHead>
                <TableHead className="text-right text-xs h-8 whitespace-nowrap">시장점유율</TableHead>
                <TableHead className="text-right text-xs h-8 whitespace-nowrap">주간순유입</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((etf) => {
                    const marketShare = (etf.aum / totalAUM) * 100;
                    const aumKRW = etf.aum * KRW_MULTIPLIER;
                    const inflowKRW = etf.daily * KRW_MULTIPLIER;
                    
                    return (
                    <TableRow key={etf.name} className="h-9 hover:bg-muted/30">
                        <TableCell className="text-center py-1 text-xs">
                            {etf.rank}
                        </TableCell>
                        <TableCell className="py-1">
                            <div className="font-bold text-sm">{etf.ticker}</div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs py-1 text-muted-foreground whitespace-nowrap">
                            {formatKoreanNumber(aumKRW)}
                        </TableCell>
                        <TableCell className="py-1">
                            <div className="flex items-center justify-end gap-1.5">
                                <div className="h-1.5 w-8 bg-secondary rounded-full overflow-hidden">
                                    <div 
                                        className="h-full rounded-full" 
                                        style={{ 
                                            width: `${Math.min(marketShare, 100)}%`,
                                            backgroundColor: assetColors[assetName.toLowerCase()] || '#F7931A'
                                        }} 
                                    />
                                </div>
                                <span className="font-mono text-xs text-muted-foreground w-8 text-right">{marketShare.toFixed(1)}%</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right py-1 whitespace-nowrap">
                            <div className={`font-mono text-xs ${etf.daily >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                {etf.daily >= 0 ? '+' : ''}{formatKoreanNumber(inflowKRW)}
                            </div>
                        </TableCell>
                    </TableRow>
                    )
                })}
            </TableBody>
        </Table>
        </div>
        </div>
    </div>
)};

const generateChartData = (timeframe: Timeframe, asset: string) => {
  let days = 30;
  if (timeframe === '1W') days = 7;
  if (timeframe === '1M') days = 30;
  if (timeframe === '1Y') days = 365;
  if (timeframe === 'All') days = 500;
  
  const data = [];
  
  // 각 자산별 초기 가격 설정
  const initialPrices: { [key: string]: number } = {
    BTC: 65000,
    ETH: 3500,
    XRP: 0.52,
    SOL: 150,
  };
  
  let price = initialPrices[asset] || 65000;
  let accumulatedAUM = { BTC: 50000, ETH: 25000, XRP: 10000, SOL: 8000 };

  // 각 자산별 가격 변동폭 설정
  const priceVolatility: { [key: string]: number } = {
    BTC: 2000,
    ETH: 200,
    XRP: 0.02,
    SOL: 10,
  };

  for (let i = days -1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    price += (Math.random() - 0.5) * (priceVolatility[asset] || 2000);

    const btcFlow = (Math.random() - 0.48) * 800;
    const ethFlow = (Math.random() - 0.49) * 400;
    const xrpFlow = (Math.random() - 0.5) * 300;
    const solFlow = (Math.random() - 0.48) * 360;

    accumulatedAUM.BTC += btcFlow;
    accumulatedAUM.ETH += ethFlow;
    accumulatedAUM.XRP += xrpFlow;
    accumulatedAUM.SOL += solFlow;

    const flowData: any = {
      date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
    };

    if (timeframe === '1W' || timeframe === '1M') {
      flowData.BTC = Math.floor(btcFlow);
      flowData.ETH = Math.floor(ethFlow);
      flowData.XRP = Math.floor(xrpFlow);
      flowData.SOL = Math.floor(solFlow);
    } else {
      flowData.BTC = Math.floor(accumulatedAUM.BTC);
      flowData.ETH = Math.floor(accumulatedAUM.ETH);
      flowData.XRP = Math.floor(accumulatedAUM.XRP);
      flowData.SOL = Math.floor(accumulatedAUM.SOL);
    }

    // 각 자산별 가격 추가
    flowData[`${asset}_Price`] = asset === 'XRP' ? parseFloat(price.toFixed(3)) : Math.floor(price);
    
    data.push(flowData);
  }
  return data;
};

const CustomTooltip = ({ active, payload, label, asset }: any) => {
  if (active && payload && payload.length) {
    const priceKey = `${asset}_Price`;
    const flowPayload = payload.filter((p: any) => !p.dataKey.includes('_Price'));
    const pricePayload = payload.find((p: any) => p.dataKey === priceKey);

    return (
      <div className="bg-background/90 backdrop-blur-sm p-3 border rounded-lg shadow-xl text-xs z-50">
        <p className="font-bold mb-1">{label}</p>
        {flowPayload.map((p: any) => (
            <p key={p.dataKey} className="flex justify-between gap-4" style={{ color: p.color }}>
                <span>{p.dataKey} 순유입</span>
                <span className="font-mono">{p.value >= 0 ? '+' : ''}{formatKoreanNumber(p.value)}</span>
            </p>
        ))}
         {pricePayload && (
            <p className="flex justify-between gap-4 mt-1 pt-1 border-t" style={{ color: '#FFD700' }}>
                <span>{asset} 가격</span>
                <span className="font-mono">
                    ${asset === 'XRP' 
                        ? pricePayload.value.toFixed(3)
                        : pricePayload.value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})
                    }
                </span>
            </p>
         )}
      </div>
    );
  }
  return null;
};

const chartAssets = ['BTC', 'ETH', 'XRP', 'SOL'];

const SingleAssetChartView = ({asset}: {asset: string}) => {
    const [timeframe, setTimeframe] = useState<Timeframe>('1M');
    const [chartData, setChartData] = useState<any[] | null>(null);
    const color = assetColors[asset as keyof typeof assetColors];

    useEffect(() => {
        setChartData(null);
        const timer = setTimeout(() => {
            setChartData(generateChartData(timeframe, asset));
        }, 300);
        return () => clearTimeout(timer);
    }, [timeframe, asset]);

    const isFlowView = timeframe === '1W' || timeframe === '1M';
    const totalFlow = chartData ? (isFlowView 
        ? chartData.reduce((sum, item) => sum + (item[asset as keyof typeof item] as number), 0)
        : (chartData[chartData.length - 1]?.[asset as keyof typeof chartData[0]] as number) || 0) : 0;

    const timeframeLabel = timeframe === '1W' ? '주간' : timeframe === '1M' ? '월간' : timeframe === '1Y' ? '연간' : '전체';
    const flowType = totalFlow > 0 ? '유입' : '유출';
    const absFlow = Math.abs(totalFlow);

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">{asset} 현물 ETF 흐름</CardTitle>
                    <div className="flex items-center gap-3">
                        <div className={`font-mono text-sm font-semibold ${
                            totalFlow > 0 ? 'text-red-500' : 'text-blue-500'
                        }`}>
                            {timeframeLabel} {totalFlow >= 0 ? '' : '-'}{formatKoreanNumber(absFlow)} {flowType}
                        </div>
                        <div className="flex gap-1 rounded-md bg-muted/50 p-0.5">
                            {(['1W', '1M', '1Y', 'All'] as Timeframe[]).map((tf) => (
                                <Button
                                key={tf}
                                size="sm"
                                variant={timeframe === tf ? 'secondary' : 'ghost'}
                                onClick={() => setTimeframe(tf)}
                                className="h-6 px-2 text-xs rounded-sm"
                                >
                                {tf}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {chartData ? (
                    <div className='h-64 w-full font-sans text-xs relative select-none px-2'>
                        <div className="absolute top-0 left-2 text-muted-foreground font-semibold z-10 text-xs">순유입</div>
                        <div className="absolute top-0 right-2 text-foreground font-semibold flex items-center justify-end gap-1.5 z-10 text-xs">
                            <div className="w-2.5 h-0.5 rounded-full bg-yellow-500"></div>
                            {asset} 가격
                        </div>

                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border)/0.5)" />
                            <XAxis 
                                dataKey="date" 
                                stroke="hsl(var(--muted-foreground))" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                tickMargin={8} 
                                minTickGap={30}
                                padding={{ left: 10, right: 10 }}
                            />
                            <YAxis 
                                yAxisId="left"
                                stroke="hsl(var(--muted-foreground))" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                width={40}
                                tickFormatter={(val) => {
                                    if (val === 0) return '0';
                                    if (Math.abs(val) >= 1000) return `${(val / 1000).toFixed(0)}조`;
                                    return `${val}억`;
                                }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={50}
                                domain={asset === 'XRP' 
                                    ? ['dataMin - 0.01', 'dataMax + 0.01']
                                    : asset === 'BTC'
                                    ? ['dataMin - 1000', 'dataMax + 1000']
                                    : ['dataMin - 50', 'dataMax + 50']
                                }
                                tickFormatter={(val) => {
                                    if (asset === 'XRP') {
                                        return `$${val.toFixed(3)}`;
                                    }
                                    if (asset === 'BTC') {
                                        return `$${(val / 1000).toFixed(0)}k`;
                                    }
                                    // ETH, SOL 등은 그냥 달러로 표시
                                    return `$${val.toFixed(0)}`;
                                }}
                            />
                            <RechartsTooltip content={<CustomTooltip asset={asset} />} cursor={{ fill: 'hsl(var(--accent)/0.1)' }} />
                            
                            <Bar 
                                yAxisId="left"
                                dataKey={asset} 
                                radius={[2,2,0,0]}
                                barSize={18}
                            >
                                {chartData.map((entry, index) => {
                                    const value = entry[asset as keyof typeof entry] as number;
                                    const fillColor = value >= 0 ? '#22C55E' : '#EF4444'; // 초록색(유입) / 빨간색(유출)
                                    return <Cell key={`cell-${index}`} fill={fillColor} />;
                                })}
                            </Bar>
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey={`${asset}_Price`}
                                stroke="#FFD700"
                                strokeWidth={2}
                                dot={false}
                            />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <Skeleton className="h-64 w-full" />
                )}
            </CardContent>
        </Card>
    )
}

const ListView = ({activeAsset}: {activeAsset: string}) => {
    const renderTable = () => {
        switch(activeAsset) {
        case 'btc':
            return <EtfTable data={btcEtfData} totalAUM={totalBtcAUM} assetName="BTC" />;
        case 'eth':
            return <EtfTable data={ethEtfData} totalAUM={totalEthAUM} assetName="ETH" />;
        case 'sol':
            return <EtfTable data={solEtfData} totalAUM={totalSolAUM} assetName="SOL" />;
        case 'xrp':
            return <EtfTable data={xrpEtfData} totalAUM={totalXrpAUM} assetName="XRP" />;
        default:
            return null;
        }
    }
    return (
        <div className="h-full">
            {renderTable()}
        </div>
    );
}

export function EtfFlowTracker() {
  const [isTableOpen, setIsTableOpen] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');

  return (
    <div className="w-full max-w-full space-y-6">
        {/* 4개의 차트를 세로로 배치 */}
        <div className="space-y-6">
            {chartAssets.map((asset) => (
                <SingleAssetChartView 
                    key={asset}
                    asset={asset}
                />
            ))}
        </div>

        {/* 테이블 섹션 */}
        <Collapsible open={isTableOpen} onOpenChange={setIsTableOpen}>
            <CollapsibleTrigger asChild>
                <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-between"
                >
                    <span className="text-sm font-medium">ETF 상세 정보 보기</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isTableOpen ? 'rotate-180' : ''}`} />
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="min-h-[200px] pt-4">
                    <div className="flex items-center gap-4 mb-4">
                        {chartAssets.map((asset) => (
                            <button
                                key={asset}
                                onClick={() => setSelectedAsset(asset)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                                    selectedAsset === asset
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                            >
                                {asset}
                            </button>
                        ))}
                    </div>
                    <ListView activeAsset={selectedAsset.toLowerCase()} />
                </div>
            </CollapsibleContent>
        </Collapsible>
    </div>
  );
}
