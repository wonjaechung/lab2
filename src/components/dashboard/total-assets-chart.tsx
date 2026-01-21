"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, ChevronRight, ArrowRight } from "lucide-react"
import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts"

type HistoryPeriod = "1W" | "1M" | "3M" | "6M" | "1Y"

const HISTORY_PERIODS: Array<{ label: string; value: HistoryPeriod }> = [
  { label: "1W", value: "1W" },
  { label: "1M", value: "1M" },
  { label: "3M", value: "3M" },
  { label: "6M", value: "6M" },
  { label: "1Y", value: "1Y" },
]

function PeriodSelector({
  value,
  onChange,
}: {
  value: HistoryPeriod
  onChange: (next: HistoryPeriod) => void
}) {
  return (
    <div className="inline-flex rounded-lg bg-muted p-1">
      {HISTORY_PERIODS.map((p) => (
        <button
          key={p.value}
          type="button"
          onClick={() => onChange(p.value)}
          className={cn(
            "px-2.5 py-1 text-xs font-semibold rounded-md transition-colors",
            value === p.value
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

// Fear & Greed Index: 0-100
const fearGreedIndex = 48;
const fearGreedHistory = {
    lastWeek: 45,
    lastMonth: 42,
};
const getFearGreedSentiment = (index: number) => {
    if (index <= 20) return { text: "극심한 공포", color: "text-red-500", progressColor: "stroke-red-500" };
    if (index <= 45) return { text: "공포", color: "text-orange-500", progressColor: "stroke-orange-500" };
    if (index <= 55) return { text: "중립", color: "text-yellow-500", progressColor: "stroke-yellow-500" };
    if (index <= 80) return { text: "탐욕", color: "text-green-500", progressColor: "stroke-green-500" };
    return { text: "극심한 탐욕", color: "text-green-600", progressColor: "stroke-green-600" };
}

// Altcoin Season Index: 0-100 (0: Bitcoin season, 100: Altcoin season)
const altcoinIndex = 22;
const altcoinHistory = {
    lastWeek: 20,
    lastMonth: 18,
};
const getIndexSentiment = (index: number) => {
    if (index <= 25) return { text: "비트코인 시즌", color: "text-green-500", progressColor: "stroke-green-500" };
    if (index <= 75) return { text: "중립", color: "text-yellow-500", progressColor: "stroke-yellow-500" };
    return { text: "알트코인 시즌", color: "text-red-500", progressColor: "stroke-red-500" };
}

const dominanceData = {
    btc: { value: 58.4, change: -0.33, color: "bg-primary" },
    eth: { value: 12.1, change: -0.37, color: "bg-purple-500" },
    others: { value: 29.5, change: 0.7, color: "bg-gray-400" },
    history: {
        lastWeek: { btc: 58.6, eth: 12.2, others: 29.2 },
        lastMonth: { btc: 58.8, eth: 12.4, others: 28.7 },
    }
}

const DominanceItem = ({ label, value, change, color }: { label: string, value: number, change: number, color: string }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="text-sm text-muted-foreground flex items-center gap-1.5 mb-1">
                <div className={cn("w-2 h-2 rounded-full", color)}></div>
                {label}
            </div>
            <div className="text-2xl font-bold text-foreground">{value.toFixed(1)}%</div>
        </div>
    )
};

const DominanceHistoryItem = ({ label, data }: { label: string, data: { btc: number, eth: number, others: number } }) => {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">
                     <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032" alt="Bitcoin" className="w-4 h-4" />
                    <span>{data.btc.toFixed(1)}%</span>
                </div>
                 <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-500/10 text-purple-500 font-bold text-xs">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 1.75l-6.25 10.5L12 16.5l6.25-4.25L12 1.75zM5.75 13.5L12 22.25l6.25-8.75L12 17.75l-6.25-4.25z"/></svg>
                    <span>{data.eth.toFixed(1)}%</span>
                </div>
                 <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-400/10 text-gray-400 font-bold text-xs">
                    <span>...</span>
                    <span>{data.others.toFixed(1)}%</span>
                </div>
            </div>
        </div>
    )
}

const IndexHistoryItem = ({ label, value }: { label: string, value: number }) => {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">{label}</span>
            <span className="text-sm font-bold text-foreground">{value}</span>
        </div>
    )
}

// 과거 추이 데이터 (예시) - 기간 선택용
const fearGreedHistoryByPeriod: Record<HistoryPeriod, Array<{ period: string; value: number }>> = {
  "1W": [
    { period: "D-6", value: 44 },
    { period: "D-5", value: 41 },
    { period: "D-4", value: 43 },
    { period: "D-3", value: 46 },
    { period: "D-2", value: 45 },
    { period: "D-1", value: 47 },
    { period: "Now", value: 48 },
  ],
  "1M": [
    { period: "4W", value: 38 },
    { period: "3W", value: 42 },
    { period: "2W", value: 44 },
    { period: "1W", value: 45 },
    { period: "Now", value: 48 },
  ],
  "3M": [
    { period: "3M", value: 35 },
    { period: "2M", value: 42 },
    { period: "6W", value: 43 },
    { period: "4W", value: 44 },
    { period: "1W", value: 45 },
    { period: "Now", value: 48 },
  ],
  "6M": [
    { period: "6M", value: 28 },
    { period: "5M", value: 33 },
    { period: "4M", value: 37 },
    { period: "3M", value: 35 },
    { period: "2M", value: 42 },
    { period: "1M", value: 45 },
    { period: "Now", value: 48 },
  ],
  "1Y": [
    { period: "12M", value: 30 },
    { period: "10M", value: 26 },
    { period: "8M", value: 34 },
    { period: "6M", value: 28 },
    { period: "4M", value: 37 },
    { period: "3M", value: 35 },
    { period: "2M", value: 42 },
    { period: "1M", value: 45 },
    { period: "Now", value: 48 },
  ],
}

const altcoinHistoryByPeriod: Record<HistoryPeriod, Array<{ period: string; value: number }>> = {
  "1W": [
    { period: "D-6", value: 18 },
    { period: "D-5", value: 20 },
    { period: "D-4", value: 19 },
    { period: "D-3", value: 21 },
    { period: "D-2", value: 22 },
    { period: "D-1", value: 21 },
    { period: "Now", value: 22 },
  ],
  "1M": [
    { period: "4W", value: 16 },
    { period: "3W", value: 18 },
    { period: "2W", value: 20 },
    { period: "1W", value: 20 },
    { period: "Now", value: 22 },
  ],
  "3M": [
    { period: "3M", value: 15 },
    { period: "2M", value: 18 },
    { period: "6W", value: 19 },
    { period: "4W", value: 20 },
    { period: "1W", value: 20 },
    { period: "Now", value: 22 },
  ],
  "6M": [
    { period: "6M", value: 12 },
    { period: "5M", value: 14 },
    { period: "4M", value: 16 },
    { period: "3M", value: 15 },
    { period: "2M", value: 18 },
    { period: "1M", value: 20 },
    { period: "Now", value: 22 },
  ],
  "1Y": [
    { period: "12M", value: 10 },
    { period: "10M", value: 12 },
    { period: "8M", value: 15 },
    { period: "6M", value: 12 },
    { period: "4M", value: 16 },
    { period: "3M", value: 15 },
    { period: "2M", value: 18 },
    { period: "1M", value: 20 },
    { period: "Now", value: 22 },
  ],
}

const dominanceHistoryByPeriod: Record<
  HistoryPeriod,
  Array<{ period: string; btc: number; eth: number; others: number }>
> = {
  "1W": [
    { period: "D-6", btc: 58.9, eth: 12.0, others: 29.1 },
    { period: "D-5", btc: 58.7, eth: 12.1, others: 29.2 },
    { period: "D-4", btc: 58.8, eth: 12.0, others: 29.2 },
    { period: "D-3", btc: 58.6, eth: 12.2, others: 29.2 },
    { period: "D-2", btc: 58.5, eth: 12.2, others: 29.3 },
    { period: "D-1", btc: 58.5, eth: 12.1, others: 29.4 },
    { period: "Now", btc: 58.4, eth: 12.1, others: 29.5 },
  ],
  "1M": [
    { period: "4W", btc: 59.1, eth: 11.9, others: 29.0 },
    { period: "3W", btc: 58.9, eth: 12.0, others: 29.1 },
    { period: "2W", btc: 58.7, eth: 12.1, others: 29.2 },
    { period: "1W", btc: 58.6, eth: 12.2, others: 29.2 },
    { period: "Now", btc: 58.4, eth: 12.1, others: 29.5 },
  ],
  "3M": [
    { period: "3M", btc: 59.2, eth: 11.8, others: 29.0 },
    { period: "2M", btc: 58.9, eth: 12.0, others: 29.1 },
    { period: "6W", btc: 58.8, eth: 12.1, others: 29.1 },
    { period: "4W", btc: 58.7, eth: 12.1, others: 29.2 },
    { period: "1W", btc: 58.6, eth: 12.2, others: 29.2 },
    { period: "Now", btc: 58.4, eth: 12.1, others: 29.5 },
  ],
  "6M": [
    { period: "6M", btc: 60.1, eth: 11.3, others: 28.6 },
    { period: "5M", btc: 59.7, eth: 11.5, others: 28.8 },
    { period: "4M", btc: 59.3, eth: 11.7, others: 29.0 },
    { period: "3M", btc: 59.2, eth: 11.8, others: 29.0 },
    { period: "2M", btc: 58.9, eth: 12.0, others: 29.1 },
    { period: "1M", btc: 58.8, eth: 12.4, others: 28.8 },
    { period: "Now", btc: 58.4, eth: 12.1, others: 29.5 },
  ],
  "1Y": [
    { period: "12M", btc: 53.8, eth: 14.5, others: 31.7 },
    { period: "10M", btc: 55.1, eth: 13.9, others: 31.0 },
    { period: "8M", btc: 56.2, eth: 13.2, others: 30.6 },
    { period: "6M", btc: 60.1, eth: 11.3, others: 28.6 },
    { period: "4M", btc: 59.3, eth: 11.7, others: 29.0 },
    { period: "3M", btc: 59.2, eth: 11.8, others: 29.0 },
    { period: "2M", btc: 58.9, eth: 12.0, others: 29.1 },
    { period: "1M", btc: 58.8, eth: 12.4, others: 28.8 },
    { period: "Now", btc: 58.4, eth: 12.1, others: 29.5 },
  ],
}

export function TotalAssetsChart() {
  const fearGreedSentiment = getFearGreedSentiment(fearGreedIndex);
  const sentiment = getIndexSentiment(altcoinIndex);
  const [fearGreedDialogOpen, setFearGreedDialogOpen] = useState(false);
  const [altcoinDialogOpen, setAltcoinDialogOpen] = useState(false);
  const [dominanceDialogOpen, setDominanceDialogOpen] = useState(false);
  const [fearGreedPeriod, setFearGreedPeriod] = useState<HistoryPeriod>("1M")
  const [altcoinPeriod, setAltcoinPeriod] = useState<HistoryPeriod>("1M")
  const [dominancePeriod, setDominancePeriod] = useState<HistoryPeriod>("1M")

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-lg font-semibold text-foreground">시장 위치는 어디에 있을까?</CardTitle>
                <CardDescription>
                  공포탐욕지수로 시장 심리를 확인하고, 알트코인 시즌 지수와 주요 자산의 도미넌스를 통해 시장을 파악해보세요.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="flex flex-col items-start justify-center">
                <div className="flex items-center gap-2 text-left w-full mb-2">
                    <h4 className="font-bold">공포탐욕지수</h4>
                    <button
                      onClick={() => setFearGreedDialogOpen(true)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="relative w-40 h-40 self-center">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                            className="text-muted/30"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className={cn("transition-all duration-500", fearGreedSentiment.progressColor)}
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            strokeDasharray={`${fearGreedIndex}, 100`}
                            transform="rotate(-90 18 18)"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={cn("text-3xl font-bold", fearGreedSentiment.color)}>{fearGreedIndex}</span>
                        <span className={cn("text-sm font-semibold mt-1", fearGreedSentiment.color)}>{fearGreedSentiment.text}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col items-start justify-center">
                <div className="flex items-center gap-2 text-left w-full mb-2">
                    <h4 className="font-bold">알트코인 시즌 지수</h4>
                    <button
                      onClick={() => setAltcoinDialogOpen(true)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="relative w-40 h-40 self-center">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                            className="text-muted/30"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className={cn("transition-all duration-500", sentiment.progressColor)}
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            strokeDasharray={`${altcoinIndex}, 100`}
                            transform="rotate(-90 18 18)"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={cn("text-3xl font-bold", sentiment.color)}>{altcoinIndex}</span>
                        <span className={cn("text-sm font-semibold mt-1", sentiment.color)}>{sentiment.text}</span>
                    </div>
                </div>
            </div>
            
            <div className="space-y-4">
                 <div className="flex items-center gap-2 text-left w-full mb-2">
                    <h4 className="font-bold">비트코인 도미넌스</h4>
                    <button
                      onClick={() => setDominanceDialogOpen(true)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <DominanceItem label="비트코인" value={dominanceData.btc.value} change={dominanceData.btc.change} color={dominanceData.btc.color} />
                    <DominanceItem label="이더리움" value={dominanceData.eth.value} change={dominanceData.eth.change} color={dominanceData.eth.color} />
                    <DominanceItem label="기타" value={dominanceData.others.value} change={dominanceData.others.change} color={dominanceData.others.color} />
                </div>
                <div className="flex w-full h-2.5 rounded-full overflow-hidden">
                    <div className={dominanceData.btc.color} style={{ width: `${dominanceData.btc.value}%` }}></div>
                    <div className={dominanceData.eth.color} style={{ width: `${dominanceData.eth.value}%` }}></div>
                    <div className={dominanceData.others.color} style={{ width: `${dominanceData.others.value}%` }}></div>
                </div>
                <div className="space-y-2 pt-2">
                    <DominanceHistoryItem label="지난주" data={dominanceData.history.lastWeek} />
                    <DominanceHistoryItem label="지난달" data={dominanceData.history.lastMonth} />
                </div>
            </div>
        </div>
      </CardContent>

      {/* 공포탐욕지수 상세 다이얼로그 */}
      <Dialog open={fearGreedDialogOpen} onOpenChange={setFearGreedDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="pb-0">
            <DialogTitle className="text-2xl font-bold">공포탐욕지수</DialogTitle>
            <DialogDescription className="text-base">
            공포탐욕지수는 투자자들이 시장을 보는 감정을 숫자로 나타낸 거예요. 사람들이 너무 두려워하면 반등 기회가 생기고, 너무 탐욕스러우면 조정이 올 수 있어요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            {/* 현재 지수와 게이지 시각화 */}
            <div className="relative bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-4 rounded-full mb-2">
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full shadow-lg transition-all"
                style={{ left: `calc(${fearGreedIndex}% - 8px)` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mb-6">
              <span>극심한 공포</span>
              <span>공포</span>
              <span>중립</span>
              <span>탐욕</span>
              <span>극심한 탐욕</span>
            </div>

            {/* 현재 상태 */}
            <div className="bg-secondary/20 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn("w-1.5 h-12 rounded-full", fearGreedSentiment.color.replace("text-", "bg-"))} />
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className={cn("text-4xl font-bold tracking-tight", fearGreedSentiment.color)}>
                        {fearGreedIndex}
                      </span>
                      <span className={cn("text-lg font-semibold", fearGreedSentiment.color)}>
                        {fearGreedSentiment.text}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      지난주보다 <span className="font-medium text-foreground">{Math.abs(fearGreedIndex - fearGreedHistory.lastWeek)}포인트 {fearGreedIndex >= fearGreedHistory.lastWeek ? '상승' : '하락'}</span>했어요
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 text-right">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Last Week</p>
                    <p className="text-lg font-semibold tabular-nums">{fearGreedHistory.lastWeek}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Last Month</p>
                    <p className="text-lg font-semibold tabular-nums">{fearGreedHistory.lastMonth}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 해석 가이드 */}
            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-sm text-muted-foreground">어떻게 활용할까요?</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="font-semibold text-sm">0-25 공포</span>
                  </div>
                  <p className="text-xs text-muted-foreground">시장이 과도한 공포에 빠져있어요. 저점 매수 기회가 될 수 있습니다.</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="font-semibold text-sm">75-100 탐욕</span>
                  </div>
                  <p className="text-xs text-muted-foreground">시장이 과열 상태예요. 수익 실현을 고려해보세요.</p>
                </div>
              </div>
            </div>

            {/* 과거 추이 차트 */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <h4 className="font-semibold text-sm text-muted-foreground">최근 추이</h4>
                <PeriodSelector value={fearGreedPeriod} onChange={setFearGreedPeriod} />
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={fearGreedHistoryByPeriod[fearGreedPeriod]}>
                  <defs>
                    <linearGradient id="fearGreedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#f59e0b' }}
                    activeDot={{ r: 7 }}
                    fill="url(#fearGreedGradient)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 알트코인 시즌 지수 상세 다이얼로그 */}
      <Dialog open={altcoinDialogOpen} onOpenChange={setAltcoinDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="pb-0">
            <DialogTitle className="text-2xl font-bold">알트코인 시즌 지수</DialogTitle>
            <DialogDescription className="text-base">
              지난 90일간 상위 100개 알트코인 중 75%가 비트코인보다 높은 수익률을 보이면 &apos;알트코인 시즌&apos;으로 판단합니다. 
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            {/* 시즌 시각화 */}
            <div className="relative mb-8">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg" alt="BTC" className="w-8 h-8" />
                  <span className="font-semibold">비트코인 시즌</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">알트코인 시즌</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">ALT</span>
                  </div>
                </div>
              </div>
              <div className="relative bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-6 rounded-full">
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-gray-800 rounded-full shadow-lg flex items-center justify-center transition-all"
                  style={{ left: `calc(${altcoinIndex}% - 12px)` }}
                >
                  <span className="text-[10px] font-bold">{altcoinIndex}</span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>

            {/* 현재 상태 */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg" alt="BTC" className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">현재 상태</p>
                  <p className={cn("text-2xl font-bold", sentiment.color)}>{sentiment.text}</p>
                  <p className="text-sm text-muted-foreground">비트코인이 대부분의 알트코인보다 강세를 보이고 있습니다</p>
                </div>
              </div>
            </div>

            {/* 투자 전략 가이드 */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className={cn("rounded-lg p-4 text-center", altcoinIndex <= 25 ? "bg-green-500/20 ring-2 ring-green-500" : "bg-muted/50")}>
                <p className="font-semibold text-sm mb-1">비트코인 시즌</p>
                <p className="text-xs text-muted-foreground break-keep">비트코인 위주로 포트폴리오를 구성해보세요</p>
              </div>
              <div className={cn("rounded-lg p-4 text-center", altcoinIndex > 25 && altcoinIndex <= 75 ? "bg-yellow-500/20 ring-2 ring-yellow-500" : "bg-muted/50")}>
                <p className="font-semibold text-sm mb-1">중립</p>
                <p className="text-xs text-muted-foreground break-keep">비트코인과 알트코인에 골고루 투자하세요</p>
              </div>
              <div className={cn("rounded-lg p-4 text-center", altcoinIndex > 75 ? "bg-red-500/20 ring-2 ring-red-500" : "bg-muted/50")}>
                <p className="font-semibold text-sm mb-1">알트코인 시즌</p>
                <p className="text-xs text-muted-foreground break-keep">다양한 알트코인에서 수익 기회를 찾아보세요</p>
              </div>
            </div>

            {/* 과거 추이 */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <h4 className="font-semibold text-sm text-muted-foreground">최근 추이</h4>
                <PeriodSelector value={altcoinPeriod} onChange={setAltcoinPeriod} />
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={altcoinHistoryByPeriod[altcoinPeriod]}>
                  <defs>
                    <linearGradient id="altcoinGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#10b981' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 비트코인 도미넌스 상세 다이얼로그 */}
      <Dialog open={dominanceDialogOpen} onOpenChange={setDominanceDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="pb-0">
            <DialogTitle className="text-2xl font-bold">비트코인 도미넌스</DialogTitle>
            <DialogDescription className="text-base">
              전체 가상자산 시장에서 각 자산이 차지하는 비중을 통해 자금 흐름을 파악할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            {/* 도미넌스 파이 시각화 */}
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle 
                    cx="18" cy="18" r="15.9" fill="none" 
                    stroke="#f7931a" strokeWidth="3"
                    strokeDasharray={`${dominanceData.btc.value} ${100 - dominanceData.btc.value}`}
                    strokeLinecap="round"
                  />
                  <circle 
                    cx="18" cy="18" r="15.9" fill="none" 
                    stroke="#627eea" strokeWidth="3"
                    strokeDasharray={`${dominanceData.eth.value} ${100 - dominanceData.eth.value}`}
                    strokeDashoffset={`-${dominanceData.btc.value}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{dominanceData.btc.value}%</span>
                  <span className="text-xs text-muted-foreground">BTC</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg" alt="BTC" className="w-8 h-8" />
                    <div>
                      <p className="font-semibold">{dominanceData.btc.value}%</p>
                      <p className={cn("text-xs font-semibold", dominanceData.btc.change >= 0 ? "text-red-500" : "text-blue-500")}>
                        {dominanceData.btc.change >= 0 ? '▲' : '▼'} {Math.abs(dominanceData.btc.change)}% (전일 대비)
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <p className="text-muted-foreground">지난주 <span className="font-semibold text-foreground">{dominanceData.history.lastWeek.btc}%</span></p>
                    <p className="text-muted-foreground">지난달 <span className="font-semibold text-foreground">{dominanceData.history.lastMonth.btc}%</span></p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 1.75l-6.25 10.5L12 16.5l6.25-4.25L12 1.75zM5.75 13.5L12 22.25l6.25-8.75L12 17.75l-6.25-4.25z"/></svg>
                    </div>
                    <div>
                      <p className="font-semibold">{dominanceData.eth.value}%</p>
                      <p className={cn("text-xs font-semibold", dominanceData.eth.change >= 0 ? "text-red-500" : "text-blue-500")}>
                        {dominanceData.eth.change >= 0 ? '▲' : '▼'} {Math.abs(dominanceData.eth.change)}% (전일 대비)
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <p className="text-muted-foreground">지난주 <span className="font-semibold text-foreground">{dominanceData.history.lastWeek.eth}%</span></p>
                    <p className="text-muted-foreground">지난달 <span className="font-semibold text-foreground">{dominanceData.history.lastMonth.eth}%</span></p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">...</span>
                    </div>
                    <div>
                      <p className="font-semibold">{dominanceData.others.value}%</p>
                      <p className={cn("text-xs font-semibold", dominanceData.others.change >= 0 ? "text-red-500" : "text-blue-500")}>
                        {dominanceData.others.change >= 0 ? '▲' : '▼'} {Math.abs(dominanceData.others.change)}% (전일 대비)
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <p className="text-muted-foreground">지난주 <span className="font-semibold text-foreground">{dominanceData.history.lastWeek.others}%</span></p>
                    <p className="text-muted-foreground">지난달 <span className="font-semibold text-foreground">{dominanceData.history.lastMonth.others}%</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* 해석 가이드 */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">BTC 도미넌스 상승</span>
                </div>
                <p className="text-xs text-muted-foreground">안전자산 선호 심리로 비트코인에 자금이 쏠리고 있어요.</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-purple-500" />
                  <span className="font-semibold text-sm">BTC 도미넌스 하락</span>
                </div>
                <p className="text-xs text-muted-foreground">투자 심리가 살아나며 다양한 알트코인으로 자금이 흐르고 있어요.</p>
              </div>
            </div>

            {/* 과거 추이 */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <h4 className="font-semibold text-sm text-muted-foreground">최근 추이</h4>
                <PeriodSelector value={dominancePeriod} onChange={setDominancePeriod} />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dominanceHistoryByPeriod[dominancePeriod]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                  <XAxis dataKey="period" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 70]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="btc" 
                    name="비트코인"
                    stroke="#f7931a" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#f7931a' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="eth" 
                    name="이더리움"
                    stroke="#627eea" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#627eea' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="others" 
                    name="기타"
                    stroke="#9ca3af" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#9ca3af' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
