'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const rebalancingSuggestions = {
  needsRebalancing: true,
  currentDeviation: 12.5,
  targetDeviation: 5.0,
  actions: [
    {
      type: 'buy' as const,
      ticker: 'SOL',
      name: '솔라나',
      currentWeight: 0,
      targetWeight: 12.3,
      amount: 2500000,
      img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032',
      reason: '등급 평균 대비 부족',
    },
    {
      type: 'buy' as const,
      ticker: 'PEPE',
      name: '페페',
      currentWeight: 0,
      targetWeight: 8.5,
      amount: 1800000,
      img: 'https://cryptologos.cc/logos/pepe-pepe-logo.svg?v=032',
      reason: '등급 평균 대비 부족',
    },
    {
      type: 'sell' as const,
      ticker: 'XRP',
      name: '리플',
      currentWeight: 15,
      targetWeight: 8.5,
      amount: -1300000,
      img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032',
      reason: '등급 평균 대비 과다',
    },
  ],
  estimatedBenefit: 3.2,
};

export function GradeRebalancingSuggestion() {
  const buyActions = rebalancingSuggestions.actions.filter(a => a.type === 'buy');
  const sellActions = rebalancingSuggestions.actions.filter(a => a.type === 'sell');

  return (
    <Card className={cn(
      rebalancingSuggestions.needsRebalancing && 'border-orange-500/30 bg-orange-500/5'
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg font-semibold">등급 평균 기반 리밸런싱 제안</CardTitle>
          </div>
          {rebalancingSuggestions.needsRebalancing && (
            <Badge variant="outline" className="text-orange-500 border-orange-500">
              조정 필요
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          현재 포트폴리오가 등급 평균과 {rebalancingSuggestions.currentDeviation}%p 차이납니다.
          리밸런싱 시 예상 수익률 개선: <span className="font-semibold text-green-500">+{rebalancingSuggestions.estimatedBenefit}%p</span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 매수 제안 */}
          {buyActions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <h4 className="font-semibold">매수 제안 ({buyActions.length}개)</h4>
              </div>
              <div className="space-y-2">
                {buyActions.map((action) => (
                  <div
                    key={action.ticker}
                    className="p-3 rounded-lg border border-green-500/30 bg-green-500/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={action.img} />
                        <AvatarFallback>{action.ticker[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{action.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {action.currentWeight}% → {action.targetWeight}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{action.reason}</p>
                        <p className="text-sm font-semibold text-green-500 mt-1">
                          약 {Math.abs(action.amount / 10000).toFixed(0)}만원 매수 권장
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => console.log('Buy:', action.ticker)}
                    >
                      매수하기
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 매도 제안 */}
          {sellActions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h4 className="font-semibold">매도 검토 ({sellActions.length}개)</h4>
              </div>
              <div className="space-y-2">
                {sellActions.map((action) => (
                  <div
                    key={action.ticker}
                    className="p-3 rounded-lg border border-red-500/30 bg-red-500/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={action.img} />
                        <AvatarFallback>{action.ticker[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{action.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {action.currentWeight}% → {action.targetWeight}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{action.reason}</p>
                        <p className="text-sm font-semibold text-red-500 mt-1">
                          약 {Math.abs(action.amount / 10000).toFixed(0)}만원 매도 검토
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => console.log('Sell:', action.ticker)}
                    >
                      매도 검토
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 일괄 리밸런싱 버튼 */}
          <div className="pt-4 border-t">
            <Button
              size="lg"
              variant="default"
              className="w-full"
              onClick={() => console.log('Auto rebalance')}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              등급 평균 기준 자동 리밸런싱
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              제안된 매수/매도를 한 번에 실행합니다
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
