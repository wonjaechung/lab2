'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, TrendingUp, Lightbulb, ShoppingCart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const performanceAnalysisData = {
  tierAverage: 5.2,
  myReturn: 2.1,
  difference: -3.1,
  lossContributors: [
    {
      ticker: 'SUI',
      name: '수이',
      myReturn: -15.8,
      tierAverage: -5.2,
      difference: -10.6,
      myWeight: 12.5,
      tierWeight: 3.2,
      img: 'https://cryptologos.cc/logos/sui-sui-logo.svg?v=032',
    },
    {
      ticker: 'XRP',
      name: '리플',
      myReturn: -8.2,
      tierAverage: -2.1,
      difference: -6.1,
      myWeight: 15.3,
      tierWeight: 5.8,
      img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032',
    },
    {
      ticker: 'DOGE',
      name: '도지코인',
      myReturn: -5.1,
      tierAverage: 1.2,
      difference: -6.3,
      myWeight: 8.7,
      tierWeight: 4.5,
      img: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=032',
    },
  ],
  gainContributors: [
    {
      ticker: 'WLD',
      name: '월드코인',
      myReturn: 45.2,
      tierAverage: 38.5,
      difference: 6.7,
      myWeight: 10.2,
      tierWeight: 8.3,
      img: 'https://cryptologos.cc/logos/worldcoin-org-wld-logo.svg?v=032',
    },
    {
      ticker: 'STX',
      name: '스택스',
      myReturn: 32.1,
      tierAverage: 28.9,
      difference: 3.2,
      myWeight: 12.8,
      tierWeight: 11.2,
      img: 'https://cryptologos.cc/logos/stacks-stx-logo.svg?v=032',
    },
  ],
  missingOpportunities: [
    {
      ticker: 'PEPE',
      name: '페페',
      tierAverageReturn: 85.2,
      tierWeight: 8.5,
      myWeight: 0,
      img: 'https://cryptologos.cc/logos/pepe-pepe-logo.svg?v=032',
      weeklyAvgPrice: 0.0085, // 이번주 매수평균가
      currentPrice: 0.012, // 현재가
    },
    {
      ticker: 'SOL',
      name: '솔라나',
      tierAverageReturn: 65.1,
      tierWeight: 12.3,
      myWeight: 0,
      img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032',
      weeklyAvgPrice: 180000, // 이번주 매수평균가
      currentPrice: 210000, // 현재가
    },
    {
      ticker: 'AGIX',
      name: '싱귤래리티넷',
      tierAverageReturn: 55.9,
      tierWeight: 6.8,
      myWeight: 0,
      img: 'https://cryptologos.cc/logos/singularitynet-agix-logo.svg?v=032',
      weeklyAvgPrice: 3200, // 이번주 매수평균가
      currentPrice: 4500, // 현재가
    },
  ],
};

function BundleBuyDialog({
  open,
  onOpenChange,
  coins,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coins: typeof performanceAnalysisData.missingOpportunities;
}) {
  const totalWeight = coins.reduce((sum, coin) => sum + coin.tierWeight, 0);
  const avgReturn = coins.reduce((sum, coin) => sum + coin.tierAverageReturn, 0) / coins.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            놓친 기회 묶음매수
          </DialogTitle>
          <DialogDescription>
            등급 평균이 많이 보유한 코인들을 한 번에 매수하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 요약 정보 */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">포함 코인</p>
                <p className="text-2xl font-bold">{coins.length}개</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">권장 총 비중</p>
                <p className="text-2xl font-bold text-primary">{totalWeight.toFixed(1)}%</p>
              </div>
            </div>
            <div className="pt-3 border-t">
              <p className="text-sm text-muted-foreground mb-1">주간변동</p>
              <p className="text-lg font-bold text-green-500">+{avgReturn.toFixed(1)}%</p>
            </div>
          </div>

          {/* 포함 코인 목록 */}
          <div>
            <h4 className="font-semibold mb-3">포함 코인 및 권장 비중</h4>
            <div className="space-y-2">
              {coins.map((coin) => (
                <div
                  key={coin.ticker}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={coin.img} />
                      <AvatarFallback>{coin.ticker}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{coin.name}</p>
                      <p className="text-sm text-muted-foreground">{coin.ticker}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-sm">
                      {coin.tierWeight}%
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      +{coin.tierAverageReturn}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 주의사항 */}
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">주의사항</p>
                <ul className="space-y-1">
                  <li>• 과거 수익률은 미래 수익을 보장하지 않습니다</li>
                  <li>• 묶음매수는 등급 평균 비중을 기준으로 합니다</li>
                  <li>• 자신의 리스크 성향에 맞게 조정하세요</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              onClick={() => {
                console.log('Bundle buy:', coins.map(c => c.ticker));
                onOpenChange(false);
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              묶음매수하기
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function WeeklyPerformanceAnalysis() {
  const { tierAverage, myReturn, difference, lossContributors, gainContributors, missingOpportunities } = performanceAnalysisData;
  const [isBundleBuyOpen, setIsBundleBuyOpen] = useState(false);
  const [showLossMakers, setShowLossMakers] = useState(false);

  return (
    <Card className="w-full">
      <CardContent>
        <div className="space-y-6">
          {/* 포커스 섹션 - 즉시 액션 */}
          <div className="space-y-6 pt-4">
            
            {showLossMakers ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-1">
                      이번 주 수익률을 낮춘 코인
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      수익률을 크게 낮추고 있는 코인들입니다. 보유 비중 조정을 검토해보세요.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="view-mode" className="text-sm text-muted-foreground cursor-pointer">
                      수익률 낮춘 코인 보기
                    </Label>
                    <Switch
                      id="view-mode"
                      checked={showLossMakers}
                      onCheckedChange={setShowLossMakers}
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {lossContributors.map((coin, index) => (
                    <div
                      key={coin.ticker}
                      className={cn(
                        'relative p-5 rounded-xl border-2 transition-all hover:shadow-lg',
                        index === 0
                          ? 'border-red-500/40 bg-gradient-to-br from-red-500/10 to-red-500/5'
                          : 'border-red-500/20 bg-red-500/5'
                      )}
                    >

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 ring-2 ring-red-500/20">
                            <AvatarImage src={coin.img} />
                            <AvatarFallback>{coin.ticker}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-base">{coin.name}</p>
                            <p className="text-xs text-muted-foreground">{coin.ticker}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-red-500">
                            {coin.myReturn > 0 ? '+' : ''}{coin.myReturn}%
                          </p>
                          <p className="text-xs text-muted-foreground">주간변동</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="pt-2 border-t border-red-500/10">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-muted-foreground min-w-[140px] text-left shrink-0">내 수익률:</span>
                              <div className="flex-1 h-2 bg-red-500/20 rounded-full overflow-hidden max-w-[120px]">
                                <div 
                                  className="h-full bg-red-500 rounded-full"
                                  style={{ width: `${Math.min(Math.abs(coin.myReturn) / 50 * 100, 100)}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-semibold text-red-500 w-12 text-right shrink-0">{coin.myReturn > 0 ? '+' : ''}{coin.myReturn}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-muted-foreground min-w-[140px] text-left shrink-0 whitespace-nowrap">동일 멤버십 수익률:</span>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[120px]">
                                <div 
                                  className="h-full bg-muted-foreground/30 rounded-full"
                                  style={{ width: `${Math.min(Math.abs(coin.tierAverage) / 50 * 100, 100)}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-semibold text-muted-foreground w-12 text-right shrink-0">{coin.tierAverage > 0 ? '+' : ''}{coin.tierAverage}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-red-500/10">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-muted-foreground min-w-[140px] text-left shrink-0">나의 비중:</span>
                              <div className="flex-1 h-2 bg-red-500/20 rounded-full overflow-hidden max-w-[120px]">
                                <div 
                                  className="h-full bg-red-500 rounded-full"
                                  style={{ width: `${Math.min(coin.myWeight, 100)}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-semibold text-red-500 w-12 text-right shrink-0">{coin.myWeight}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-muted-foreground min-w-[140px] text-left shrink-0 whitespace-nowrap">동일 멤버십 비중:</span>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[120px]">
                                <div 
                                  className="h-full bg-muted-foreground/30 rounded-full"
                                  style={{ width: `${Math.min(coin.tierWeight, 100)}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-semibold text-muted-foreground w-12 text-right shrink-0">{coin.tierWeight}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-full"
                        onClick={() => console.log('Trade:', coin.ticker)}
                      >
                        {coin.ticker} 거래하기
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-1">
                      이번 주 놓친 기회
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      같은 등급 고객들이 보유하는 주간 상승률이 높은 코인들입니다.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="view-mode" className="text-sm text-muted-foreground cursor-pointer">
                        수익률 낮춘 코인 보기
                      </Label>
                      <Switch
                        id="view-mode"
                        checked={showLossMakers}
                        onCheckedChange={setShowLossMakers}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="default"
                      className="h-8"
                      onClick={() => setIsBundleBuyOpen(true)}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      묶음매수
                    </Button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {missingOpportunities.map((coin, index) => (
                    <div
                      key={coin.ticker}
                      className={cn(
                        'relative p-5 rounded-xl border-2 transition-all hover:shadow-lg',
                        index === 0
                          ? 'border-orange-500/40 bg-gradient-to-br from-orange-500/10 to-orange-500/5'
                          : 'border-orange-500/20 bg-orange-500/5'
                      )}
                    >
                      {index === 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-orange-500">
                          최고 수익률
                        </Badge>
                      )}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 ring-2 ring-orange-500/20">
                            <AvatarImage src={coin.img} />
                            <AvatarFallback>{coin.ticker}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-base">{coin.name}</p>
                            <p className="text-xs text-muted-foreground">{coin.ticker}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-500">
                            +{coin.tierAverageReturn}%
                          </p>
                          <p className="text-xs text-muted-foreground">주간변동</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">등급 평균 보유</span>
                          <span className="font-semibold">{coin.tierWeight}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">내 보유</span>
                          <span className="font-semibold text-muted-foreground">{coin.myWeight}%</span>
                        </div>
                        <div className="pt-2 border-t border-orange-500/10 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">이번주 매수평균가</span>
                            <span className="font-semibold">
                              {coin.weeklyAvgPrice >= 1000 
                                ? `${coin.weeklyAvgPrice.toLocaleString('ko-KR')}원`
                                : coin.weeklyAvgPrice >= 1
                                ? `${coin.weeklyAvgPrice.toFixed(2)}원`
                                : `${coin.weeklyAvgPrice.toFixed(4)}원`
                              }
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">현재가</span>
                            <span className="font-semibold text-foreground">
                              {coin.currentPrice >= 1000 
                                ? `${coin.currentPrice.toLocaleString('ko-KR')}원`
                                : coin.currentPrice >= 1
                                ? `${coin.currentPrice.toFixed(2)}원`
                                : `${coin.currentPrice.toFixed(4)}원`
                              }
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-muted-foreground">이번주 매수평균가 대비</span>
                            <span className={cn(
                              'font-semibold',
                              coin.currentPrice > coin.weeklyAvgPrice ? 'text-green-500' : 'text-red-500'
                            )}>
                              {coin.currentPrice > coin.weeklyAvgPrice ? '+' : ''}
                              {((coin.currentPrice - coin.weeklyAvgPrice) / coin.weeklyAvgPrice * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="default"
                        className="w-full"
                        onClick={() => console.log('Trade:', coin.ticker)}
                      >
                        {coin.ticker} 거래하기
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <BundleBuyDialog
        open={isBundleBuyOpen}
        onOpenChange={setIsBundleBuyOpen}
        coins={missingOpportunities}
      />
    </Card>
  );
}
