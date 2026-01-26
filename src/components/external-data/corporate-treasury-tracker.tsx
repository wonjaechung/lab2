'use client';
import { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '../ui/button';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type Timeframe = '1M' | '1Y' | 'All';

const btcTreasuryData = [
    { rank: 1, ticker: 'MSTR', name: 'MicroStrategy', holdings: 660624, monthlyChange: 1500, supplyPercent: 3.146, img: 'https://g.twimg.com/Twitter_logo_blue.png' },
    { rank: 2, ticker: 'MARA', name: 'Marathon Digital Holdings', holdings: 53250, monthlyChange: 0, supplyPercent: 0.254, img: 'https://g.twimg.com/Twitter_logo_blue.png' },
    { rank: 3, ticker: 'XXI', name: 'Twenty One Capital', holdings: 43514, monthlyChange: -120, supplyPercent: 0.207, img: 'https://g.twimg.com/Twitter_logo_blue.png' },
    { rank: 4, ticker: 'MTPLF', name: 'Metaplanet Inc.', holdings: 30823, monthlyChange: 500, supplyPercent: 0.147, img: 'https://g.twimg.com/Twitter_logo_blue.png' },
    { rank: 5, ticker: 'CEPO', name: 'Bitcoin Standard Treasury', holdings: 30021, monthlyChange: 0, supplyPercent: 0.143, img: 'https://g.twimg.com/Twitter_logo_blue.png' },
    { rank: 6, ticker: 'BLSH', name: 'Bullish', holdings: 24300, monthlyChange: 0, supplyPercent: 0.116, img: 'https://g.twimg.com/Twitter_logo_blue.png' },
    { rank: 7, ticker: 'RIOT', name: 'Riot Platforms, Inc.', holdings: 19324, monthlyChange: -50, supplyPercent: 0.092, img: 'https://g.twimg.com/Twitter_logo_blue.png' },
    { rank: 8, ticker: 'COIN', name: 'Coinbase Global, Inc.', holdings: 14548, monthlyChange: 120, supplyPercent: 0.069, img: 'https://g.twimg.com/Twitter_logo_blue.png' },
];

const ethTreasuryData = [
    { rank: 1, ticker: 'ETC', name: 'Ethereum Foundation', holdings: 354311, monthlyChange: 0, supplyPercent: 0.295, img: 'https://g.twimg.com/Twitter_logo_blue.png' },
];


const totalBtcHoldings = btcTreasuryData.reduce((sum, company) => sum + company.holdings, 0);
const totalEthHoldings = ethTreasuryData.reduce((sum, company) => sum + company.holdings, 0);

const assetColors: { [key: string]: string } = {
  btc: '#F7931A',
  eth: '#627EEA',
  BTC: '#F7931A',
  ETH: '#627EEA',
  BTC_Price: '#22C55E',
};

const formatNumber = (value: number) => {
    return value.toLocaleString('en-US');
}

const TreasuryTable = ({ data, assetName }: { data: {rank: number, ticker: string, name: string, holdings: number, monthlyChange: number, supplyPercent: number, img: string}[], assetName: string }) => {
    return (
    <div className="h-full overflow-hidden">
        <div className="overflow-x-auto">
        <div className="w-full">
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs h-8 whitespace-nowrap">회사명</TableHead>
                <TableHead className="text-right text-xs h-8 whitespace-nowrap">보유량</TableHead>
                <TableHead className="text-right text-xs h-8 whitespace-nowrap">월간 변동</TableHead>
                <TableHead className="text-right text-xs h-8 whitespace-nowrap">공급량 %</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((company) => {
                    
                    return (
                    <TableRow key={company.name} className="h-9 hover:bg-muted/30">
                        <TableCell className="py-1">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={company.img} alt={company.name} />
                                    <AvatarFallback>{company.ticker.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-bold text-sm">{company.name}</div>
                                    <div className="text-xs text-muted-foreground">{company.ticker}</div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs py-1 text-foreground whitespace-nowrap">
                            {formatNumber(company.holdings)} {assetName.toUpperCase()}
                        </TableCell>
                        <TableCell className="text-right py-1 whitespace-nowrap">
                            <div className={`font-mono text-xs ${company.monthlyChange >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                {company.monthlyChange >= 0 ? '+' : ''}{formatNumber(company.monthlyChange)}
                            </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs py-1 text-muted-foreground whitespace-nowrap">
                            {company.supplyPercent.toFixed(3)}%
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

const generateChartData = (timeframe: Timeframe) => {
  let days = 30;
  if (timeframe === '1M') days = 30;
  if (timeframe === '1Y') days = 365;
  if (timeframe === 'All') days = 500;
  
  const data = [];
  let btcPrice = 65000;
  let accumulatedHoldings = { BTC: 200000, ETH: 350000 };

  for (let i = days -1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    btcPrice += (Math.random() - 0.5) * 2000;

    const btcFlow = (Math.random() - 0.48) * 1000;
    const ethFlow = (Math.random() - 0.49) * 500;

    accumulatedHoldings.BTC += btcFlow;
    accumulatedHoldings.ETH += ethFlow;

    data.push({
        date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
        BTC: Math.floor(accumulatedHoldings.BTC),
        ETH: Math.floor(accumulatedHoldings.ETH),
        BTC_Price: btcPrice,
    });
  }
  return data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const flowPayload = payload.filter((p: any) => p.dataKey !== 'BTC_Price');
    const pricePayload = payload.find((p: any) => p.dataKey === 'BTC_Price');

    return (
      <div className="bg-background/90 backdrop-blur-sm p-3 border rounded-lg shadow-xl text-xs z-50">
        <p className="font-bold mb-1">{label}</p>
        {flowPayload.map((p: any) => (
            <p key={p.dataKey} className="flex justify-between gap-4" style={{ color: p.color }}>
                <span>{p.dataKey} 보유량</span>
                <span className="font-mono">{formatNumber(p.value)}</span>
            </p>
        ))}
         {pricePayload && (
            <p className="flex justify-between gap-4 mt-1" style={{ color: pricePayload.color }}>
                <span>BTC 가격</span>
                <span className="font-mono">${pricePayload.value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
            </p>
         )}
      </div>
    );
  }
  return null;
};

const chartAssets = ['BTC', 'ETH'];

const ChartView = ({timeframe, activeAssets, chartData}: {timeframe: Timeframe, activeAssets: string[], chartData: any[]}) => {
    return (
        <div className='h-full w-full font-sans text-xs relative select-none px-2'>
            <div className="absolute top-0 left-2 text-muted-foreground font-semibold z-10 text-xs">총 보유량</div>
            <div className="absolute top-0 right-2 text-foreground font-semibold flex items-center justify-end gap-1.5 z-10 text-xs">
                <div className="w-2.5 h-0.5 bg-green-500 rounded-full"></div>
                BTC 가격
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
                        width={50}
                        tickFormatter={(val) => {
                            if (val === 0) return '0';
                            return `${(val / 1000).toFixed(0)}k`;
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
                        domain={['dataMin - 1000', 'dataMax + 1000']}
                        tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                    />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent)/0.1)' }} />
                    
                    {activeAssets.map((asset, index) => (
                         <Bar 
                            key={asset} 
                            yAxisId="left"
                            dataKey={asset} 
                            stackId="a"
                            fill={assetColors[asset as keyof typeof assetColors]} 
                            radius={activeAssets.length === 1 || index === activeAssets.length -1 ? [2,2,0,0] : [0,0,0,0]}
                            barSize={18}
                        />
                    ))}
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="BTC_Price"
                        stroke={assetColors['BTC_Price']}
                        strokeWidth={2}
                        dot={false}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    )
}

const ListView = ({activeAsset}: {activeAsset: string}) => {
    const renderTable = () => {
        switch(activeAsset) {
        case 'btc':
            return <TreasuryTable data={btcTreasuryData} assetName="BTC" />;
        case 'eth':
            return <TreasuryTable data={ethTreasuryData} assetName="ETH" />;
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

export function CorporateTreasuryTracker() {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [activeAsset, setActiveAsset] = useState<string>('BTC');
  const [chartData, setChartData] = useState<any[] | null>(null);

  useEffect(() => {
    setChartData(null); // Set to null to show skeleton
    const timer = setTimeout(() => {
        setChartData(generateChartData(timeframe));
    }, 300); // Simulate network delay
    return () => clearTimeout(timer);
  }, [timeframe]);


  const renderTopLegend = () => {
      if (!chartData) {
        return (
          <div className="flex items-center gap-4 text-sm min-w-max px-1">
             {chartAssets.map(asset => (
                <div key={asset} className="flex items-center gap-1.5">
                   <Skeleton className="w-2.5 h-2.5 rounded-full" />
                   <Skeleton className="h-4 w-16" />
                </div>
             ))}
          </div>
        )
      }

      const totalFlows = chartAssets.reduce((acc, asset) => {
         const lastItem = chartData[chartData.length - 1];
         acc[asset] = lastItem ? (lastItem[asset as keyof typeof lastItem] as number) : 0;
         return acc;
      }, {} as {[key: string]: number});

      return (
        <div className="flex items-center gap-4 text-sm min-w-max px-1">
          {chartAssets.map(asset => {
            const total = totalFlows[asset];
            const isActive = activeAsset === asset;
            const color = assetColors[asset as keyof typeof assetColors];
            
            return (
              <button
                key={asset}
                onClick={() => setActiveAsset(asset)}
                className={`flex items-center gap-1.5 cursor-pointer transition-all ${!isActive ? 'opacity-50 hover:opacity-100' : ''}`}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className={`font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{asset}</span>
                <span className={`font-mono text-foreground`}>
                    {formatNumber(total)}
                </span>
              </button>
            )
          })}
        </div>
      )
  }

  return (
    <Card className="border-none shadow-none bg-transparent w-full max-w-full overflow-hidden">
        <CardHeader className="px-0 pt-0 pb-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">기업 보유 현황</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        주요 상장 기업들의 가상자산 보유 현황을 실시간으로 추적합니다
                    </p>
                </div>
                <div className="flex gap-1 rounded-md bg-muted/50 p-0.5">
                    {(['1M', '1Y', 'All'] as Timeframe[]).map((tf) => (
                        <Button
                        key={tf}
                        size="sm"
                        variant={timeframe === tf ? 'secondary' : 'ghost'}
                        onClick={() => setTimeframe(tf)}
                        className="h-7 px-3 text-xs rounded-sm"
                        >
                        {tf}
                        </Button>
                    ))}
                </div>
            </div>
            
            <div className="w-full overflow-x-auto scrollbar-hide pb-1">
                {renderTopLegend()}
            </div>
        </CardHeader>
        
        <CardContent className="p-0">
        
        <div className="h-72 w-full mb-6">
            {chartData ? (
                <ChartView 
                    timeframe={timeframe} 
                    activeAssets={[activeAsset]} 
                    chartData={chartData}
                />
            ) : (
                <Skeleton className="h-full w-full" />
            )}
        </div>

        <div className="h-px w-full bg-border/50 mb-4"></div>
        
        <div className="min-h-[200px]">
            <ListView activeAsset={activeAsset.toLowerCase()} />
        </div>
        </CardContent>
    </Card>
  );
}
