'use client';

import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';


const deepDiveData = {
  BTC: {
    internalCirculation: '21,345 BTC',
    internalCirculationValue: '2조 1,345억원',
    circulationChange: 0.15,
    netDeposit24h: '120억원',
    holderCount: '1,234,567명',
    tradingVolume: '1.2조원',
    whaleHoldingRatio: 18,
    whaleTradingRatio: 35,
    buyOrderPressure: 62,
    sellOrderPressure: 38,
    tradingVolumeRank: 1,
    holderChange: '+1,234명',
    netDepositRank: 3,
    holderRank: 2,
    quarterlyReview: [
        { year: 2026, q1: -10.75, q2: -67.34, q3: 23.47, q4: null },
        { year: 2025, q1: 160.7, q2: 18.53, q3: 31.86, q4: 22.59 },
        { year: 2024, q1: 3.02, q2: 69.62, q3: 59.5, q4: 104.15 },
        { year: 2023, q1: 5.72, q2: 102.25, q3: -37.43, q4: -28.9 },
        { year: 2022, q1: -46.61, q2: 15.29, q3: -48.69, q4: -41.62 },
        { year: 2021, q1: 518.14, q2: 453.71, q3: 9.87, q4: 142.81 },
        { year: 2020, q1: 10.58, q2: 8.95, q3: 6.51, q4: -39.47 },
    ]
  },
  ETH: {
    internalCirculation: '250,123 ETH',
    internalCirculationValue: '1조 2,506억원',
    circulationChange: -0.05,
    netDeposit24h: '-80억원',
    holderCount: '987,654명',
    tradingVolume: '8,500억원',
    whaleHoldingRatio: 12,
    whaleTradingRatio: 28,
    buyOrderPressure: 55,
    sellOrderPressure: 45,
    tradingVolumeRank: 2,
    holderChange: '+876명',
    netDepositRank: 12,
    holderRank: 3,
     quarterlyReview: [
        { year: 2026, q1: -12.5, q2: -70.1, q3: 30.2, q4: -5.1 },
        { year: 2025, q1: 159.3, q2: 72.8, q3: 35.7, q4: 20.3 },
        { year: 2024, q1: -11.9, q2: 78.4, q3: 56.4, q4: 108.2 },
        { year: 2023, q1: 4.8, q2: 110.1, q3: -39.2, q4: -20.1 },
    ]
  },
  SOL: {
    internalCirculation: '5,123,456 SOL',
    internalCirculationValue: '1조 1,783억원',
    circulationChange: 0.8,
    netDeposit24h: '550억원',
    holderCount: '456,789명',
    tradingVolume: '6,200억원',
    whaleHoldingRatio: 25,
    whaleTradingRatio: 42,
    buyOrderPressure: 48,
    sellOrderPressure: 52,
    tradingVolumeRank: 4,
    holderChange: '+2,345명',
    netDepositRank: 1,
    holderRank: 5,
     quarterlyReview: [
        { year: 2026, q1: -30.2, q2: -80.5, q3: 10.5, q4: -60.2 },
        { year: 2025, q1: 1800, q2: 10.2, q3: 400.1, q4: 30.5 },
    ]
  },
  XRP: {
    internalCirculation: '1,234,567,890 XRP',
    internalCirculationValue: '8,642억원',
    circulationChange: -0.2,
    netDeposit24h: '-150억원',
    holderCount: '1,567,890명',
    tradingVolume: '3,100억원',
    whaleHoldingRatio: 32,
    whaleTradingRatio: 55,
    buyOrderPressure: 70,
    sellOrderPressure: 30,
    tradingVolumeRank: 5,
    holderChange: '-567명',
    netDepositRank: 15,
    holderRank: 1,
     quarterlyReview: [
        { year: 2026, q1: -5.2, q2: -55.8, q3: 45.1, q4: -2.3 },
        { year: 2025, q1: 200.1, q2: 25.3, q3: -10.8, q4: 25.1 },
        { year: 2024, q1: -15.4, q2: -5.2, q3: 40.1, q4: 150.9 },
    ]
  },
  DOGE: {
    internalCirculation: '25,123,456,789 DOGE',
    internalCirculationValue: '5,275억원',
    circulationChange: 0.3,
    netDeposit24h: '30억원',
    holderCount: '876,543명',
    tradingVolume: '1,500억원',
    whaleHoldingRatio: 40,
    whaleTradingRatio: 60,
    buyOrderPressure: 65,
    sellOrderPressure: 35,
    tradingVolumeRank: 8,
    holderChange: '+1,012명',
    netDepositRank: 7,
    holderRank: 4,
     quarterlyReview: [
        { year: 2025, q1: 500.1, q2: 450.2, q3: -20.3, q4: 10.2 },
        { year: 2024, q1: 1.2, q2: 5.3, q3: 2.1, q4: 10.8 },
    ]
  }
};

type AssetTicker = keyof typeof deepDiveData;

const getInfluenceLevel = (holding: number, trading: number) => {
    const score = holding * 0.4 + trading * 0.6; // 가중치 부여
    if (score > 50) return { text: "매우 높음", color: "text-red-500" };
    if (score > 35) return { text: "높음", color: "text-orange-500" };
    if (score > 20) return { text: "보통", color: "text-yellow-500" };
    return { text: "낮음", color: "text-gray-500" };
}


const WhaleInfluenceChart = ({
  holding,
  trading,
}: {
  holding: number;
  trading: number;
}) => {
  const holdingData = [
    { name: '고래 보유 비중', value: holding },
    { name: '기타', value: 100 - holding },
  ];
  const tradingData = [
    { name: '고래 거래 비중', value: trading },
    { name: '기타', value: 100 - trading },
  ];
  const COLORS = ['#F56565', 'hsl(var(--muted))'];
  const COLORS2 = ['#4299E1', 'hsl(var(--muted))'];

  const influence = getInfluenceLevel(holding, trading);

  return (
    <div className="relative h-48 w-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
           <RechartsTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length && payload[0].name !== '기타') {
                return (
                  <div className="bg-background/80 backdrop-blur-sm p-2 border rounded-lg text-xs shadow-lg">
                    <p className="font-bold">{`${payload[0].name}: ${payload[0].value}%`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Pie
            data={holdingData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={65}
            startAngle={90}
            endAngle={-270}
            isAnimationActive={true}
          >
             {holdingData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Pie
            data={tradingData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={60}
            innerRadius={45}
            startAngle={90}
            endAngle={-270}
            isAnimationActive={true}
          >
             {tradingData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} stroke={COLORS2[index % COLORS2.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xs text-muted-foreground">영향도</span>
        <span className={`text-xl font-bold ${influence.color}`}>{influence.text}</span>
      </div>
    </div>
  );
};

interface AssetDeepDiveProps {
  asset: {
    rank: number;
    ticker: string;
    name: string;
    img: string;
    marketCap: string;
    marketCapDominance: string;
    athPrice: string;
    athDate: string;
    circulatingSupply: string;
    supplyRatio: number;
  };
}

const OrderBookPressure = ({ buy, sell }: { buy: number, sell: number }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="font-bold text-md mb-1">실시간 오더북 현황</h4>
        <p className="text-xs text-muted-foreground mb-4">현재 호가창에 걸려있는 매수/매도 대기 물량의 강도를 비교합니다.</p>
        
        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 text-right">
            <div className="text-sm font-bold text-green-500">매수 잔량 {buy}%</div>
          </div>
          <div className="w-8 text-center text-muted-foreground font-black text-sm">VS</div>
          <div className="flex-1 text-left">
            <div className="text-sm font-bold text-red-500">매도 잔량 {sell}%</div>
          </div>
        </div>

        <div className="flex w-full h-3 rounded-full overflow-hidden bg-muted">
            <div className="bg-green-500 h-full" style={{ width: `${buy}%` }}></div>
            <div className="bg-red-500 h-full" style={{ width: `${sell}%` }}></div>
        </div>
      </CardContent>
    </Card>
  )
}

const QuarterlyReview = ({ data }: { data?: { year: number, q1: number | null, q2: number | null, q3: number | null, q4: number | null }[] }) => {
  
  if (!data || data.length === 0) {
    return null;
  }
  
  const currentYear = 2026;
  const yearsToShow = data.map(d => ({...d, year: d.year + (currentYear - d.year > 5 ? 2 : 0) })).filter(d => d.year <= currentYear).sort((a,b) => b.year - a.year);
  
  return (
    <div>
        <h4 className="font-bold text-lg mb-4">분기별 수익률</h4>
        <div className="text-sm text-foreground">
          <div className="grid grid-cols-5 gap-2 text-center font-semibold text-muted-foreground">
            <div className="pb-2 text-left">연도</div>
            <div className="pb-2">1분기</div>
            <div className="pb-2">2분기</div>
            <div className="pb-2">3분기</div>
            <div className="pb-2">4분기</div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {yearsToShow.map(row => (
              <div key={row.year} className="grid grid-cols-5 gap-2 text-center font-mono">
                <div className="p-3 font-semibold text-foreground text-left">{row.year}</div>
                {[row.q1, row.q2, row.q3, row.q4].map((quarter, i) => (
                  <div key={i} className={cn(
                    "p-3 rounded-md",
                    quarter === null || quarter === undefined ? 'bg-muted/30 text-muted-foreground' :
                    quarter > 0 ? 'bg-green-500/10 text-green-600 font-bold' : 'bg-red-500/10 text-red-500 font-bold'
                  )}>
                    {quarter !== null && quarter !== undefined ? `${quarter.toFixed(2)}%` : '-'}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}


export function AssetDeepDive({ asset }: AssetDeepDiveProps) {
  const data = deepDiveData[asset.ticker as AssetTicker] || deepDiveData.BTC;
  
  const parsePrice = (price: string) => parseFloat(price.replace(/[^0-9.-]+/g,""));
  const athPriceNum = parsePrice(asset.athPrice);
  const currentPriceNum = athPriceNum * (1 - (Math.random() * 0.9)); 
  const dropFromATH = ((currentPriceNum - athPriceNum) / athPriceNum) * 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={asset.img} />
                <AvatarFallback>{asset.ticker.charAt(0)}</AvatarFallback>
              </Avatar>
              {asset.name} 상세 데이터
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
                빗썸 내부 데이터를 통해 각 자산의 현재 상태를 깊이있게 들여다보고 투자
                기회를 포착하세요.
            </p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
                <Card className="h-full">
                    <CardContent className="p-4 text-center h-full flex flex-col">
                        <p className="text-sm text-muted-foreground">시가총액 (도미넌스)</p>
                        <p className="text-xl font-bold mt-1">{asset.marketCap}</p>
                        <p className="text-sm text-primary font-semibold mt-auto">{asset.rank}위 ({asset.marketCapDominance})</p>
                    </CardContent>
                </Card>
                <Card className="h-full">
                    <CardContent className="p-4 text-center h-full flex flex-col">
                        <p className="text-sm text-muted-foreground">역사적 최고가 (ATH)</p>
                        <p className="text-xl font-bold mt-1">{asset.athPrice}</p>
                        <p className="text-sm text-muted-foreground mt-auto">{asset.athDate}</p>
                    </CardContent>
                </Card>
                 <Card className="h-full">
                    <CardContent className="p-4 text-center h-full flex flex-col">
                        <p className="text-sm text-muted-foreground">고점 대비 하락률</p>
                        <p className="text-xl font-bold mt-1 text-blue-500">{dropFromATH.toFixed(2)}%</p>
                        <p className="text-sm text-muted-foreground mt-auto">현재가: {currentPriceNum.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}</p>
                    </CardContent>
                </Card>
                <Card className="border hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-4 h-full flex flex-col">
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                      상위 100명 보유비중
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-3 h-3 cursor-help text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-xs">
                              상위 100명이 전체 유통량에서 차지하는 비율입니다.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </p>
                    <p className="text-2xl font-bold">{data.whaleHoldingRatio}%</p>
                    <div className="mt-auto pt-2">
                      <Progress value={data.whaleHoldingRatio} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
                <Card className="border hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-4 text-center h-full flex flex-col">
                    <p className="text-sm text-muted-foreground">총 보유자 수</p>
                    <p className="text-2xl font-bold mt-1">{data.holderCount}</p>
                    <p className="text-sm text-muted-foreground mt-auto">빗썸 내 보유자 수 {data.holderRank}위</p>
                  </CardContent>
                </Card>
                
                <Card className="border hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-4 text-center h-full flex flex-col">
                    <p className="text-sm text-muted-foreground">최근 24시간 거래대금</p>
                    <p className="text-xl font-bold mt-1">{data.tradingVolume}</p>
                    <p className="text-sm text-muted-foreground mt-auto">빗썸 내 거래대금 {data.tradingVolumeRank}위</p>
                  </CardContent>
                </Card>
                
                <Card className="border hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-4 text-center h-full flex flex-col">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      순입금액(24H)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-3 h-3 cursor-help text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-xs">
                              24시간 동안 입금액에서 출금액을 뺀 값입니다.
                              <br />
                              양수(+)는 잠재적 매수 압력을 의미할 수 있습니다.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </p>
                    <p className={`text-xl font-bold mt-1 ${data.netDeposit24h.startsWith('-') ? 'text-blue-500' : 'text-red-500'}`}>
                      {data.netDeposit24h}
                    </p>
                    <p className="text-sm text-muted-foreground mt-auto">빗썸 내 순입금액 {data.netDepositRank}위</p>
                  </CardContent>
                </Card>
                
                <Card className="border hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-4 h-full flex flex-col">
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                      상위 100명 거래비중
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-3 h-3 cursor-help text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-xs">
                              상위 100명의 거래대금이 전체에서 차지하는 비율입니다.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </p>
                    <p className="text-2xl font-bold">{data.whaleTradingRatio}%</p>
                    <div className="mt-auto pt-2">
                      <Progress value={data.whaleTradingRatio} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
              <div className="lg:col-span-3">
                <OrderBookPressure buy={data.buyOrderPressure} sell={data.sellOrderPressure} />
              </div>
              <Card className="border hover:shadow-md transition-shadow h-full">
                <CardContent className="p-4 text-center h-full flex flex-col">
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    유통량
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3 h-3 cursor-help text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-xs">
                            현재 시장에 유통되고 있는 전체 공급량입니다.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </p>
                  <p className="text-xl font-bold mt-1">{asset.circulatingSupply}</p>
                  <p className="text-sm text-muted-foreground">전체 공급량 대비 {asset.supplyRatio.toFixed(1)}%</p>
                  <div className="mt-auto pt-2">
                    <Progress value={asset.supplyRatio} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
        <QuarterlyReview data={data.quarterlyReview} />
      </div>
    </div>
  );
}
