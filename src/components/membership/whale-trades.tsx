'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowDown, ArrowUp, Crown, Fish, TrendingDown, TrendingUp, Percent, BarChart, GitCompare, Zap, Sparkles, Shield, User, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserAssetDistributionChart } from '../internal-data/user-asset-distribution-chart';

const Flame = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.072-2-3.83-2-5a2.5 2.5 0 0 0-5 0c0 1.17 1 3 2 5 .5 1 1 1.62 1 3a2.5 2.5 0 0 0 2.5 2.5z"/><path d="M14.5 18.5a2.5 2.5 0 0 0 2.5-2.5c0-1.38-.5-2-1-3-1.072-2.072-2-3.83-2-5a2.5 2.5 0 0 0-5 0c0 1.17 1 3 2 5 .5 1 1 1.62 1 3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
);


const whaleData = {
  topBuys: [
    { rank: 1, name: '모네로', ticker: 'XMR', strength: 450, img: 'https://cryptologos.cc/logos/monero-xmr-logo.svg?v=032' },
    { rank: 2, name: '지캐시', ticker: 'ZEC', strength: 410, img: 'https://cryptologos.cc/logos/zcash-zec-logo.svg?v=032' },
    { rank: 3, name: '아비트럼', ticker: 'ARB', strength: 250, img: 'https://cryptologos.cc/logos/arbitrum-arb-logo.svg?v=032' },
    { rank: 4, name: '대시', ticker: 'DASH', strength: 200, img: 'https://cryptologos.cc/logos/dash-dash-logo.svg?v=032' },
    { rank: 5, name: '월드코인', ticker: 'WLD', strength: 180, img: 'https://cryptologos.cc/logos/worldcoin-org-wld-logo.svg?v=032' },
  ],
  topSells: [
    { rank: 1, name: '리플', ticker: 'XRP', strength: 410, img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032' },
    { rank: 2, name: '솔라나', ticker: 'SOL', strength: 350, img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032' },
    { rank: 3, name: '수이', ticker: 'SUI', strength: 290, img: 'https://cryptologos.cc/logos/sui-sui-logo.svg?v=032' },
    { rank: 4, name: '앱토스', ticker: 'APT', strength: 260, img: 'https://cryptologos.cc/logos/aptos-apt-logo.svg?v=032' },
    { rank: 5, name: '도지코인', ticker: 'DOGE', strength: 220, img: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=032' },
  ],
  unrealizedPnl: [
    { rank: 1, name: '비트코인', ticker: 'BTC', value: 1234, profitRatio: 98, img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032' },
    { rank: 2, name: '월드코인', ticker: 'WLD', value: 876, profitRatio: 65, img: 'https://cryptologos.cc/logos/worldcoin-org-wld-logo.svg?v=032' },
    { rank: 3, name: '이더리움', ticker: 'ETH', value: 543, profitRatio: 82, img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032' },
    { rank: 4, name: '솔라나', ticker: 'SOL', value: 321, profitRatio: 74, img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032' },
    { rank: 5, name: '리플', ticker: 'XRP', value: 123, profitRatio: 32, img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032' },
  ],
  whaleInfluence: [
    { rank: 1, name: '도지코인', ticker: 'DOGE', holdingRatio: 40, tradingRatio: 60, img: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=032' },
    { rank: 2, name: '리플', ticker: 'XRP', holdingRatio: 32, tradingRatio: 55, img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032' },
    { rank: 3, name: '월드코인', ticker: 'WLD', holdingRatio: 8, tradingRatio: 18, img: 'https://cryptologos.cc/logos/worldcoin-org-wld-logo.svg?v=032' },
    { rank: 4, name: '페페', ticker: 'PEPE', holdingRatio: 35, tradingRatio: 45, img: 'https://cryptologos.cc/logos/pepe-pepe-logo.svg?v=032' },
    { rank: 5, name: '비트코인', ticker: 'BTC', holdingRatio: 18, tradingRatio: 35, img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032' },
  ],
  topWhaleBuys: [
    { rank: 1, name: '이더리움', ticker: 'ETH', price: '4,880,000원', change: -1.2, img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032' },
    { rank: 2, name: '비트코인', ticker: 'BTC', price: '98,179,000원', change: 0.18, img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032' },
    { rank: 3, name: '솔라나', ticker: 'SOL', price: '231,050원', change: 2.5, img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032' },
    { rank: 4, name: '리플', ticker: 'XRP', price: '705원', change: -0.5, img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032' },
    { rank: 5, name: '월드코인', ticker: 'WLD', price: '6,200원', change: 12.4, img: 'https://cryptologos.cc/logos/worldcoin-org-wld-logo.svg?v=032' },
  ],
  topTraderBuys: [
    { rank: 1, name: '페페', ticker: 'PEPE', price: '0.017원', change: 15.8, img: 'https://cryptologos.cc/logos/pepe-pepe-logo.svg?v=032' },
    { rank: 2, name: '도지코인', ticker: 'DOGE', price: '215원', change: 3.5, img: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=032' },
    { rank: 3, name: '시바이누', ticker: 'SHIB', price: '0.035원', change: 4.5, img: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.svg?v=032' },
    { rank: 4, name: '이더리움', ticker: 'ETH', price: '4,880,000원', change: -1.2, img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032' },
    { rank: 5, name: '비트코인', ticker: 'BTC', price: '98,179,000원', change: 0.18, img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032' },
  ],
  topVolatility: [
    { rank: 1, name: '페페', ticker: 'PEPE', value: 15.8, unit: '%', low: '0.015원', high: '0.019원', img: 'https://cryptologos.cc/logos/pepe-pepe-logo.svg?v=032' },
    { rank: 2, name: '월드코인', ticker: 'WLD', value: 12.4, unit: '%', low: '5,800원', high: '6,600원', img: 'https://cryptologos.cc/logos/worldcoin-org-wld-logo.svg?v=032' },
    { rank: 3, name: '도지코인', ticker: 'DOGE', value: 9.8, unit: '%', low: '205원', high: '225원', img: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=032' },
    { rank: 4, name: '솔라나', ticker: 'SOL', value: 8.2, unit: '%', low: '225,000원', high: '237,000원', img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032' },
    { rank: 5, name: '시바이누', ticker: 'SHIB', value: 7.5, unit: '%', low: '0.033원', high: '0.037원', img: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.svg?v=032' },
  ],
  topRvol: [
    { rank: 1, name: '월드코인', ticker: 'WLD', value: 3.8, unit: '배', img: 'https://cryptologos.cc/logos/worldcoin-org-wld-logo.svg?v=032' },
    { rank: 2, name: '페페', ticker: 'PEPE', value: 3.1, unit: '배', img: 'https://cryptologos.cc/logos/pepe-pepe-logo.svg?v=032' },
    { rank: 3, name: '아이콘', ticker: 'ICX', value: 2.2, unit: '배', img: 'https://cryptologos.cc/logos/icon-icx-logo.svg?v=032' },
    { rank: 4, name: '트론', ticker: 'TRX', value: 1.9, unit: '배', img: 'https://cryptologos.cc/logos/tron-trx-logo.svg?v=032' },
    { rank: 5, name: '헤데라', ticker: 'HBAR', value: 1.5, unit: '배', img: 'https://cryptologos.cc/logos/hedera-hbar-logo.svg?v=032' },
  ],
  priceDisparity: [
    { rank: 1, name: '수이', ticker: 'SUI', value: -12.5, unit: '%', img: 'https://cryptologos.cc/logos/sui-sui-logo.svg?v=032' },
    { rank: 2, name: '앱토스', ticker: 'APT', value: -9.8, unit: '%', img: 'https://cryptologos.cc/logos/aptos-apt-logo.svg?v=032' },
    { rank: 3, name: '리플', ticker: 'XRP', value: -5.2, unit: '%', img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032' },
    { rank: 4, name: '이더리움 클래식', ticker: 'ETC', value: 2.1, unit: '%', img: 'https://cryptologos.cc/logos/ethereum-classic-etc-logo.svg?v=032' },
    { rank: 5, name: '비트코인', ticker: 'BTC', value: 3.5, unit: '%', img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032' },
  ],
  netDeposit: [
    { rank: 1, name: '비트코인', ticker: 'BTC', strength: 250, img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032' },
    { rank: 2, name: '솔라나', ticker: 'SOL', strength: 210, img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032' },
    { rank: 3, name: '스택스', ticker: 'STX', strength: 180, img: 'https://cryptologos.cc/logos/stacks-stx-logo.svg?v=032' },
    { rank: 4, name: '수이', ticker: 'SUI', strength: 150, img: 'https://cryptologos.cc/logos/sui-sui-logo.svg?v=032' },
    { rank: 5, name: '리플', ticker: 'XRP', strength: 120, img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032' },
  ],
  beta: [
    { rank: 1, name: '이더리움 클래식', ticker: 'ETC', value: 1.58, unit: '배', img: 'https://cryptologos.cc/logos/ethereum-classic-etc-logo.svg?v=032' },
    { rank: 2, name: '비트코인캐시', ticker: 'BCH', value: 1.45, unit: '배', img: 'https://cryptologos.cc/logos/bitcoin-cash-bch-logo.svg?v=032' },
    { rank: 3, 'name': '이오스', 'ticker': 'EOS', value: 1.32, unit: '배', img: 'https://cryptologos.cc/logos/eos-eos-logo.svg?v=032' },
    { rank: 4, 'name': '퀀텀', 'ticker': 'QTUM', value: -1.28, unit: '배', img: 'https://cryptologos.cc/logos/qtum-qtum-logo.svg?v=032' },
    { rank: 5, 'name': '웨이브', 'ticker': 'WAVES', value: 1.25, unit: '배', img: 'https://cryptologos.cc/logos/waves-waves-logo.svg?v=032' },
  ]
};

type TradeListProps = {
  title: string;
  data: { rank: number; name: string; ticker: string; strength: number; img: string; }[];
  type: 'buy' | 'sell';
  description?: string;
};

const TradeList = ({ title, data, type, description }: TradeListProps) => {
  const isBuy = type === 'buy';
  const maxStrength = Math.max(...data.map(item => item.strength), 0);

  return (
    <Card className="flex-1 bg-card border h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {title}
            </CardTitle>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <Link href={isBuy ? "/internal-data?tab=comparison&filter=buysurge&multiplier=2.0&executionStrength=100" : "/internal-data?tab=comparison&filter=deposit&multiplier=1.5"} className="text-muted-foreground hover:text-foreground transition-colors mt-1">
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.rank} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-muted-foreground w-4 text-center">{item.rank}</span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.img} alt={item.name} />
                  <AvatarFallback>{item.ticker.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.ticker}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 w-2/5">
                <div className="w-full">
                    <Progress 
                        value={(item.strength / maxStrength) * 100} 
                        className="h-1.5 bg-muted/50"
                        indicatorClassName={isBuy ? "bg-green-500" : "bg-red-500"}
                    />
                    <div className="text-xs font-bold text-right mt-1 text-foreground">
                        <span className={cn("font-bold", isBuy ? "text-green-500" : "text-red-500")}>{(item.strength / 100).toFixed(1)}배</span>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const UnrealizedPnlList = ({ title, data, description }: { title: string; data: { rank: number; name: string; ticker: string; value: number; profitRatio: number; img: string }[]; description?: string }) => {
  return (
    <Card className="flex-1 bg-card border h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {title}
            </CardTitle>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          {title.includes('수익금') && (
            <Link href="/internal-data?tab=comparison&filter=profit&amount=100" className="text-muted-foreground hover:text-foreground transition-colors mt-1">
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => {
            const isPositive = item.value >= 0;
            return (
              <div key={item.rank} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-4 text-center">{item.rank}</span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={item.img} alt={item.name} />
                    <AvatarFallback>{item.ticker.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-sm">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.ticker}</div>
                  </div>
                </div>
                <div className="text-right">
                    <div className={cn("font-bold text-sm", isPositive ? 'text-red-500' : 'text-blue-500')}>
                        {isPositive ? '+' : ''}{item.value.toLocaleString()}억
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                        홀더 {item.profitRatio}% 수익중
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const InfluenceList = ({ title, data }: { title: string; data: { rank: number; name: string; ticker: string; holdingRatio: number; tradingRatio: number; img: string }[] }) => {
  const sortedData = [...data].sort((a, b) => b.holdingRatio - a.holdingRatio);
  
  return (
    <Card className="bg-card border h-full">
      <CardHeader>
        <CardTitle className="text-lg">
          {title}
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
            상위 100명의 보유 비중 합계입니다.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedData.map((item, index) => (
            <div key={item.ticker} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-muted-foreground w-4 text-center">{index + 1}</span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.img} alt={item.name} />
                  <AvatarFallback>{item.ticker.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.ticker}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 w-2/5">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-full">
                        <Progress
                          value={item.holdingRatio}
                          className="h-2 bg-muted/50"
                          indicatorClassName="bg-orange-500"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>최상위 회원 보유 비중: {item.holdingRatio}%</p>
                      <p>최상위 회원 거래 비중: {item.tradingRatio}%</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-sm font-bold text-foreground w-12 text-right">{item.holdingRatio}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const PriceDisparityList = ({ title, icon: Icon, data }: { title: string, icon: React.ElementType, data: any[] }) => (
    <Card className="bg-card border h-full">
        <CardHeader>
            <CardTitle className="text-lg">
                {title}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
                홀더들의 평균 단가와 현재 가격의 차이를 보여줍니다.
            </p>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {data.map((item) => {
                    const isLower = item.value < 0;
                    // 가상의 평단가 계산 (현재가가 평단가보다 value% 만큼 차이남)
                    // value = ((현재가 - 평단가) / 평단가) * 100
                    // 평단가 = 현재가 / (1 + value/100)
                    // 예시 데이터를 위해 임의의 현재가 설정 (실제 데이터 연동 시에는 prop으로 받아야 함)
                    const mockCurrentPrice = item.ticker === 'BTC' ? 98000000 : 
                                           item.ticker === 'ETH' ? 4800000 : 
                                           item.ticker === 'XRP' ? 800 :
                                           item.ticker === 'SUI' ? 2100 : 
                                           item.ticker === 'APT' ? 15000 : 1000;
                    
                    const avgPrice = Math.round(mockCurrentPrice / (1 + item.value / 100));

                    return (
                        <div key={item.rank} className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-muted-foreground w-4 text-center">{item.rank}</span>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={item.img} alt={item.name} />
                                    <AvatarFallback>{item.ticker.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="font-bold text-sm">{item.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        홀더 평균단가: {avgPrice.toLocaleString()}원
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={cn("font-bold text-sm", isLower ? "text-blue-500" : "text-red-500")}>
                                    {item.value > 0 ? '+' : ''}{item.value.toFixed(1)}%
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                    현재가 대비
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </CardContent>
    </Card>
);

const DepositVolumeList = ({ title, data, description }: { title: string; data: { rank: number; name: string; ticker: string; strength: number; img: string; }[]; description?: string }) => {
  const maxStrength = Math.max(...data.map(item => item.strength), 0);

  return (
    <Card className="flex-1 bg-card border h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {title}
            </CardTitle>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <Link href="/internal-data?tab=comparison&filter=deposit&multiplier=1.5" className="text-muted-foreground hover:text-foreground transition-colors mt-1">
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.rank} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-muted-foreground w-4 text-center">{item.rank}</span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.img} alt={item.name} />
                  <AvatarFallback>{item.ticker.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.ticker}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 w-2/5">
                <div className="w-full">
                    <Progress 
                        value={(item.strength / maxStrength) * 100} 
                        className="h-1.5 bg-muted/50"
                        indicatorClassName="bg-blue-500"
                    />
                    <div className="text-xs font-bold text-right mt-1 text-foreground">
                        <span className="font-bold text-blue-500">{(item.strength / 100).toFixed(1)}배</span>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const GeneralRankingList = ({ title, data, unitKey, positiveColor, negativeColor, description }: { title: string, data: any[], unitKey?: string, positiveColor?: string, negativeColor?: string, description?: string }) => (
    <Card className="bg-card border h-full">
        <CardHeader>
            <CardTitle className="text-lg">
                {title}
            </CardTitle>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {data.map((item) => {
                    const isPositive = item.value >= 0;
                    return (
                        <div key={item.rank} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-muted-foreground w-4 text-center">{item.rank}</span>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={item.img} alt={item.name} />
                                    <AvatarFallback>{item.ticker.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-bold text-sm">{item.name}</div>
                                    <div className="text-xs text-muted-foreground">{item.ticker}</div>
                                </div>
                            </div>
                            <div className={cn("font-bold text-sm", isPositive ? (positiveColor || "text-red-500") : (negativeColor || "text-blue-500"))}>
                                {isPositive && '+'}{item.value.toLocaleString()}{unitKey && item[unitKey]}
                            </div>
                        </div>
                    )
                })}
            </div>
        </CardContent>
    </Card>
);

const RankingList = ({ title, data, description }: { title: string, data: any[], description?: string }) => {
  const getFilterUrl = () => {
    if (title.includes('고래 순매수')) {
      return "/internal-data?tab=comparison&filter=whaletrade&tradeType=whale_buy";
    } else if (title.includes('고래 순매도')) {
      return "/internal-data?tab=comparison&filter=whaletrade&tradeType=whale_sell";
    } else if (title.includes('거래왕 순매수')) {
      return "/internal-data?tab=comparison&filter=whaletrade&tradeType=trader_buy";
    } else if (title.includes('거래왕 순매도')) {
      return "/internal-data?tab=comparison&filter=whaletrade&tradeType=trader_sell";
    }
    return "/internal-data";
  };

  return (
    <Card className="bg-card border h-full">
        <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">
                    {title}
                </CardTitle>
                {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
              </div>
              {(title.includes('고래 순매수') || title.includes('고래 순매도') || title.includes('거래왕 순매수') || title.includes('거래왕 순매도')) && (
                <Link href={getFilterUrl()} className="text-muted-foreground hover:text-foreground transition-colors mt-1">
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {data.map((item) => {
                    const isPositive = item.change >= 0;
                    return (
                        <div key={item.rank} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-muted-foreground w-4 text-center">{item.rank}</span>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={item.img} alt={item.name} />
                                    <AvatarFallback>{item.ticker.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-bold text-sm">{item.name}</div>
                                    <div className="text-xs text-muted-foreground">{item.ticker}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono text-sm font-semibold">{item.price}</div>
                                <div className={cn("text-xs font-semibold", isPositive ? 'text-red-500' : 'text-blue-500')}>
                                    {isPositive ? '+' : ''}{item.change.toFixed(2)}%
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </CardContent>
    </Card>
  );
};

const VolatilitySignalList = ({ title, icon: Icon, data, description }: { title: string, icon: React.ElementType, data: any[], description?: string }) => {
    return (
        <Card className="bg-card border h-full">
            <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                        {title}
                    </CardTitle>
                    {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
                  </div>
                  <Link href="/internal-data?tab=comparison&filter=volatility&volatilityThreshold=10.0" className="text-muted-foreground hover:text-foreground transition-colors mt-1">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map((item) => {
                        return (
                            <div key={item.rank} className="flex items-start justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-sm font-bold text-muted-foreground w-4 text-center">{item.rank}</span>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={item.img} alt={item.name} />
                                        <AvatarFallback>{item.ticker.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="font-bold text-sm">{item.name}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-sm text-primary">{item.value.toFixed(1)}%</div>
                                    {item.low && item.high && (
                                        <div className="text-xs text-muted-foreground mt-0.5">
                                            {item.low}~{item.high}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

const RvolList = ({ title, icon: Icon, data }: { title: string; icon: React.ElementType; data: any[] }) => {
    const maxValue = Math.max(...data.map(item => item.value), 0);

    return (
        <Card className="bg-card border h-full">
            <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                        {title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      최근 7일 평균 대비 24시간 거래량 급증 종목입니다.
                    </p>
                  </div>
                  <Link href="/internal-data?tab=comparison&filter=volume" className="text-muted-foreground hover:text-foreground transition-colors mt-1">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map((item) => {
                        return (
                            <div key={item.rank} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-muted-foreground w-4 text-center">{item.rank}</span>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={item.img} alt={item.name} />
                                        <AvatarFallback>{item.ticker.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-bold text-sm">{item.name}</div>
                                        <div className="text-xs text-muted-foreground">{item.ticker}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 w-2/5">
                                    <div className="w-full">
                                        <Progress 
                                            value={(item.value / maxValue) * 100} 
                                            className="h-1.5 bg-muted/50"
                                            indicatorClassName="bg-yellow-500"
                                        />
                                        <div className="text-xs font-bold text-right mt-1 text-foreground">
                                            <span className="font-bold text-yellow-500">{item.value.toLocaleString()}배</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

const BetaStyleList = ({ title, icon: Icon, data, description }: { title: string, icon: React.ElementType, data: any[], description?: string }) => {
    const getDirection = (value: number) => {
        return value >= 0 ? '같은 방향' : '반대 방향';
    };

    return (
        <Card className="bg-card border h-full">
            <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                        {title}
                    </CardTitle>
                    {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
                  </div>
                  <Link href="/internal-data?tab=comparison&filter=beta&betaDirection=same&betaMultiplier=1.0" className="text-muted-foreground hover:text-foreground transition-colors mt-1">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map((item) => {
                        const direction = getDirection(item.value);
                        return (
                            <div key={item.rank} className="flex items-start justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-sm font-bold text-muted-foreground w-4 text-center">{item.rank}</span>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={item.img} alt={item.name} />
                                        <AvatarFallback>{item.ticker.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="font-bold text-sm">{item.name}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={cn("text-xs", direction === '같은 방향' ? 'text-green-500' : 'text-red-500')}>{direction}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{Math.abs(item.value).toLocaleString()}배</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
};


export function WhaleTrades() {
  return (
    <div className='space-y-8'>
        <div>
            <h2 className="text-lg font-semibold text-foreground mb-6">시장 심리</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <UserAssetDistributionChart />
                <TradeList 
                  title="매수세 급증 Top 5" 
                  data={whaleData.topBuys} 
                  type="buy" 
                  description="24시간 평균 대비 최근 1시간 매수량 급증 종목입니다."
                />
                <DepositVolumeList 
                    title="거래소입금 Top 5" 
                    data={whaleData.netDeposit} 
                    description="24시간 평균 대비 최근 1시간 순입금 급증 종목입니다."
                />
            </div>
        </div>

        <div className="pt-8 border-t">
            <h2 className="text-lg font-semibold text-foreground mb-6">빗썸 매매 동향</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UnrealizedPnlList 
                title="수익금 Top 5" 
                data={whaleData.unrealizedPnl} 
                description="빗썸 전체 유저들의 미실현 수익금 합계입니다."
            />
                <RankingList 
                    title="고래 순매수 Top 5" 
                    data={whaleData.topWhaleBuys} 
                    description="최근 7일 자산규모 상위 100명이 가장 많이 사는 종목입니다."
                />
                <RankingList 
                    title="거래왕 순매수 Top 5" 
                    data={whaleData.topTraderBuys} 
                    description="최근 7일 거래량 상위 100명이 가장 많이 사는 종목입니다."
                />
            </div>
        </div>
        
        <div className="pt-8 border-t">
            <h2 className="text-lg font-semibold text-foreground mb-6">주요 기술적 지표</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <RvolList title="주간 거래 활성도" icon={BarChart} data={whaleData.topRvol} />
                <VolatilitySignalList title="일간 변동폭" icon={Percent} data={whaleData.topVolatility} description="당일 저가 대비 고가의 차이를 나타냅니다." />
                <BetaStyleList title="비트코인 대비 움직임" icon={Shield} data={whaleData.beta} description="비트코인 등락 대비 해당 종목의 민감도를 나타냅니다." />
            </div>
        </div>
    </div>
  );
}
