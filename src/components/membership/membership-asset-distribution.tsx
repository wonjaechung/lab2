'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell, Label } from 'recharts';
import { User, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    pnlPercent: 8.7,
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
    const { myPositionIndex, myRankPercent } = useMemo(() => {
        let cumulativePercent = 0;
        let positionIndex = -1;
        
        const reversedData = [...distributionData].reverse();

        for(let i=0; i<reversedData.length; i++) {
            const range = reversedData[i].range;
            const pnl = myPortfolio.pnlPercent;

            if ( (range.startsWith('>') && pnl > parseFloat(range.replace('>', '').replace('%', ''))) ||
                 (range.startsWith('<') && pnl < parseFloat(range.replace('<', '').replace('%', ''))) ||
                 (range.includes('~') && pnl >= parseFloat(range.split('~')[0].replace('%','')) && pnl < parseFloat(range.split('~')[1].replace('%','')) )
            ) {
                positionIndex = distributionData.length - 1 - i;
            }

            if (positionIndex === -1) {
                cumulativePercent += reversedData[i].holders;
            }
        }
        
        if (positionIndex !== -1) {
          cumulativePercent += reversedData.find((d, i) => distributionData.length - 1 - i === positionIndex)!.holders / 2;
        }

        return { myPositionIndex: positionIndex, myRankPercent: Math.round(cumulativePercent) };
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
                <CardTitle className="text-lg">같은 등급의 다른 멤버들은, 웃고 있을까 울고 있을까?</CardTitle>
                <p className="text-muted-foreground">같은 멤버십 등급 내 유저들의 수익률 분포와 나의 현재 위치를 비교하며 포트폴리오를 점검해보세요.</p>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="grid grid-cols-2 gap-4">
                           <AssetList title="BLACK 등급 수익률 TOP3" assets={marketData.topGainers} type="gainer" />
                           <AssetList title="BLACK 등급 수익률 BOTTOM3" assets={marketData.topLosers} type="loser" />
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={distributionData} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="range" type="category" width={90} tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))' }} />
                                <Bar dataKey="holders" radius={[0, 4, 4, 0]}>
                                    {distributionData.map((entry, index) => {
                                        const pnl = parseFloat(entry.range.split('~')[0].replace(/[^0-9.-]/g, ''));
                                        const color = pnl >= 0 ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-1))';
                                        
                                        return <Cell key={`cell-${index}`} fill={color} />;
                                    })}
                                </Bar>
                                {myPositionIndex !== -1 && (
                                     <ReferenceLine 
                                        y={myPositionIndex} 
                                        stroke="hsl(var(--primary))" 
                                        strokeDasharray="4 4" 
                                        strokeWidth={2}
                                     >
                                         <Label>
                                            <User className="w-4 h-4 text-primary" />
                                         </Label>
                                     </ReferenceLine>
                                )}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
