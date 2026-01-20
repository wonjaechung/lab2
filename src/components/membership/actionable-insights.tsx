'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  ArrowRight,
  Lightbulb,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Calendar
} from 'lucide-react';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { cn } from '@/lib/utils';

interface Insight {
  id: string;
  type: 'portfolio' | 'tier' | 'performance' | 'strategy';
  icon: React.ReactNode;
  title: string;
  description: string;
  metric?: string;
  metricLabel?: string;
  actionLabel: string;
  actionHref?: string;
  highlight?: boolean;
}

const insights: Insight[] = [
  {
    id: '1',
    type: 'portfolio',
    icon: <Users className="w-5 h-5" />,
    title: '상위 10%가 추가 보유한 코인',
    description: '당신과 비슷한 포트폴리오를 가진 상위 10% 멤버들은 평균적으로',
    metric: 'RNDR',
    metricLabel: '코인을 추가로 보유하고 있어요',
    actionLabel: 'RNDR 거래하기',
    highlight: true,
  },
  {
    id: '3',
    type: 'tier',
    icon: <Target className="w-5 h-5" />,
    title: '승급까지 단축 가능',
    description: '승급까지 200만원 남았어요. 이번 달 거래액을',
    metric: '20%',
    metricLabel: '늘리면 D-3로 단축 가능합니다',
    actionLabel: '승급 시뮬레이터 보기',
    highlight: true,
  },
  {
    id: '4',
    type: 'strategy',
    icon: <Clock className="w-5 h-5" />,
    title: '리밸런싱 주기 비교',
    description: '등급 내 고수들은 보통',
    metric: '주 2회',
    metricLabel: '리밸런싱하는데, 당신은 월 1회입니다',
    actionLabel: '고수들의 전략 보기',
  },
  {
    id: '5',
    type: 'portfolio',
    icon: <Zap className="w-5 h-5" />,
    title: '실시간 인기 코인',
    description: '지금 등급 내 상위 5%가',
    metric: 'SOL',
    metricLabel: '코인을 매수하고 있어요',
    actionLabel: 'SOL 거래하기',
    highlight: true,
  },
];

// 수익률 차이 분석 데이터
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
    },
    {
      ticker: 'SOL',
      name: '솔라나',
      tierAverageReturn: 65.1,
      tierWeight: 12.3,
      myWeight: 0,
      img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032',
    },
    {
      ticker: 'AGIX',
      name: '싱귤래리티넷',
      tierAverageReturn: 55.9,
      tierWeight: 6.8,
      myWeight: 0,
      img: 'https://cryptologos.cc/logos/singularitynet-agix-logo.svg?v=032',
    },
  ],
};

function PerformanceAnalysisDialog({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const { tierAverage, myReturn, difference, lossContributors, gainContributors, missingOpportunities } = performanceAnalysisData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">이번 주 수익률 차이 분석</DialogTitle>
          <DialogDescription>
            등급 평균 대비 수익률 차이를 만든 주요 요인을 분석했습니다
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 요약 카드 */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">등급 평균</p>
              <p className="text-2xl font-bold text-green-500">+{tierAverage}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">내 수익률</p>
              <p className="text-2xl font-bold text-foreground">+{myReturn}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">차이</p>
              <p className="text-2xl font-bold text-red-500">{difference > 0 ? '+' : ''}{difference}%</p>
            </div>
          </div>

          {/* 손실 요인 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-lg">수익률을 낮춘 주요 코인</h3>
            </div>
            <div className="space-y-3">
              {lossContributors.map((coin) => (
                <div
                  key={coin.ticker}
                  className="p-4 rounded-lg border border-red-500/20 bg-red-500/5"
                >
                  <div className="flex items-start justify-between mb-2">
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
                      <p className="text-sm text-muted-foreground">내 수익률</p>
                      <p className="font-bold text-red-500">{coin.myReturn > 0 ? '+' : ''}{coin.myReturn}%</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-red-500/10">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">등급 평균 대비</p>
                      <p className="font-semibold text-red-500">
                        {coin.difference > 0 ? '+' : ''}{coin.difference.toFixed(1)}%p
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">내 보유 비중</p>
                      <p className="font-semibold">{coin.myWeight}%</p>
                      <p className="text-xs text-muted-foreground">(등급 평균: {coin.tierWeight}%)</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-3"
                    onClick={() => console.log('Trade:', coin.ticker)}
                  >
                    {coin.ticker} 거래하기
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* 수익 요인 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-lg">수익률을 높인 주요 코인</h3>
            </div>
            <div className="space-y-3">
              {gainContributors.map((coin) => (
                <div
                  key={coin.ticker}
                  className="p-4 rounded-lg border border-green-500/20 bg-green-500/5"
                >
                  <div className="flex items-start justify-between mb-2">
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
                      <p className="text-sm text-muted-foreground">내 수익률</p>
                      <p className="font-bold text-green-500">+{coin.myReturn}%</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-green-500/10">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">등급 평균 대비</p>
                      <p className="font-semibold text-green-500">
                        +{coin.difference.toFixed(1)}%p
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">내 보유 비중</p>
                      <p className="font-semibold">{coin.myWeight}%</p>
                      <p className="text-xs text-muted-foreground">(등급 평균: {coin.tierWeight}%)</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 놓친 기회 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-lg">등급 평균이 많이 보유한 코인 (내 미보유)</h3>
            </div>
            <div className="space-y-3">
              {missingOpportunities.map((coin) => (
                <div
                  key={coin.ticker}
                  className="p-4 rounded-lg border border-orange-500/20 bg-orange-500/5"
                >
                  <div className="flex items-start justify-between">
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
                      <p className="text-sm text-muted-foreground">등급 평균 수익률</p>
                      <p className="font-bold text-green-500">+{coin.tierAverageReturn}%</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        등급 평균 보유 비중: {coin.tierWeight}%
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-3"
                    onClick={() => console.log('Trade:', coin.ticker)}
                  >
                    {coin.ticker} 거래하기
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* 인사이트 요약 */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              주요 인사이트
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• SUI, XRP, DOGE의 높은 보유 비중이 수익률을 낮췄습니다</li>
              <li>• 등급 평균이 많이 보유한 PEPE, SOL, AGIX를 보유하지 않아 기회를 놓쳤습니다</li>
              <li>• WLD와 STX는 등급 평균보다 좋은 성과를 보였습니다</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 리밸런싱 주기 분석 데이터
const rebalancingData = {
  myFrequency: '월 1회',
  tierTop10Frequency: '주 2회',
  needsRebalancing: true,
  lastRebalancing: '2024-01-15',
  daysSinceLastRebalancing: 12,
  portfolioDeviation: 8.5, // 목표 비중에서 벗어난 정도 (%)
  currentPortfolio: [
    { ticker: 'BTC', name: '비트코인', currentWeight: 45, targetWeight: 40, deviation: 5, action: '매도', amount: '2.5%', img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032' },
    { ticker: 'ETH', name: '이더리움', currentWeight: 30, targetWeight: 35, deviation: -5, action: '매수', amount: '2.5%', img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032' },
    { ticker: 'SOL', name: '솔라나', currentWeight: 15, targetWeight: 15, deviation: 0, action: '유지', amount: '0%', img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032' },
    { ticker: 'WLD', name: '월드코인', currentWeight: 10, targetWeight: 10, deviation: 0, action: '유지', amount: '0%', img: 'https://cryptologos.cc/logos/worldcoin-org-wld-logo.svg?v=032' },
  ],
  rebalancingTriggers: [
    { condition: '목표 비중에서 ±5% 이상 벗어날 때', status: true, description: 'BTC가 목표 대비 +5% 초과' },
    { condition: '마지막 리밸런싱 후 2주 경과', status: true, description: '12일 경과 (권장: 14일)' },
    { condition: '시장 변동성이 높을 때', status: false, description: '현재 시장은 안정적' },
    { condition: '특정 자산이 20% 이상 상승/하락', status: false, description: '큰 변동 없음' },
  ],
  rebalancingSteps: [
    { step: 1, title: '현재 포트폴리오 비중 확인', description: '각 자산의 현재 보유 비중을 정확히 파악하세요' },
    { step: 2, title: '목표 비중과 차이 계산', description: '목표 비중에서 벗어난 정도를 %로 계산합니다' },
    { step: 3, title: '매수/매도 필요량 결정', description: '벗어난 비중만큼 매수 또는 매도합니다' },
    { step: 4, title: '거래 실행', description: '한 번에 모두 조정하지 말고 단계적으로 진행하세요' },
    { step: 5, title: '리밸런싱 후 확인', description: '거래 후 실제 비중이 목표에 맞는지 확인합니다' },
  ],
  tips: [
    '리밸런싱은 시장이 열릴 때 하는 것이 좋습니다 (유동성 확보)',
    '한 번에 모든 자산을 조정하지 말고, 우선순위가 높은 것부터 진행하세요',
    '수수료를 고려하여 ±2% 이내의 작은 편차는 무시해도 됩니다',
    '급격한 시장 변동 중에는 리밸런싱을 보류하는 것이 좋을 수 있습니다',
    '리밸런싱 후 최소 1주일은 다시 조정하지 않는 것을 권장합니다',
  ],
};

function RebalancingStrategyDialog({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const { 
    myFrequency, 
    tierTop10Frequency, 
    needsRebalancing,
    portfolioDeviation,
    currentPortfolio,
    rebalancingTriggers,
    rebalancingSteps,
    tips
  } = rebalancingData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 p-3 border rounded-md shadow-lg">
          <p className="font-bold mb-1">{label}</p>
          <p className="text-sm text-muted-foreground">
            멤버 비율: {payload[0].value}%
          </p>
          <p className="text-sm text-green-500 font-semibold">
            평균 수익률: +{payload[1]?.value || 0}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Clock className="w-6 h-6 text-orange-500" />
            리밸런싱 가이드
          </DialogTitle>
          <DialogDescription>
            지금 리밸런싱이 필요한지, 어떻게 해야 하는지 구체적으로 확인하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 리밸런싱 필요 여부 알림 */}
          <div className={cn(
            'p-4 rounded-lg border-2',
            needsRebalancing 
              ? 'border-orange-500/30 bg-orange-500/5' 
              : 'border-green-500/30 bg-green-500/5'
          )}>
            <div className="flex items-start gap-3">
              {needsRebalancing ? (
                <AlertCircle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">
                  {needsRebalancing ? '리밸런싱이 필요합니다' : '포트폴리오가 안정적입니다'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {needsRebalancing 
                    ? `목표 비중에서 ${portfolioDeviation}% 벗어났습니다. 리밸런싱을 통해 포트폴리오를 재조정하세요.`
                    : '현재 포트폴리오가 목표 비중과 잘 맞습니다. 다음 리밸런싱까지 대기하세요.'}
                </p>
              </div>
            </div>
          </div>

          {/* 현재 포트폴리오 상태 */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              현재 포트폴리오 vs 목표 비중
            </h3>
            <div className="space-y-3">
              {currentPortfolio.map((asset) => (
                <div
                  key={asset.ticker}
                  className={cn(
                    'p-4 rounded-lg border',
                    asset.deviation !== 0
                      ? 'border-orange-500/20 bg-orange-500/5'
                      : 'border-border bg-card'
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={asset.img} />
                        <AvatarFallback>{asset.ticker}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">{asset.ticker}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={asset.action === '매수' ? 'default' : asset.action === '매도' ? 'destructive' : 'outline'}
                      >
                        {asset.action}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">현재 비중</p>
                      <p className="font-semibold">{asset.currentWeight}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">목표 비중</p>
                      <p className="font-semibold">{asset.targetWeight}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">조정 필요</p>
                      <p className={cn(
                        'font-semibold',
                        asset.deviation > 0 ? 'text-red-500' : asset.deviation < 0 ? 'text-green-500' : 'text-muted-foreground'
                      )}>
                        {asset.deviation > 0 ? '+' : ''}{asset.deviation}%
                      </p>
                    </div>
                  </div>
                  {asset.deviation !== 0 && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">조정 액션:</span>
                        <span className="font-semibold">
                          {asset.action} {asset.amount}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => console.log('Rebalance:', asset.ticker, asset.action)}
                      >
                        {asset.ticker} {asset.action === '매수' ? '매수하기' : asset.action === '매도' ? '매도하기' : '확인하기'}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 리밸런싱 트리거 체크리스트 */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
              리밸런싱이 필요한 시점
            </h3>
            <div className="space-y-2">
              {rebalancingTriggers.map((trigger, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-3 rounded-lg border flex items-start gap-3',
                    trigger.status
                      ? 'border-orange-500/20 bg-orange-500/5'
                      : 'border-border bg-card'
                  )}
                >
                  <div className={cn(
                    'w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center',
                    trigger.status ? 'bg-orange-500' : 'bg-muted'
                  )}>
                    {trigger.status && (
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{trigger.condition}</p>
                    <p className="text-xs text-muted-foreground mt-1">{trigger.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 리밸런싱 단계별 가이드 */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-primary" />
              리밸런싱 실행 가이드 (5단계)
            </h3>
            <div className="space-y-3">
              {rebalancingSteps.map((step, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 리밸런싱 팁 */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              리밸런싱 시 주의사항
            </h3>
            <div className="space-y-2">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-border bg-card flex items-start gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2"></div>
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              className="flex-1"
              onClick={() => {
                console.log('Start rebalancing');
                onOpenChange(false);
              }}
              disabled={!needsRebalancing}
            >
              지금 리밸런싱 시작하기
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                console.log('Set reminder');
                onOpenChange(false);
              }}
            >
              리밸런싱 알림 설정
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ActionableInsights() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isPerformanceDialogOpen, setIsPerformanceDialogOpen] = useState(false);
  const [isRebalancingDialogOpen, setIsRebalancingDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAutoRotating || insights.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // 안전하게 currentInsight 가져오기
  const currentInsight = insights[currentIndex] || insights[0];
  
  // insights가 비어있으면 아무것도 렌더링하지 않음
  if (!currentInsight || insights.length === 0) {
    return null;
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'portfolio':
        return 'text-blue-500 bg-blue-500/10';
      case 'tier':
        return 'text-purple-500 bg-purple-500/10';
      case 'performance':
        return 'text-green-500 bg-green-500/10';
      case 'strategy':
        return 'text-orange-500 bg-orange-500/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              액션 가능한 인사이트
            </CardTitle>
            <CardDescription className="mt-1">
              당신만을 위한 맞춤형 투자 인사이트를 확인하세요
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {currentIndex + 1} / {insights.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Insight */}
          <div
            className={cn(
              'p-6 rounded-lg border-2 transition-all duration-300',
              currentInsight.highlight
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card'
            )}
            onMouseEnter={() => setIsAutoRotating(false)}
            onMouseLeave={() => setIsAutoRotating(true)}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  'p-3 rounded-lg shrink-0',
                  getTypeColor(currentInsight.type)
                )}
              >
                {currentInsight.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">
                    {currentInsight.title}
                  </h3>
                  {currentInsight.highlight && (
                    <Badge variant="default" className="text-xs">
                      추천
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {currentInsight.description}{' '}
                  {currentInsight.metric && (
                    <span className="font-bold text-foreground">
                      {currentInsight.metric}
                    </span>
                  )}{' '}
                  {currentInsight.metricLabel}
                </p>
                <Button
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    if (currentInsight.id === '4') {
                      setIsRebalancingDialogOpen(true);
                    } else {
                      console.log('Action clicked:', currentInsight.id);
                    }
                  }}
                >
                  {currentInsight.actionLabel}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Insight Indicators */}
          <div className="flex items-center justify-center gap-2">
            {insights.map((insight, index) => (
              <button
                key={insight.id}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoRotating(false);
                }}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted hover:bg-muted-foreground/50'
                )}
                aria-label={`인사이트 ${index + 1}로 이동`}
              />
            ))}
          </div>

          {/* Quick Preview of Other Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t">
            {insights
              .filter((_, idx) => idx !== currentIndex)
              .slice(0, 2)
              .map((insight) => (
                <button
                  key={insight.id}
                  onClick={() => {
                    const newIndex = insights.findIndex(
                      (i) => i.id === insight.id
                    );
                    setCurrentIndex(newIndex);
                    setIsAutoRotating(false);
                  }}
                  className="text-left p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={cn(
                        'p-1.5 rounded',
                        getTypeColor(insight.type)
                      )}
                    >
                      {insight.icon}
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {insight.title}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {insight.description}
                  </p>
                </button>
              ))}
          </div>
        </div>
      </CardContent>

      <PerformanceAnalysisDialog
        open={isPerformanceDialogOpen}
        onOpenChange={setIsPerformanceDialogOpen}
      />
      <RebalancingStrategyDialog
        open={isRebalancingDialogOpen}
        onOpenChange={setIsRebalancingDialogOpen}
      />
    </Card>
  );
}
