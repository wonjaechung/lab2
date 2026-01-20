'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const popularCoins = [
  {
    ticker: 'PEPE',
    name: '페페',
    img: 'https://cryptologos.cc/logos/pepe-pepe-logo.svg?v=032',
    holderCount: 1250,
    avgReturn: 85.2,
    avgWeight: 8.5,
    price: 0.012,
    change24h: 12.5,
    trend: 'up' as const,
  },
  {
    ticker: 'SOL',
    name: '솔라나',
    img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032',
    holderCount: 980,
    avgReturn: 65.1,
    avgWeight: 12.3,
    price: 210000,
    change24h: 5.2,
    trend: 'up' as const,
  },
  {
    ticker: 'WLD',
    name: '월드코인',
    img: 'https://cryptologos.cc/logos/worldcoin-org-wld-logo.svg?v=032',
    holderCount: 750,
    avgReturn: 45.2,
    avgWeight: 10.2,
    price: 8500,
    change24h: 8.3,
    trend: 'up' as const,
  },
  {
    ticker: 'AGIX',
    name: '싱귤래리티넷',
    img: 'https://cryptologos.cc/logos/singularitynet-agix-logo.svg?v=032',
    holderCount: 620,
    avgReturn: 55.9,
    avgWeight: 6.8,
    price: 4500,
    change24h: 15.7,
    trend: 'up' as const,
  },
  {
    ticker: 'LINK',
    name: '체인링크',
    img: 'https://cryptologos.cc/logos/chainlink-link-logo.svg?v=032',
    holderCount: 580,
    avgReturn: 42.3,
    avgWeight: 9.5,
    price: 18500,
    change24h: 3.1,
    trend: 'up' as const,
  },
];

export function GradePopularCoins() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              보유비중 TOP 5
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              등급 내 고객들이 가장 높은 비중으로 보유하고 있는 코인들입니다.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {popularCoins.map((coin, index) => (
            <div
              key={coin.ticker}
              className={cn(
                'p-4 rounded-lg border transition-all hover:shadow-md',
                index === 0
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-border bg-card'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                      index === 0
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}>
                      {index + 1}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={coin.img} />
                      <AvatarFallback>{coin.ticker[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold">{coin.name}</p>
                      <p className="text-xs text-muted-foreground">{coin.ticker}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 ml-auto">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Users className="w-3 h-3" />
                        보유자
                      </div>
                      <p className="font-semibold">{coin.holderCount.toLocaleString()}명</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">평균 수익률</div>
                      <p className="font-semibold text-green-500">
                        +{coin.avgReturn.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">평균 비중</div>
                      <p className="font-semibold">{coin.avgWeight}%</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">24h 변동</div>
                      <p className={cn(
                        'font-semibold flex items-center gap-1',
                        coin.change24h > 0 ? 'text-red-500' : 'text-blue-500'
                      )}>
                        {coin.change24h > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={index === 0 ? "default" : "outline"}
                  className="ml-4"
                  onClick={() => console.log('Trade:', coin.ticker)}
                >
                  거래하기
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
