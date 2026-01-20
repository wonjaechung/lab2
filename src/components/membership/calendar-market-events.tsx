'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, AlertCircle, TrendingUp, DollarSign, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';

interface MarketEvent {
  id: string;
  title: string;
  date: Date;
  type: 'fomc' | 'halving' | 'upgrade' | 'listing' | 'other';
  description: string;
  impact: 'high' | 'medium' | 'low';
}

const mockEvents: MarketEvent[] = [
  {
    id: '1',
    title: 'FOMC 금리 결정',
    date: new Date(2026, 0, 28),
    type: 'fomc',
    description: '미 연준 금리 결정 발표',
    impact: 'high',
  },
  {
    id: '2',
    title: '비트코인 반감기',
    date: new Date(2026, 3, 20),
    type: 'halving',
    description: '비트코인 블록 보상 50% 감소',
    impact: 'high',
  },
  {
    id: '3',
    title: '이더리움 업그레이드',
    date: new Date(2026, 1, 15),
    type: 'upgrade',
    description: 'Ethereum 네트워크 업그레이드',
    impact: 'medium',
  },
  {
    id: '4',
    title: 'CPI 발표',
    date: new Date(2026, 0, 10),
    type: 'other',
    description: '미국 소비자물가지수 발표',
    impact: 'high',
  },
];

const eventIcons = {
  fomc: DollarSign,
  halving: TrendingUp,
  upgrade: Zap,
  listing: AlertCircle,
  other: Calendar,
};

const eventColors = {
  fomc: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  halving: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  upgrade: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  listing: 'bg-green-500/10 text-green-500 border-green-500/20',
  other: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

export function CalendarMarketEvents({ currentMonth }: { currentMonth: Date }) {
  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  
  const relevantEvents = mockEvents.filter(event => {
    const eventDate = new Date(event.date);
    return isAfter(eventDate, addDays(monthStart, -7)) && isBefore(eventDate, addDays(monthEnd, 7));
  }).sort((a, b) => a.date.getTime() - b.date.getTime());

  const upcomingEvents = relevantEvents.filter(event => 
    isAfter(event.date, new Date())
  ).slice(0, 5);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          주요 시장 이벤트
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-3">
            {upcomingEvents.map((event) => {
              const Icon = eventIcons[event.type];
              const isToday = format(event.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              const daysUntil = Math.ceil((event.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div
                  key={event.id}
                  className={cn(
                    'p-3 rounded-lg border flex items-start gap-3',
                    eventColors[event.type],
                    isToday && 'ring-2 ring-primary'
                  )}
                >
                  <div className={cn('p-1.5 rounded shrink-0', eventColors[event.type])}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{event.title}</h4>
                      <div className="flex items-center gap-2 shrink-0">
                        {isToday ? (
                          <span className="text-xs font-bold text-primary">오늘</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {daysUntil > 0 ? `${daysUntil}일 후` : '지난 이벤트'}
                          </span>
                        )}
                        {event.impact === 'high' && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 font-medium">
                            중요
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{event.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(event.date, 'yyyy년 MM월 dd일 (EEE)', { locale: ko })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            이번 달 예정된 주요 시장 이벤트가 없습니다
          </p>
        )}
      </CardContent>
    </Card>
  );
}
