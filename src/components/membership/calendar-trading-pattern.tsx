'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Clock, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

interface TradingPatternProps {
  weeklyData: { day: string; count: number; pnl: number }[];
  hourlyData: { hour: string; count: number }[];
}

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
const colors = ['#22c55e', '#eab308', '#f97316', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444'];

export function CalendarTradingPattern({ weeklyData, hourlyData }: TradingPatternProps) {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {/* 요일별 거래 패턴 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            요일별 거래 패턴
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'count') return [value, '거래 횟수'];
                    if (name === 'pnl') return [formatKoreanCurrency(value), '수익'];
                    return [value, name];
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {weeklyData.map((day, index) => (
              <div key={day.day} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-muted-foreground">{day.day}요일</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{day.count}회</span>
                  <span className={day.pnl > 0 ? 'text-green-500' : day.pnl < 0 ? 'text-red-500' : 'text-muted-foreground'}>
                    {day.pnl > 0 ? '+' : ''}{formatKoreanCurrency(day.pnl)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 시간대별 거래 패턴 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            시간대별 거래 빈도
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis 
                  dataKey="hour" 
                  type="category" 
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                  }}
                  formatter={(value: number) => [value, '거래 횟수']}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            가장 활발한 거래 시간대를 확인하고 최적의 거래 타이밍을 찾아보세요
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
