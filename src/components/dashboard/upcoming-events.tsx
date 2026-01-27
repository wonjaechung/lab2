
'use client';

import { useState, useRef, useEffect } from "react";
import { CalendarClock, AlertTriangle, TrendingUp, Info, ChevronRight, X, ChevronLeft, Calendar as CalendarIcon, ArrowLeft, Gift, ExternalLink, BarChart3, Wallet, BrainCircuit, History, Zap, HelpCircle } from "lucide-react";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EventItem {
  id: string;
  dDay: string; // e.g., "D-2", "D-5", "Today"
  date: string; // Display string like "01.08 (수)"
  dateIso: string; // ISO date string for calendar logic e.g., "2024-01-08"
  title: string;
  type: 'unlock' | 'upgrade' | 'macro' | 'listing' | 'bithumb';
  impact: 'high' | 'medium' | 'low';
  description: string;
  
  // Detailed Data
  time?: string;
  previous?: string;
  forecast?: string;
  actual?: string;
  insight?: string;
  relatedCoins?: { symbol: string, name: string, change?: string }[];
  history?: { date: string, value: string }[];
  tags?: string[];
  
  // New Fields
  scenarios?: { condition: string, sentiment: 'bullish' | 'bearish' | 'neutral', description: string }[];
  pastImpacts?: { date: string, event: string, change: string }[];
}

// Helper to calculate dateIso relative to today for demo purposes
const getFutureDateIso = (days: number) => {
  const today = new Date();
  return format(addDays(today, days), 'yyyy-MM-dd');
}

const UPCOMING_EVENTS: EventItem[] = [
  {
    id: '1',
    dDay: 'D-2',
    date: '01.08 (수)',
    dateIso: getFutureDateIso(2),
    title: '스택스(STX) 나카모토 업그레이드',
    type: 'upgrade',
    impact: 'high',
    description: '비트코인 레이어2 대장주의 대규모 업데이트 (호재)',
    time: '21:00',
    insight: '이번 업그레이드로 sBTC 도입과 비트코인 완결성이 강화됩니다. 스택스 생태계의 가장 중요한 마일스톤 중 하나로, 완료 시 TVL 증가가 기대됩니다.',
    relatedCoins: [{ symbol: 'STX', name: 'Stacks', change: '+5.2%' }, { symbol: 'ALEX', name: 'ALEX', change: '+12.4%' }],
    tags: ['메인넷', '하드포크', '호재']
  },
  {
    id: '2',
    dDay: 'D-4',
    date: '01.10 (금)',
    dateIso: getFutureDateIso(4),
    title: '미국 CPI (소비자물가지수) 발표',
    type: 'macro',
    impact: 'high',
    description: '예상치 상회 시 금리 인하 기대감 하락 주의',
    time: '22:30',
    previous: '3.1%',
    forecast: '3.2%',
    actual: '발표전',
    insight: '시장 예상치(3.2%)를 상회할 경우 연준의 금리 인하 시점이 지연될 수 있어 위험자산(코인)에 단기 악재로 작용할 수 있습니다. 반면 3.0% 이하로 발표 시 강한 반등이 예상됩니다.',
    history: [
        { date: '12월', value: '3.1%' },
        { date: '11월', value: '3.2%' },
        { date: '10월', value: '3.7%' }
    ],
    tags: ['인플레이션', '연준', '변동성확대'],
    scenarios: [
        { condition: '3.3% 이상 (쇼크)', sentiment: 'bearish', description: '금리 인하 기대감 소멸로 비트코인 급락 가능성' },
        { condition: '3.2% (부합)', sentiment: 'neutral', description: '불확실성 해소로 소폭 반등 혹은 횡보' },
        { condition: '3.1% 이하 (서프라이즈)', sentiment: 'bullish', description: '조기 금리 인하 기대감으로 강한 상승 랠리' }
    ],
    pastImpacts: [
        { date: '23.12.12', event: '예상치 부합', change: '+1.2%' },
        { date: '23.11.14', event: '예상치 하회', change: '+3.5%' },
        { date: '23.10.12', event: '예상치 상회', change: '-2.1%' }
    ]
  },
  {
    id: '3',
    dDay: 'D-7',
    date: '01.13 (월)',
    dateIso: getFutureDateIso(7),
    title: '솔라나(SOL) 대규모 락업 해제',
    type: 'unlock',
    impact: 'medium',
    description: '약 3,000억원 규모 물량 풀림 (매도 주의)',
    time: '09:00',
    insight: '전체 유통량의 2.5%에 해당하는 물량이 해제됩니다. 과거 패턴상 락업 해제 2-3일 전부터 가격 약세를 보이다가, 해제 직후 불확실성 해소로 반등하는 경향이 있었습니다.',
    previous: '34.2M SOL',
    forecast: '34.2M SOL',
    relatedCoins: [{ symbol: 'SOL', name: 'Solana', change: '-2.1%' }],
    tags: ['공급과잉', 'VC물량', '단기악재']
  },
  {
    id: '4',
    dDay: 'D-12',
    date: '01.18 (토)',
    dateIso: getFutureDateIso(12),
    title: '이더리움 덴쿤 업그레이드 (테스트넷)',
    type: 'upgrade',
    impact: 'medium',
    description: '가스비 절감을 위한 핵심 업데이트 테스트',
    insight: '레이어2 가스비를 획기적으로 낮추는 EIP-4844가 포함된 핵심 업그레이드입니다. 성공 시 L2 코인(OP, ARB)들의 수혜가 예상됩니다.',
    relatedCoins: [{ symbol: 'ETH', name: 'Ethereum' }, { symbol: 'OP', name: 'Optimism' }, { symbol: 'ARB', name: 'Arbitrum' }],
    tags: ['L2', '가스비절감', 'EIP-4844']
  },
  {
    id: '5',
    dDay: 'D-15',
    date: '01.21 (화)',
    dateIso: getFutureDateIso(15),
    title: 'FOMC 의사록 공개',
    type: 'macro',
    impact: 'high',
    description: '연준 위원들의 향후 금리 방향성 확인',
    time: '04:00',
    insight: '지난 회의에서의 위원들 간 구체적인 발언 내용이 공개됩니다. 매파적(긴축 선호) 발언이 많았을 경우 시장 분위기가 냉각될 수 있습니다.',
    tags: ['금리', '파월', '매크로']
  },
  {
    id: '6',
    dDay: 'D-1',
    date: '01.09 (목)',
    dateIso: getFutureDateIso(1),
    title: '빗썸 거래왕 이벤트',
    type: 'bithumb',
    impact: 'low',
    description: '수수료 무료 이벤트 종료 임박',
    insight: '빗썸 거래왕 이벤트가 곧 종료됩니다. 포인트 적립 및 경품 응모 마감을 확인하세요.',
    tags: ['이벤트', '에어드랍', '수수료']
  },
  {
    id: '7',
    dDay: 'D-5',
    date: '01.11 (토)',
    dateIso: getFutureDateIso(5),
    title: '미국 고용지표 (NFP) 발표',
    type: 'macro',
    impact: 'high',
    description: '비농업 고용지표 발표, 금리 정책에 영향',
    time: '22:30',
    previous: '216K',
    forecast: '180K',
    actual: '발표전',
    insight: '고용 증가세가 둔화되면 연준의 금리 인하 가능성이 높아져 위험자산에 긍정적 영향을 미칠 수 있습니다.',
    tags: ['고용', '연준', '금리정책']
  },
  {
    id: '8',
    dDay: 'D-10',
    date: '01.16 (목)',
    dateIso: getFutureDateIso(10),
    title: '연준 금리 결정 발표',
    type: 'macro',
    impact: 'high',
    description: '연준 FOMC 금리 결정 및 파월 의장 기자회견',
    time: '04:00',
    previous: '5.25-5.50%',
    forecast: '5.25-5.50%',
    actual: '발표전',
    insight: '금리 동결이 예상되지만, 파월 의장의 향후 금리 인하 시그널에 주목해야 합니다. 인하 시그널이 강할수록 암호화폐 시장에 긍정적입니다.',
    tags: ['금리', 'FOMC', '파월']
  }
];

interface UpcomingEventsProps {
  isDialogOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showFullCalendar?: boolean;
  initialEventId?: string;
}

const getTypeLabel = (type: EventItem['type']) => {
  switch (type) {
    case 'unlock': return '락업해제';
    case 'upgrade': return '호재 이슈';
    case 'macro': return '경제 지표';
    case 'listing': return '신규 상장';
    case 'bithumb': return '빗썸 이벤트';
  }
};

const getTypeColor = (type: EventItem['type']) => {
  switch (type) {
    case 'unlock': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'upgrade': return 'bg-red-100 text-red-700 border-red-200';
    case 'macro': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'bithumb': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

const EventDetailView = ({ event, onBack }: { event: EventItem, onBack: () => void }) => {
  // 락업해제 타입일 때 표시할 데이터 (이미지와 동일한 Solana 데이터)
  const getUnlockData = (event: EventItem) => {
    // 이미지와 동일하게 Solana 데이터 사용
    const coinName = 'Solana';
    const coinSymbol = 'SOL';
    const currentPrice = 245000; // 현재가 245,000원
    const unlockAmountValue = 34200000; // 해제 물량 34,200,000 SOL
    const unlockAmount = '34,200,000 SOL';
    const amountInKRW = unlockAmountValue * currentPrice; // 금액 규모
    const circulatingSupply = 460000000; // 현재 유통량 4.6억개
    const totalSupply = 580000000; // 총 발행량 5.8억개
    const ratioToCirculating = 7.43; // 유통량 대비 비율 7.43%
    const circulatingRatio = 79.5; // 현재 유통 비율 79.5%
    
    return {
      coinName,
      coinSymbol,
      currentPrice,
      unlockAmount,
      unlockAmountValue,
      amountInKRW,
      circulatingSupply,
      totalSupply,
      ratioToCirculating,
      circulatingRatio
    };
  };

  const isUnlockType = event.type === 'unlock';
  const unlockData = isUnlockType ? getUnlockData(event) : null;

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b shrink-0 bg-background z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 -ml-1 hover:bg-muted rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', getTypeColor(event.type))}>
                {getTypeLabel(event.type)}
            </span>
            <span className="text-xs text-muted-foreground">
                {(() => {
                  const eventDate = parseISO(event.dateIso);
                  const month = format(eventDate, 'M', { locale: ko });
                  const day = format(eventDate, 'd', { locale: ko });
                  if (event.time) {
                    const [hourStr] = event.time.split(':');
                    const hour = parseInt(hourStr);
                    const period = hour < 12 ? '오전' : '오후';
                    const displayHour = hour <= 12 ? hour : hour - 12;
                    return `${month}월 ${day}일 ${period} ${displayHour}시`;
                  }
                  return `${month}월 ${day}일`;
                })()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
            {isUnlockType && unlockData ? (
              <>
                {/* 헤더: 코인명, 현재가, 유통량 대비 비율 */}
                <div className="flex items-start justify-between mb-6">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-bold">{unlockData.coinName} ({unlockData.coinSymbol})</h2>
                    <p className="text-base text-foreground">현재가 {unlockData.currentPrice.toLocaleString()}원</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground mb-1">유통량 대비 비율</p>
                    <p className="text-2xl font-bold text-red-500">{unlockData.ratioToCirculating.toFixed(2)}%</p>
                  </div>
                </div>

                {/* 해제 물량과 금액 규모 카드 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-5 bg-white dark:bg-card rounded-xl border border-border/50">
                    <div className="text-sm text-foreground mb-3">해제 물량</div>
                    <div className="text-3xl font-bold text-foreground">{unlockData.unlockAmount}</div>
                  </div>
                  <div className="p-5 bg-white dark:bg-card rounded-xl border border-border/50">
                    <div className="text-sm text-foreground mb-3">금액 규모</div>
                    <div className="text-3xl font-bold text-foreground">≈ {(unlockData.amountInKRW / 100000000).toFixed(1)}억원</div>
                  </div>
                </div>

                {/* 현재 유통 비율 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">현재 유통 비율</span>
                    <span className="text-xl font-bold text-foreground">{unlockData.circulatingRatio.toFixed(1)}%</span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-orange-500 transition-all"
                      style={{ width: `${unlockData.circulatingRatio}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-foreground">
                    <span>현재 유통량 {(unlockData.circulatingSupply / 100000000).toFixed(1)}억개</span>
                    <span>총 발행량 {(unlockData.totalSupply / 100000000).toFixed(1)}억개</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                    <h2 className="text-xl leading-snug font-bold">{event.title}</h2>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
                {(event.previous || event.forecast) && (
                    <div className="grid grid-cols-3 gap-2 p-3 bg-secondary/30 rounded-xl border border-border/50">
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-xs text-muted-foreground">이전</span>
                            <span className="text-sm font-semibold">{event.previous || '-'}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 border-l border-r border-border/50">
                            <span className="text-xs text-muted-foreground">예상</span>
                            <span className="text-sm font-semibold">{event.forecast || '-'}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-xs text-primary font-bold">실제</span>
                            <span className="text-sm font-bold text-primary">{event.actual || '대기'}</span>
                        </div>
                    </div>
                )}

                {event.insight && event.type !== 'bithumb' && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-bold flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4 text-purple-500" />
                            AI 요약
                        </h4>
                        <div className="p-3.5 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-xl">
                            <p className="text-sm leading-relaxed text-foreground/90">
                                {event.insight}
                            </p>
                        </div>
                    </div>
                )}
              </>
            )}
            
            {event.scenarios && (
                <div className="space-y-2">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        시장 대응 시나리오
                    </h4>
                    <div className="space-y-2">
                        {event.scenarios.map((scenario, idx) => (
                            <div key={idx} className="flex gap-3 p-3 bg-secondary/20 rounded-lg border border-border/50">
                                <div className={cn('shrink-0 w-1.5 rounded-full',
                                    scenario.sentiment === 'bullish' ? 'bg-red-500' : 
                                    scenario.sentiment === 'bearish' ? 'bg-blue-500' : 'bg-slate-400'
                                )} />
                                <div className="space-y-1">
                                    <div className="text-xs font-bold flex items-center gap-2">
                                        {scenario.condition}
                                        <Badge variant="outline" className={cn('text-[10px] h-5 px-1.5',
                                            scenario.sentiment === 'bullish' ? 'text-red-600 bg-red-50 border-red-200' : 
                                            scenario.sentiment === 'bearish' ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-slate-600'
                                        )}>
                                            {scenario.sentiment === 'bullish' ? '호재' : scenario.sentiment === 'bearish' ? '악재' : '중립'}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-snug">
                                        {scenario.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {event.pastImpacts && (
                <div className="space-y-2">
                      <h4 className="text-sm font-bold flex items-center gap-2">
                        <History className="w-4 h-4 text-blue-500" />
                        과거 시장 임팩트
                    </h4>
                    <div className="border border-border rounded-xl overflow-hidden text-xs">
                        <div className="grid grid-cols-3 bg-muted/50 p-2 font-medium text-center border-b border-border">
                            <div>발표일</div>
                            <div>결과</div>
                            <div>가격변동</div>
                        </div>
                        {event.pastImpacts.map((impact, idx) => (
                            <div key={idx} className="grid grid-cols-3 p-2 text-center border-b border-border/50 last:border-0">
                                <div className="text-muted-foreground">{impact.date}</div>
                                <div>{impact.event}</div>
                                <div className={cn(impact.change.startsWith('+') ? 'text-red-500 font-bold' : 'text-blue-500 font-bold')}>
                                    {impact.change}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 락업해제 타입이 아닐 때만 관련 코인과 해시태그 표시 */}
            {!isUnlockType && event.relatedCoins && event.type !== 'macro' && (
                <div className="space-y-2">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-muted-foreground" />
                        관련 코인
                    </h4>
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {event.relatedCoins.map(coin => (
                            <div key={coin.symbol} className="flex items-center gap-2 p-2.5 bg-card border rounded-lg min-w-[120px]">
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-xs">
                                    {coin.symbol[0]}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold">{coin.symbol}</span>
                                    {coin.change && (
                                        <span className={cn('text-[10px] font-medium', coin.change.startsWith('+') ? 'text-red-500' : 'text-blue-500')}>
                                            {coin.change}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {!isUnlockType && event.tags && event.type !== 'bithumb' && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {event.tags.map(tag => (
                        <span key={tag} className="text-[11px] text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                            #{tag}
                        </span>
                    ))}
                  </div>
            )}
        </div>
        {event.type !== 'bithumb' && (
          <div className="p-4 border-t sticky bottom-0 bg-background">
              <Button className="w-full gap-2" variant="default">
                  <ExternalLink className="w-4 h-4" />
                  상세 뉴스/공시 보러가기
              </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export function UpcomingEvents({ isDialogOpen: externalOpen, onOpenChange, showFullCalendar = false, initialEventId }: UpcomingEventsProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isDialogOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsDialogOpen = onOpenChange || setInternalOpen;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [activeTab, setActiveTab] = useState("all");
  
  // Detail Drawer State
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  
  // Refs for scrolling logic
  const scrollRef = useRef<HTMLDivElement>(null);
  const eventRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  // Set initial event if initialEventId is provided
  useEffect(() => {
    if (initialEventId && isDialogOpen) {
      const event = UPCOMING_EVENTS.find(e => e.id === initialEventId);
      if (event) {
        setSelectedEvent(event);
      }
    } else if (!initialEventId && isDialogOpen) {
      // Reset to full calendar view when dialog opens without initialEventId
      setSelectedEvent(null);
    }
  }, [initialEventId, isDialogOpen]);

  // Filter events based on active tab (호재 이슈 제외)
  const filteredEventsList = UPCOMING_EVENTS.filter(event => {
    // 호재 이슈(upgrade) 타입 제외
    if (event.type === 'upgrade') return false;
    
    if (activeTab === 'all') return true;
    if (activeTab === 'macro') return event.type === 'macro';
    if (activeTab === 'unlock') return event.type === 'unlock';
    if (activeTab === 'bithumb') return event.type === 'bithumb';
    return true;
  });

  // Group events by date for the full view
  const groupedEvents = filteredEventsList.reduce((acc, event) => {
    if (!acc[event.dateIso]) {
      acc[event.dateIso] = [];
    }
    acc[event.dateIso].push(event);
    return acc;
  }, {} as Record<string, EventItem[]>);

  // Handle scroll to sync calendar strip (simplified since strip is gone, but still good to track date)
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      
      const scrollPosition = scrollRef.current.scrollTop;
      const headers = Object.keys(eventRefs.current).map(dateIso => ({
        dateIso,
        element: eventRefs.current[dateIso]
      })).filter(item => item.element);


      // Find the header that is currently closest to the top
      let currentVisibleDate = headers[0]?.dateIso;

      for (const { dateIso, element } of headers) {
        if (element && element.offsetTop <= scrollPosition + 100) { 
           currentVisibleDate = dateIso;
        }
      }

      if (currentVisibleDate) {
        const newDate = parseISO(currentVisibleDate);
        if (selectedDate && !isSameDay(newDate, selectedDate)) {
            setSelectedDate(newDate);
        }
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
        scrollElement.addEventListener('scroll', handleScroll);
    }
    
    return () => {
        if (scrollElement) {
            scrollElement.removeEventListener('scroll', handleScroll);
        }
    };
  }, [selectedDate, groupedEvents]); 

  // Function to scroll to specific date
  const scrollToDate = (date: Date) => {
    setSelectedDate(date);
    const dateIso = format(date, 'yyyy-MM-dd');
    const element = eventRefs.current[dateIso];
    if (element && scrollRef.current) {
        scrollRef.current.scrollTo({
            top: element.offsetTop - 150, // Adjust for padding + header
            behavior: 'smooth'
        });
    }
  };

  const FullCalendarView = () => (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b shrink-0 bg-background z-20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsDialogOpen(false)} className="p-1 -ml-1 hover:bg-muted rounded-full">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold">
              주요 일정 캘린더
            </h2>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 hover:bg-muted rounded-full">
                <CalendarIcon className="w-5 h-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    scrollToDate(date);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
  
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start h-9 p-0 bg-transparent gap-2 overflow-x-auto no-scrollbar">
            <TabsTrigger
              value="all"
              className="rounded-full border border-border bg-background px-3 py-1 text-xs data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:border-transparent"
            >
              전체
            </TabsTrigger>
            <TabsTrigger
              value="macro"
              className="rounded-full border border-border bg-background px-3 py-1 text-xs data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:border-transparent"
            >
              경제지표
            </TabsTrigger>
            <TabsTrigger
              value="unlock"
              className="rounded-full border border-border bg-background px-3 py-1 text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:border-transparent"
            >
              락업해제
            </TabsTrigger>
            <TabsTrigger
              value="bithumb"
              className="rounded-full border border-border bg-background px-3 py-1 text-xs data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:border-transparent"
            >
              빗썸이벤트
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
  
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-8 scroll-smooth"
      >
        {Object.keys(groupedEvents).length > 0 ? Object.keys(groupedEvents).sort().map((dateIso) => {
          const date = parseISO(dateIso);
          const dayEvents = groupedEvents[dateIso];
  
          return (
            <div
              key={dateIso}
              ref={(el) => { eventRefs.current[dateIso] = el; }}
              className="scroll-mt-[130px]" // Adjusted scroll margin for header height
            >
              <h4 className="text-sm font-bold text-foreground mb-3 px-1 flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                {format(date, 'M월 d일 EEEE', { locale: ko })}
                <span className="text-xs font-normal text-muted-foreground">일정 {dayEvents.length}개</span>
              </h4>
  
              <div className="space-y-3">
                {dayEvents.map((event) => {
                  // 미국 CPI(id: '2')와 솔라나 락업해제(id: '3')만 클릭 가능
                  const isClickable = event.id === '2' || event.id === '3';
                  
                  return (
                  <div
                    key={event.id}
                    className={cn(
                      "flex items-start gap-3 p-3 bg-card border border-border rounded-xl shadow-sm transition-transform",
                      isClickable ? "cursor-pointer active:scale-[0.98]" : "cursor-default"
                    )}
                    onClick={isClickable ? () => setSelectedEvent(event) : undefined}
                  >
                    <div className={cn('flex flex-col items-center justify-center w-10 h-10 rounded-lg border shrink-0 bg-opacity-10 border-opacity-20', getTypeColor(event.type))}>
                      {event.type === 'upgrade' && <TrendingUp className="w-5 h-5" />}
                      {event.type === 'macro' && <CalendarClock className="w-5 h-5" />}
                      {event.type === 'unlock' && <AlertTriangle className="w-5 h-5" />}
                      {event.type === 'listing' && <Info className="w-5 h-5" />}
                      {event.type === 'bithumb' && <Gift className="w-5 h-5" />}
                    </div>
  
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', getTypeColor(event.type))}>
                            {getTypeLabel(event.type)}
                          </span>
                          {event.time && (() => {
                            const [hourStr] = event.time.split(':');
                            const hour = parseInt(hourStr);
                            const period = hour < 12 ? '오전' : '오후';
                            const displayHour = hour <= 12 ? hour : hour - 12;
                            return <span className="text-[11px] text-muted-foreground">{period} {displayHour}시</span>;
                          })()}
                        </div>
                      </div>
                      <h4 className="text-[13px] font-bold leading-tight mb-1">
                        {event.title}
                      </h4>
                      <p className="text-[12px] text-muted-foreground leading-snug">
                        {event.description}
                      </p>
                    </div>
                    {isClickable && <ChevronRight className="w-4 h-4 text-muted-foreground/50 self-center" />}
                  </div>
                  );
                })}
              </div>
            </div>
          );
        }) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/60 mt-8">
            <CalendarClock className="w-10 h-10 mb-3 opacity-50" />
            <p className="text-sm font-medium">해당하는 일정이 없습니다.</p>
          </div>
        )}
  
        <div className="h-20" />
      </div>
    </div>
  );

  return (
    <>
      {!showFullCalendar && (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold flex items-center gap-1.5">
            주요 일정
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs p-3 max-w-[240px] bg-popover/95 backdrop-blur-sm border-border/50 shadow-xl">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                        <div>
                            <div className="font-bold text-foreground">호재 이슈</div>
                            <p className="text-muted-foreground leading-snug mt-0.5">시장 가격 상승에 긍정적인 영향을 줄 수 있는 재료입니다.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                        <div>
                            <div className="font-bold text-foreground">경제 지표</div>
                            <p className="text-muted-foreground leading-snug mt-0.5">금리, 인플레이션 등 거시 경제 흐름을 보여주는 지표입니다.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
                        <div>
                            <div className="font-bold text-foreground">락업해제</div>
                            <p className="text-muted-foreground leading-snug mt-0.5">대규모 락업 해제 등 매도 압력이 커질 수 있는 일정입니다.</p>
                        </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h3>
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5"
          >
            전체보기
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-1.5">
          {UPCOMING_EVENTS.slice(0, 3).map((event) => {
            // 미국 CPI(id: '2')와 솔라나 락업해제(id: '3')만 클릭 가능
            const isClickable = event.id === '2' || event.id === '3';
            
            return (
            <div 
              key={event.id}
              className={cn(
                "flex items-center gap-2.5 p-2 bg-card border border-border rounded-lg shadow-sm transition-colors",
                isClickable ? "hover:bg-muted/30 cursor-pointer" : "cursor-default"
              )}
              onClick={isClickable ? () => {
                setSelectedEvent(event);
                setIsDialogOpen(true);
              } : undefined}
            >
              <div className={cn('flex flex-col items-center justify-center w-8 h-8 rounded-md border shrink-0', event.dDay === 'Today' ? 'bg-red-500 border-red-600 text-white' : 'bg-secondary border-border')}>
                <span className={cn('text-[10px] font-bold', event.dDay === 'Today' ? 'text-white' : 'text-foreground')}>
                  {event.dDay}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={cn('text-[9px] font-bold px-1 py-px rounded border', getTypeColor(event.type))}>
                    {getTypeLabel(event.type)}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {event.date}
                  </span>
                </div>
                
                <h4 className="text-[12px] font-bold truncate leading-tight mb-0.5">
                  {event.title}
                </h4>
              </div>
            </div>
            );
          })}
        </div>
      </div>
      )}

      {showFullCalendar && (
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setSelectedEvent(null);
          }
        }}>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
            <DialogHeader className="sr-only">
              <DialogTitle>
                {selectedEvent ? selectedEvent.title : '주요 일정 캘린더'}
              </DialogTitle>
            </DialogHeader>
            {selectedEvent ? (
              <EventDetailView event={selectedEvent} onBack={() => setSelectedEvent(null)} />
            ) : (
              <FullCalendarView />
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

    
