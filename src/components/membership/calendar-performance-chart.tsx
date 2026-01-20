'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface PerformanceChartProps {
  weeklyData: { week: string; pnl: number; cumulative: number }[];
}

const formatKoreanCurrency = (value: number) => {
  if (value === 0) return '0원';
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1_0000_0000) {
    return `${sign}${(absValue / 1_0000_0000).toFixed(0)}억`;
  }
  if (absValue >= 1_0000) {
    return `${sign}${Math.round(absValue / 1_0000).toLocaleString()}만`;
  }
  return `${sign}${Math.round(value).toLocaleString()}원`;
};

export function CalendarPerformanceChart({ weeklyData }: PerformanceChartProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          주간 수익률 추이
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="week" 
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => formatKoreanCurrency(value)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'pnl') return [formatKoreanCurrency(value), '주간 수익'];
                  if (name === 'cumulative') return [formatKoreanCurrency(value), '누적 수익'];
                  return [value, name];
                }}
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="pnl"
                stroke="#22c55e"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#22c55e', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-primary"></div>
            <span className="text-xs text-muted-foreground">누적 수익</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-green-500 border-dashed"></div>
            <span className="text-xs text-muted-foreground">주간 수익</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
