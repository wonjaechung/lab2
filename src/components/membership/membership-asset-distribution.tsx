'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell, Label, CartesianGrid, LabelList } from 'recharts';
import { User, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 전체 멤버십 수 (예시 값, 실제 데이터로 교체 필요)
const TOTAL_MEMBERS = 10000;

const distributionData = [
    { range: '< -30%', holders: 8.5 },
    { range: '-30% ~ -20%', holders: 12.3 },
    { range: '-20% ~ -10%', holders: 18.9 },
    { range: '-10% ~ -5%', holders: 25.1 },
    { range: '-5% ~ 0%', holders: 30.7 },
    { range: '0% ~ 5%', holders: 28.4 },
    { range: '5% ~ 10%', holders: 22.6 },
    { range: '10% ~ 20%', holders: 15.8 },
    { range: '20% ~ 30%', holders: 9.2 },
    { range: '> 30%', holders: 5.5 },
];

const myPortfolio = {
    pnlPercent: 35.0,
    topGainers: [
        { ticker: 'WLD', name: '월드코인', pnl: 45.2, img: 'https://cryptologos.cc/logos/worldcoin-org-wld-logo.svg?v=032' },
        { ticker: 'STX', name: '스택스', pnl: 32.1, img: 'https://cryptologos.cc/logos/stacks-stx-logo.svg?v=032' },
        { ticker: 'RNDR', name: '렌더', pnl: 28.9, img: 'https://cryptologos.cc/logos/render-rndr-logo.svg?v=032' },
    ],
    topLosers: [
        { ticker: 'SUI', name: '수이', pnl: -15.8, img: 'https://cryptologos.cc/logos/sui-sui-logo.svg?v=032' },
        { ticker: 'XRP', name: '리플', pnl: -8.2, img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032' },
        { ticker: 'DOGE', name: '도지코인', pnl: -5.1, img: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=032' },
    ]
};

const marketData = {
    topGainers: [
        { ticker: 'PEPE', name: '페페', pnl: 85.2, img: 'https://cryptologos.cc/logos/pepe-pepe-logo.svg?v=032' },
        { ticker: 'SOL', name: '솔라나', pnl: 65.1, img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032' },
        { ticker: 'AGIX', name: '싱귤래리티넷', pnl: 55.9, img: 'https://cryptologos.cc/logos/singularitynet-agix-logo.svg?v=032' },
    ],
    topLosers: [
        { ticker: 'FTM', name: '팬텀', pnl: -22.8, img: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=032' },
        { ticker: 'MANA', name: '디센트럴랜드', pnl: -18.2, img: 'https://cryptologos.cc/logos/decentraland-mana-logo.svg?v=032' },
        { ticker: 'SAND', name: '더샌드박스', pnl: -16.1, img: 'https://cryptologos.cc/logos/the-sandbox-sand-logo.svg?v=032' },
    ]
};


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 p-2 border rounded-md shadow-lg text-xs">
        <p className="font-bold">{`수익률 ${label}`}</p>
        <p className="text-foreground">{`보유자 분포: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};


export function MembershipAssetDistribution() {
    const { myPositionIndex, myRankPercent, chartData } = useMemo(() => {
        let cumulativePercent = 0;
        let positionIndex = -1;
        const pnl = myPortfolio.pnlPercent;

        // 정방향으로 순회하면서 위치 찾기
        for(let i=0; i<distributionData.length; i++) {
            const range = distributionData[i].range;
            let isInRange = false;

            if (range.startsWith('>')) {
                const threshold = parseFloat(range.replace('>', '').replace('%', '').trim());
                isInRange = pnl > threshold;
            } else if (range.startsWith('<')) {
                const threshold = parseFloat(range.replace('<', '').replace('%', '').trim());
                isInRange = pnl < threshold;
            } else if (range.includes('~')) {
                const parts = range.split('~');
                const min = parseFloat(parts[0].replace(/[^0-9.-]/g, ''));
                const max = parseFloat(parts[1].replace(/[^0-9.-]/g, ''));
                isInRange = pnl >= min && pnl < max;
            }

            if (isInRange) {
                positionIndex = i;
                break;
            }
        }

        // 상위 순위 계산 (위에서부터 누적)
        const reversedData = [...distributionData].reverse();
        for(let i=0; i<reversedData.length; i++) {
            const idx = distributionData.length - 1 - i;
            if (idx > positionIndex) {
                cumulativePercent += reversedData[i].holders;
            } else if (idx === positionIndex) {
                cumulativePercent += reversedData[i].holders / 2;
                break;
            }
        }

        const rankPercent = Math.round(cumulativePercent);

        // 차트 데이터에 라벨 추가
        const chartDataWithLabel = distributionData.map((entry, index) => ({
            ...entry,
            label: index === positionIndex ? '내!' : ''
        }));

        return { myPositionIndex: positionIndex, myRankPercent: rankPercent, chartData: chartDataWithLabel };
    }, [myPortfolio.pnlPercent]);

    const AssetList = ({ title, assets, type }: { title: string, assets: any[], type: 'gainer' | 'loser' }) => (
        <div>
            <h4 className="font-semibold mb-2 text-muted-foreground">{title}</h4>
            <div className="space-y-2">
                {assets.map(asset => (
                    <div key={asset.ticker} className="flex items-center justify-between p-2 rounded-lg bg-card/50">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={asset.img} />
                                <AvatarFallback>{asset.ticker}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-sm">{asset.name}</p>
                                <p className="text-xs text-muted-foreground">{asset.ticker}</p>
                            </div>
                        </div>
                         <div className="text-right">
                            <p className={cn("font-mono font-semibold", type === 'gainer' ? 'text-green-500' : 'text-red-500')}>
                                {type === 'gainer' ? '+' : ''}{asset.pnl.toFixed(1)}%
                            </p>
                            <Button size="sm" variant="outline" className="mt-1 h-7 text-xs">거래하기</Button>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">등급 내 수익률 분포</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">같은 등급 내 유저들의 수익률 분포를 확인하세요</p>
            </CardHeader>
            <CardContent>
                {/* 차트 */}
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={chartData} 
                            margin={{ left: 10, top: 10, bottom: 10, right: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.3} />
                            <XAxis 
                                dataKey="range" 
                                type="category"
                                tick={{ fontSize: 10 }} 
                                tickLine={false}
                                axisLine={false}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis 
                                type="number"
                                domain={[0, 30]}
                                hide
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent)/0.1)' }} />
                            <Bar dataKey="holders" radius={[4, 4, 0, 0]} barSize={22}>
                                {chartData.map((entry, index) => {
                                    const pnl = parseFloat(entry.range.split('~')[0].replace(/[^0-9.-]/g, ''));
                                    const isMyPosition = index === myPositionIndex;
                                    // 사용자 위치 바는 오렌지 색상 사용
                                    const color = isMyPosition
                                        ? '#fb923c' // 오렌지 색상
                                        : pnl >= 0 
                                            ? index < 5 ? '#86efac' : index < 7 ? '#4ade80' : '#22c55e'
                                            : index > 5 ? '#fca5a5' : index > 3 ? '#fb7185' : '#ef4444';
                                    
                                    return <Cell key={`cell-${index}`} fill={color} />;
                                })}
                                <LabelList 
                                    dataKey="holders"
                                    position="top"
                                    fill="hsl(var(--muted-foreground))"
                                    fontSize={10}
                                    fontWeight="medium"
                                    formatter={(value: number) => {
                                        const count = Math.round((value / 100) * TOTAL_MEMBERS);
                                        return `${count.toLocaleString()}명`;
                                    }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                
                {/* 사용자 위치 정보 - 하단 */}
                {myPositionIndex >= 0 && (
                    <div className="mt-0 pt-2 border-t border-border/50">
                        <div className="flex items-center justify-center gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground">내 수익률</p>
                                <p className={cn("text-sm font-bold", myPortfolio.pnlPercent >= 0 ? "text-green-500" : "text-red-500")}>
                                    {myPortfolio.pnlPercent >= 0 ? '+' : ''}{myPortfolio.pnlPercent.toFixed(1)}%
                                </p>
                            </div>
                            <div className="w-px h-6 bg-border"></div>
                            <div>
                                <p className="text-xs text-muted-foreground">등급 내 순위</p>
                                <p className="text-sm font-bold text-primary">상위 {myRankPercent}%</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
