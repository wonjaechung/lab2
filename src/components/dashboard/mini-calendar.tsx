'use client';

import { useState, useMemo } from 'react';
import { CalendarClock, ChevronRight, TrendingUp, AlertTriangle, Info, Gift, Globe } from 'lucide-react';
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO, addDays, startOfDay, isAfter, isBefore, differenceInDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UpcomingEvents } from './upcoming-events';

// upcoming-events.tsx에서 가져온 데이터 구조
interface EventItem {
  id: string;
  dDay: string;
  date: string;
  dateIso: string;
  title: string;
  type: 'unlock' | 'upgrade' | 'macro' | 'listing' | 'bithumb';
  impact: 'high' | 'medium' | 'low';
  description: string;
}

const getFutureDateIso = (days: number) => {
  const today = new Date();
  return format(addDays(today, days), 'yyyy-MM-dd');
};

const UPCOMING_EVENTS: EventItem[] = [
  {
    id: '1',
    dDay: 'D-2',
    date: '01.28 (수)',
    dateIso: getFutureDateIso(2),
    title: '스택스(STX) 나카모토 업그레이드',
    type: 'upgrade',
    impact: 'high',
    description: '비트코인 레이어2 대장주의 대규모 업데이트 (호재)',
  },
  {
    id: '2',
    dDay: 'D-4',
    date: '01.30 (금)',
    dateIso: getFutureDateIso(4),
    title: '미국 CPI (소비자물가지수) 발표',
    type: 'macro',
    impact: 'high',
    description: '예상치 상회 시 금리 인하 기대감 하락 주의',
  },
  {
    id: '3',
    dDay: 'D-7',
    date: '02.02 (월)',
    dateIso: getFutureDateIso(7),
    title: '솔라나(SOL) 대규모 락업 해제',
    type: 'unlock',
    impact: 'medium',
    description: '약 3,000억원 규모 물량 풀림 (매도 주의)',
  },
  {
    id: '6',
    dDay: 'D-1',
    date: '01.27 (화)',
    dateIso: getFutureDateIso(1),
    title: '빗썸 거래왕 이벤트',
    type: 'bithumb',
    impact: 'low',
    description: '수수료 무료 이벤트 종료 임박',
  }
];

interface EventItemWithTime extends EventItem {
  time?: string;
}

// 이벤트 타입별 아이콘
const getEventIcon = (type: EventItem['type']) => {
  switch (type) {
    case 'unlock': return AlertTriangle;
    case 'upgrade': return TrendingUp;
    case 'macro': return Globe;
    case 'listing': return Info;
    case 'bithumb': return Gift;
    default: return CalendarClock;
  }
};

// 이벤트 타입별 아이콘 색상
const getIconColor = (type: EventItem['type']) => {
  switch (type) {
    case 'unlock': return 'text-orange-500';
    case 'upgrade': return 'text-red-500';
    case 'macro': return 'text-blue-500';
    case 'listing': return 'text-green-500';
    case 'bithumb': return 'text-indigo-500';
    default: return 'text-muted-foreground';
  }
};

// D-Day 계산
const getDDay = (dateIso: string) => {
  const today = startOfDay(new Date());
  const eventDate = startOfDay(parseISO(dateIso));
  const diff = differenceInDays(eventDate, today);
  
  if (diff < 0) return null;
  if (diff === 0) return 'D-Day';
  if (diff === 1) return 'D-1';
  return `D-${diff}`;
};


type FilterType = 'all' | 'macro' | 'unlock' | 'bithumb';

export function MiniCalendar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  const [filter, setFilter] = useState<FilterType>('all');
  
  // 이번 주에 있는 이벤트 필터링 (오늘부터 7일 이내, 호재 이슈 제외)
  const thisWeekEvents = useMemo(() => {
    const today = startOfDay(new Date());
    const endDate = addDays(today, 7);
    
    return UPCOMING_EVENTS.filter(event => {
      // 호재 이슈(upgrade) 타입 제외
      if (event.type === 'upgrade') {
        return false;
      }
      
      // 필터 적용
      if (filter !== 'all' && event.type !== filter) {
        return false;
      }
      
      try {
        const eventDate = startOfDay(parseISO(event.dateIso));
        // 오늘부터 7일 이내의 이벤트만 표시
        return (isAfter(eventDate, today) || eventDate.getTime() === today.getTime()) && 
               (isBefore(eventDate, endDate) || eventDate.getTime() === endDate.getTime());
      } catch {
        return false;
      }
    }).sort((a, b) => {
      try {
        const dateA = parseISO(a.dateIso);
        const dateB = parseISO(b.dateIso);
        return dateA.getTime() - dateB.getTime();
      } catch {
        return 0;
      }
    });
  }, [filter]);

  return (
    <>
      <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col w-full">
        <CardHeader className="pb-3 flex-shrink-0">
          <button
            onClick={() => {
              setSelectedEventId(undefined);
              setIsDialogOpen(true);
            }}
            className="flex items-center justify-between w-full group"
          >
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-foreground/80 transition-colors">
              이번주 주요 일정
            </CardTitle>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </CardHeader>
        <CardContent className="pt-0 flex-1 flex flex-col min-h-0">
          {/* 필터 버튼 */}
          <div className="flex gap-1.5 mb-3 pb-3 border-b border-border/50">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'px-2 py-1 rounded-md text-[10px] font-medium transition-colors',
                filter === 'all'
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              전체
            </button>
            <button
              onClick={() => setFilter('macro')}
              className={cn(
                'px-2 py-1 rounded-md text-[10px] font-medium transition-colors',
                filter === 'macro'
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              경제지표
            </button>
            <button
              onClick={() => setFilter('unlock')}
              className={cn(
                'px-2 py-1 rounded-md text-[10px] font-medium transition-colors',
                filter === 'unlock'
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              락업해제
            </button>
            <button
              onClick={() => setFilter('bithumb')}
              className={cn(
                'px-2 py-1 rounded-md text-[10px] font-medium transition-colors',
                filter === 'bithumb'
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              빗썸이벤트
            </button>
          </div>
          
          {/* 이번 주 이벤트 리스트 */}
          {thisWeekEvents.length > 0 ? (
            <div className="space-y-1 flex-1 overflow-y-auto">
              {thisWeekEvents.map((event) => {
                const eventDate = parseISO(event.dateIso);
                const month = format(eventDate, 'M', { locale: ko });
                const day = format(eventDate, 'd', { locale: ko });
                const dayOfWeek = format(eventDate, 'EEE', { locale: ko });
                const timeStr = '09:00'; // 기본 시간, 실제 데이터에 time 필드가 있으면 사용
                const hour = parseInt(timeStr.split(':')[0]);
                const period = hour < 12 ? '오전' : '오후';
                const displayHour = hour <= 12 ? hour : hour - 12;
                const displayTime = `${period} ${displayHour}시`;
                const dDay = getDDay(event.dateIso);
                
                return (
                  <button
                    key={event.id}
                    onClick={() => {
                      setSelectedEventId(event.id);
                      setIsDialogOpen(true);
                    }}
                    className="w-full flex items-start gap-2.5 px-3 py-2 hover:bg-muted/40 transition-all group/item border-b border-border/50 last:border-0 rounded-md hover:shadow-sm relative"
                  >
                    {/* 타입별 색상 바 */}
                    <div className={cn(
                      'absolute left-0 top-0 bottom-0 w-1 rounded-l-md',
                      event.type === 'unlock' && 'bg-orange-500',
                      event.type === 'macro' && 'bg-blue-500',
                      event.type === 'bithumb' && 'bg-indigo-500',
                      event.type === 'listing' && 'bg-green-500',
                      event.type === 'upgrade' && 'bg-red-500'
                    )} />
                    
                    {/* 날짜 - 큰 숫자로 강조 */}
                    <div className="shrink-0 text-center min-w-[50px] bg-muted/30 rounded-md py-1 px-2">
                      <div className="text-base font-bold text-foreground leading-none">
                        {day}
                      </div>
                      <div className="text-[9px] text-muted-foreground mt-0.5 font-medium">
                        {month}월
                      </div>
                    </div>
                    
                    {/* 이벤트 정보 */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      {/* 제목 */}
                      <p className="text-xs font-semibold text-foreground leading-tight mb-1 group-hover/item:text-foreground/80 transition-colors text-left">
                        {event.title}
                      </p>
                      
                      {/* 날짜와 시간 */}
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <span className="font-medium">{dayOfWeek}</span>
                        <span>•</span>
                        <span>{displayTime}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-muted-foreground flex-1 flex items-center justify-center">
              이번 주 예정된 일정이 없습니다.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-lg font-bold sr-only">
              주요 일정 캘린더
            </DialogTitle>
          </DialogHeader>
          <UpcomingEvents 
            isDialogOpen={isDialogOpen} 
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setSelectedEventId(undefined);
              }
            }} 
            showFullCalendar={true}
            initialEventId={selectedEventId}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
