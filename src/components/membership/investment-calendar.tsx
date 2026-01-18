
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, StickyNote, Laugh, Smile, Frown, Angry } from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TradingJournal, type JournalEntry } from './trading-journal';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DailyData {
  date: string;
  pnl?: number;
  topCoins?: { ticker: string; img: string }[];
}

// Generate more realistic mock data
const generateMockData = (month: Date): DailyData[] => {
  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  });

  const coinPool = [
    {
      ticker: 'BTC',
      img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032',
    },
    {
      ticker: 'ETH',
      img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032',
    },
    {
      ticker: 'XRP',
      img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032',
    },
    {
      ticker: 'SOL',
      img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032',
    },
    {
      ticker: 'DOGE',
      img: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=032',
    },
  ];

  return days.map((day) => {
    const hasData = Math.random() > 0.3;
    if (!hasData) return { date: format(day, 'yyyy-MM-dd') };

    // Select random coins for the day
    const numCoins = Math.floor(Math.random() * 3) + 1; // 1 to 3 coins
    const shuffledCoins = [...coinPool].sort(() => 0.5 - Math.random());
    const topCoins = shuffledCoins.slice(0, numCoins);

    return {
      date: format(day, 'yyyy-MM-dd'),
      pnl: (Math.random() - 0.45) * 5000000,
      topCoins,
    };
  });
};

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

const moods = {
  ecstatic: { icon: Laugh, color: 'text-green-500' },
  happy: { icon: Smile, color: 'text-emerald-500' },
  neutral: { icon: Frown, color: 'text-yellow-500' },
  sad: { icon: Frown, color: 'text-orange-500' },
  angry: { icon: Angry, color: 'text-red-500' },
};


interface InvestmentCalendarProps {
  journalEntries: JournalEntry[];
  setJournalEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
}

export function InvestmentCalendar({ journalEntries, setJournalEntries }: InvestmentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0));
  const [isJournalOpen, setJournalOpen] = useState(false);
  const [selectedDateForJournal, setSelectedDateForJournal] = useState<Date | null>(null);

  const [monthlyData, setMonthlyData] = useState<DailyData[]>([]);
  const [totalPnl, setTotalPnl] = useState(0);
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
    const data = generateMockData(currentMonth);
    setMonthlyData(data);
    const pnl = data.reduce((acc, day) => acc + (day.pnl || 0), 0);
    setTotalPnl(pnl);
  }, [currentMonth]);


  const dataMap = useMemo(() => {
    return monthlyData.reduce((acc, day) => {
      acc[day.date] = day;
      return acc;
    }, {} as Record<string, DailyData>);
  }, [monthlyData]);
  
  const journalMap = useMemo(() => {
    return journalEntries.reduce((acc, entry) => {
      acc[entry.date] = entry;
      return acc;
    }, {} as Record<string, JournalEntry>);
  }, [journalEntries]);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { locale: ko });
  const endDate = endOfWeek(monthEnd, { locale: ko });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const handleDateClick = (day: Date) => {
    setSelectedDateForJournal(day);
    setJournalOpen(true);
  }

  const renderCellContent = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const data = dataMap[dateStr];
    if (!data) return null;

    const pnlValue = data.pnl;
    const topCoins = data.topCoins;

    return (
      <div className="flex flex-col items-center justify-between h-full w-full">
        {pnlValue !== undefined ? (
          <div
            className={cn(
              'text-xs font-semibold text-center',
              pnlValue > 0 && 'text-green-500',
              pnlValue < 0 && 'text-red-500'
            )}
          >
            {pnlValue > 0 ? '+' : ''}
            {formatKoreanCurrency(pnlValue)}
          </div>
        ) : (
          <div className="h-4"></div>
        )}

        {topCoins && topCoins.length > 0 ? (
          <div className="flex -space-x-2 justify-center items-center mt-auto">
            {topCoins.map((coin) => (
              <Avatar
                key={coin.ticker}
                className="w-6 h-6 border-2 border-background"
              >
                <AvatarImage src={coin.img} alt={coin.ticker} />
                <AvatarFallback>{coin.ticker[0]}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        ) : (
          <div className="h-6"></div>
        )}
      </div>
    );
  };

  const renderJournalIcon = (entry: JournalEntry | undefined) => {
    if (!entry) return null;
    if (entry.mood) {
      const MoodIcon = moods[entry.mood].icon;
      const color = moods[entry.mood].color;
      return <MoodIcon className={cn('absolute top-2 right-2 w-4 h-4', color)} />;
    }
    if (entry.memo) {
      return <StickyNote className="absolute top-2 right-2 w-3 h-3 text-yellow-600" />;
    }
    return null;
  }

  return (
    <Dialog open={isJournalOpen} onOpenChange={setJournalOpen}>
      <div>
        <div className="flex items-start justify-between p-6">
            <div>
              <h2 className="text-lg font-bold">멤버십 캘린더</h2>
              <p className="text-muted-foreground mt-2">
                날짜를 클릭해서 매매일지를 20일 이상 작성하고, 등급 승급 부스터를 받으세요!
              </p>
            </div>
            <div className="flex items-center gap-6 shrink-0">
              {monthlyData.length > 0 && (
               <div className="text-right">
                <p className="text-sm text-muted-foreground">이번 달 누적 수익</p>
                <p className={cn("text-lg font-bold", totalPnl > 0 ? "text-green-500" : "text-red-500")}>
                    {totalPnl > 0 ? '+' : ''}{formatKoreanCurrency(totalPnl)}
                </p>
               </div>
              )}
              <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevMonth}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold w-28 text-center">
                    {format(currentMonth, 'yyyy. MM')}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextMonth}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
              </div>
            </div>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-7 gap-px bg-border border-t border-l rounded-t-lg overflow-hidden">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center py-2 bg-muted text-muted-foreground text-sm font-semibold border-b border-r"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-border border-l">
            {days.map((day, index) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const data = dataMap[dateStr];
              const journalEntry = journalMap[dateStr];
              
              let cellBgColor = 'bg-card';
              if (data?.pnl !== undefined) {
                if (data.pnl > 500000) cellBgColor = 'bg-green-500/20';
                else if (data.pnl > 0) cellBgColor = 'bg-green-500/10';
                else if (data.pnl < -500000) cellBgColor = 'bg-red-500/20';
                else if (data.pnl < 0) cellBgColor = 'bg-red-500/10';
              }
              return (
                <DialogTrigger asChild key={index}>
                  <div
                    onClick={() => handleDateClick(day)}
                    className={cn(
                      'p-2 h-28 flex flex-col justify-start items-start border-b border-r cursor-pointer hover:bg-muted/50 transition-colors relative',
                      cellBgColor,
                      !isSameMonth(day, currentMonth) && 'bg-muted/50',
                      today && isSameDay(day, today) && 'relative'
                    )}
                  >
                    <span
                      className={cn(
                        'font-semibold mb-1',
                        !isSameMonth(day, currentMonth) &&
                          'text-muted-foreground/50'
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                    {today && isSameDay(day, today) && (
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full"></div>
                    )}
                    {renderJournalIcon(journalEntry)}
                    {isSameMonth(day, currentMonth) && renderCellContent(day)}
                  </div>
                </DialogTrigger>
              );
            })}
          </div>
        </div>
      </div>
      <DialogContent className="max-w-[480px] p-0">
        {selectedDateForJournal && (
          <>
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>{format(selectedDateForJournal, 'MM월 dd일')} 매매일지</DialogTitle>
            </DialogHeader>
            <TradingJournal 
                selectedDate={selectedDateForJournal}
                entries={journalEntries}
                setEntries={setJournalEntries}
                setJournalOpen={setJournalOpen}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

    