'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList } from 'recharts';
import { Coins, Scale, PieChart } from 'lucide-react';

const Flame = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.072-2-3.83-2-5a2.5 2.5 0 0 0-5 0c0 1.17 1 3 2 5 .5 1 1 1.62 1 3a2.5 2.5 0 0 0 2.5 2.5z"/><path d="M14.5 18.5a2.5 2.5 0 0 0 2.5-2.5c0-1.38-.5-2-1-3-1.072-2.072-2-3.83-2-5a2.5 2.5 0 0 0-5 0c0 1.17 1 3 2 5 .5 1 1 1.62 1 3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
);

const Droplet = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
);

const initialAssetDistributionData = [
  { name: '현금보유', value: 25, color: 'hsl(var(--chart-2))', icon: Coins },
  { name: '분산투자', value: 45, color: 'hsl(var(--chart-3))', icon: Scale },
  { name: '공격투자', value: 20, color: 'hsl(var(--chart-4))', icon: Flame },
  { name: '올인', value: 10, color: 'hsl(var(--chart-1))', icon: Droplet },
];

export function UserAssetDistributionChart() {
  const [distributionData] = useState(initialAssetDistributionData);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">
          투자 성향별 유저 분포
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          전체 유저들의 자산 포트폴리오 구성 비율입니다.
        </p>
      </CardHeader>
      <CardContent className="flex-1 min-h-[200px]">
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted) / 0.2)' }}
                content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const Icon = data.icon;
                    return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" style={{ color: data.color }} />
                                <span className="font-bold">
                                    {data.name}: {payload[0].value}%
                                </span>
                            </div>
                        </div>
                    )
                    }
                    return null
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={40}>
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList dataKey="value" position="top" formatter={(value: number) => `${value}%`} className="fill-foreground font-bold" fontSize={12} offset={10} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}