
'use client';
import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface ChartDataPoint {
  date: string;
  allInRatio: number;
  btcPrice: number;
}

const generateData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  let allInRatio = 10;
  let btcPrice = 60000;
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    const priceChange = (Math.random() - 0.48) * 5000; // Increased volatility
    btcPrice += priceChange;
    
    let ratioChange = (Math.random() - 0.5) * 1;
    if (priceChange > 1500) { // Adjusted threshold
      ratioChange += Math.random() * 0.5;
    } else if (priceChange < -1500) { // Adjusted threshold
      ratioChange -= Math.random() * 0.3;
    }
    allInRatio += ratioChange;

    allInRatio = Math.max(5, Math.min(25, allInRatio));
    btcPrice = Math.max(45000, btcPrice); // Adjusted floor
    
    data.push({
      date: date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }),
      allInRatio: parseFloat(allInRatio.toFixed(2)),
      btcPrice: Math.round(btcPrice),
    });
  }
  return data;
};

export function AllInTrend() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [change, setChange] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = generateData();
    setChartData(data);
    
    if(data.length > 7) {
      const lastWeekRatio = data[data.length - 8].allInRatio;
      const currentRatio = data[data.length - 1].allInRatio;
      setChange(currentRatio - lastWeekRatio);
    }
    
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
        <div>
            <div className="flex justify-between items-end mb-2">
                <Skeleton className="h-6 w-3/5" />
                <div className="text-right">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-8 w-20" />
                </div>
            </div>
            <Skeleton className="h-5 w-4/5 mb-6" />
            <Skeleton className="h-80 w-full" />
        </div>
    )
  }

  return (
    <div>
        <div className="flex justify-between items-end mb-2">
            <h3 className="text-lg font-semibold text-foreground">
              지금 시장은 얼마나 뜨거울까?
            </h3>
            <div className="text-right">
                <span className="text-muted-foreground text-sm">지난주 대비 '올인' 유저</span>
                <div className={`flex items-center justify-end gap-1 text-2xl font-bold ${change > 0 ? 'text-red-500' : 'text-blue-500'}`}>
                    {change > 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                    {Math.abs(change).toFixed(2)}%
                </div>
            </div>
        </div>
        <p className="text-muted-foreground mb-6">
            '올인' 투자자의 비율이 급격히 늘어나는 시점은 주의가 필요합니다. 군중 심리가 과열된 순간을 포착해 매매 타이밍을 잡아보세요.
        </p>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="hsl(var(--primary))"
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#82ca9d"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
               formatter={(value, name) => {
                if (name === 'allInRatio') return [`${value}%`, "'올인' 유저 비율"];
                if (name === 'btcPrice') return [`$${(value as number).toLocaleString()}`, "BTC 가격"];
                return [value, name];
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="allInRatio"
              name="'올인' 유저 비율"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="btcPrice"
              name="BTC 가격"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
