'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingUp, ShoppingCart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const myPortfolio = {
  coins: [
    { ticker: 'ETH', name: '이더리움', weight: 25, tierAvg: 20, diff: 5, img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032' },
    { ticker: 'BTC', name: '비트코인', weight: 30, tierAvg: 35, diff: -5, img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032' },
    { ticker: 'SOL', name: '솔라나', weight: 0, tierAvg: 12.3, diff: -12.3, img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032' },
    { ticker: 'XRP', name: '리플', weight: 15, tierAvg: 8.5, diff: 6.5, img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032' },
    { ticker: 'PEPE', name: '페페', weight: 0, tierAvg: 8.5, diff: -8.5, img: 'https://cryptologos.cc/logos/pepe-pepe-logo.svg?v=032' },
  ],
};

export function PortfolioComparison() {
  const missingCoins = myPortfolio.coins.filter(coin => coin.weight === 0 && coin.tierAvg > 5);
  const overWeightCoins = myPortfolio.coins.filter(coin => coin.diff > 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">내 포트폴리오 vs 등급 평균</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              등급 평균과 비교하여 포트폴리오를 최적화해보세요
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 부족한 코인 */}
          {missingCoins.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <h4 className="font-semibold">등급 평균이 많이 보유한 코인 (내가 미보유)</h4>
                </div>
                <Badge variant="outline" className="text-orange-500 border-orange-500">
                  {missingCoins.length}개
                </Badge>
              </div>
              <div className="space-y-2">
                {missingCoins.map((coin) => (
                  <div
                    key={coin.ticker}
                    className="p-3 rounded-lg border border-orange-500/30 bg-orange-500/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={coin.img} />
                        <AvatarFallback>{coin.ticker[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{coin.name}</p>
                        <p className="text-xs text-muted-foreground">
                          등급 평균: {coin.tierAvg}% | 내 보유: {coin.weight}%
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => console.log('Buy:', coin.ticker)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      매수하기
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 과다 보유 코인 */}
          {overWeightCoins.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <h4 className="font-semibold">등급 평균보다 많이 보유한 코인</h4>
                </div>
                <Badge variant="outline" className="text-blue-500 border-blue-500">
                  {overWeightCoins.length}개
                </Badge>
              </div>
              <div className="space-y-2">
                {overWeightCoins.map((coin) => (
                  <div
                    key={coin.ticker}
                    className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={coin.img} />
                        <AvatarFallback>{coin.ticker[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{coin.name}</p>
                        <p className="text-xs text-muted-foreground">
                          내 보유: {coin.weight}% | 등급 평균: {coin.tierAvg}% (차이: +{coin.diff.toFixed(1)}%p)
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => console.log('Review:', coin.ticker)}
                    >
                      매도 검토
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 전체 비교 테이블 */}
          <div>
            <h4 className="font-semibold mb-3">전체 포트폴리오 비교</h4>
            <div className="space-y-2">
              {myPortfolio.coins.map((coin) => (
                <div
                  key={coin.ticker}
                  className="p-3 rounded-lg border bg-card flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={coin.img} />
                      <AvatarFallback>{coin.ticker[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{coin.name}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">내 비중:</span>
                          <span className="text-xs font-semibold">{coin.weight}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">등급 평균:</span>
                          <span className="text-xs font-semibold">{coin.tierAvg}%</span>
                        </div>
                        {coin.diff !== 0 && (
                          <Badge
                            variant={coin.diff > 0 ? "default" : "outline"}
                            className="text-xs"
                          >
                            {coin.diff > 0 ? '+' : ''}{coin.diff.toFixed(1)}%p
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => console.log('Trade:', coin.ticker)}
                  >
                    거래하기
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
