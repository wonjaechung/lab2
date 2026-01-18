"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';

type FearGreedIndexProps = {};

function getSentiment(index: number): { text: string; color: string } {
  if (index <= 20) return { text: '극심한 공포', color: 'hsl(0, 72%, 51%)' }; // red
  if (index <= 45) return { text: '공포', color: 'hsl(30, 95%, 53%)' }; // orange
  if (index <= 55) return { text: '중립', color: 'hsl(50, 95%, 53%)' }; // yellow
  if (index <= 80) return { text: '탐욕', color: 'hsl(110, 50%, 53%)' }; // light green
  return { text: '극심한 탐욕', color: 'hsl(140, 72%, 51%)' }; // green
}

export function FearGreedIndex({}: FearGreedIndexProps) {
  // Static data instead of AI-generated data
  const fearGreedIndex = 48;
  const sentimentExplanation = "시장은 현재 중립적인 위치에 있으며, 매수자와 매도자 간의 힘겨루기가 팽팽합니다.";
  
  const sentiment = getSentiment(fearGreedIndex);
  const chartData = [{ name: 'index', value: fearGreedIndex }];

  return (
    <Card>
      <CardHeader>
        <CardTitle>공포/탐욕 지수</CardTitle>
        <CardDescription>{sentimentExplanation}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="relative h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="70%"
            innerRadius="60%"
            outerRadius="100%"
            barSize={20}
            data={chartData}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: 'hsl(var(--muted))' }}
              dataKey="value"
              cornerRadius={10}
              fill={sentiment.color}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute bottom-0 flex flex-col items-center">
            <span
              className="text-5xl font-bold"
              style={{ color: sentiment.color }}
            >
              {fearGreedIndex}
            </span>
            <span className="text-lg font-medium text-muted-foreground">{sentiment.text}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
