"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, HelpCircle, LayoutGrid, LineChart } from "lucide-react"
import React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Altcoin Season Index: 0-100 (0: Bitcoin season, 100: Altcoin season)
const altcoinIndex = 22;
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
    const isPositive = change >= 0;
    return (
        <div className="flex flex-col items-center">
            <div className="text-sm text-muted-foreground flex items-center gap-1.5 mb-1">
                <div className={cn("w-2 h-2 rounded-full", color)}></div>
                {label}
            </div>
            <div className="text-2xl font-bold text-foreground">{value.toFixed(1)}%</div>
            <div className={cn("flex items-center text-sm font-semibold mt-1", isPositive ? "text-red-500" : "text-blue-500")}>
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {Math.abs(change).toFixed(2)}%
            </div>
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

export function TotalAssetsChart() {
  const sentiment = getIndexSentiment(altcoinIndex);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-lg font-semibold text-foreground">시장 주도권은 어디에 있을까?</CardTitle>
                <CardDescription>
                  주요 자산의 도미넌스와 알트코인 시즌 지수를 통해 현재 시장의 주도 세력을 파악해보세요.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col items-start justify-center">
                <div className="flex items-center gap-2 text-left w-full mb-2">
                    <h4 className="font-bold">알트코인 시즌 지수</h4>
                     <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-[240px]">지난 90일간 상위 100개 알트코인 중 75%가 비트코인보다 높은 수익률을 보이면 '알트코인 시즌'으로 판단합니다.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                </div>
                <div className="relative w-48 h-48 self-center">
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
                        <span className={cn("text-4xl font-bold", sentiment.color)}>{altcoinIndex}</span>
                        <span className={cn("text-base font-semibold mt-1", sentiment.color)}>{sentiment.text}</span>
                    </div>
                </div>
            </div>
            
            <div className="space-y-4">
                 <div className="flex items-center gap-2 text-left w-full mb-2">
                    <h4 className="font-bold">비트코인 도미넌스</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                           <p className="max-w-[240px]">전체 가상자산 시장에서 각 자산이 차지하는 비중을 나타냅니다. 도미넌스 변화를 통해 시장의 자금이 비트코인으로 집중되는지, 알트코인으로 확산되는지 파악할 수 있습니다.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
    </Card>
  )
}
