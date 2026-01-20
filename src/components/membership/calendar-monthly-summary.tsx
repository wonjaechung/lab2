'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Calendar, Target, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonthlySummaryProps {
  totalPnl: number;
  tradingDays: number;
  bestDay?: { date: string; pnl: number };
  worstDay?: { date: string; pnl: number };
  journalEntriesCount: number;
  targetDays: number;
}

const formatKoreanCurrency = (value: number) => {
  if (value === 0) return '0원';
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1_0000_0000_0000) {
    return `${sign}${(absValue / 1_0000_0000_0000).toFixed(1)}조`;
  }
  if (absValue >= 1_0000_0000) {
    return `${sign}${(absValue / 1_0000_0000).toFixed(0)}억`;
  }
  if (absValue >= 1_0000) {
    return `${sign}${Math.round(absValue / 1_0000).toLocaleString()}만`;
  }
  return `${sign}${Math.round(value).toLocaleString()}원`;
};

export function CalendarMonthlySummary({
  totalPnl,
  tradingDays,
  bestDay,
  worstDay,
  journalEntriesCount,
  targetDays,
}: MonthlySummaryProps) {
  const progress = Math.min((journalEntriesCount / targetDays) * 100, 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 월간 수익 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            이번 달 누적 수익
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={cn(
            'text-2xl font-bold',
            totalPnl > 0 ? 'text-green-500' : totalPnl < 0 ? 'text-red-500' : 'text-foreground'
          )}>
            {totalPnl > 0 ? '+' : ''}{formatKoreanCurrency(totalPnl)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            거래일 {tradingDays}일
          </p>
        </CardContent>
      </Card>

      {/* 최고 수익일 */}
      {bestDay && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              최고 수익일
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">
              +{formatKoreanCurrency(bestDay.pnl)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {bestDay.date}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 최저 수익일 */}
      {worstDay && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              최저 수익일
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">
              {formatKoreanCurrency(worstDay.pnl)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {worstDay.date}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 매매일지 작성 목표 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Target className="w-4 h-4" />
            매매일지 작성 목표
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">
                {journalEntriesCount}일
              </p>
              <p className="text-sm text-muted-foreground">
                / {targetDays}일
              </p>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={cn(
                  'h-2 rounded-full transition-all',
                  progress >= 100 ? 'bg-green-500' : 'bg-primary'
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            {progress >= 100 && (
              <p className="text-xs text-green-500 font-medium">
                목표 달성! 등급 승급 부스터 획득
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
