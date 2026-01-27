'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Line,
  ComposedChart,
  CartesianGrid,
  Legend
} from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, Lightbulb, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// 시계열 데이터 (최근 4주) - 과거 → 현재 순서
const timelineData = [
  { 
    date: '12/31', 
    cash: 28, 
    diversified: 42, 
    aggressive: 20, 
    allIn: 10,
    myRatio: 52
  },
  { 
    date: '1/7', 
    cash: 25, 
    diversified: 40, 
    aggressive: 22, 
    allIn: 13,
    myRatio: 55
  },
  { 
    date: '1/14', 
    cash: 22, 
    diversified: 38, 
    aggressive: 25, 
    allIn: 15,
    myRatio: 58
  },
  { 
    date: '1/21', 
    cash: 20, 
    diversified: 35, 
    aggressive: 30, 
    allIn: 15,
    myRatio: 60
  },
];


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 p-3 border rounded-lg shadow-lg text-xs">
        <p className="font-bold mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => {
            if (entry.dataKey === 'myRatio') {
              return (
                <div key={index} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-primary"></div>
                    <span className="text-muted-foreground">나의 코인 비중</span>
                  </div>
                  <span className="font-bold text-primary">{entry.value}%</span>
                </div>
              );
            }
            return (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
                <span className="font-bold">{entry.value}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export function MembershipAssetDistributionTimeline() {
  const [myAssetPercentage] = useState(65);

  // 차트 데이터 준비
  const chartData = timelineData.map(item => ({
    ...item,
    date: item.date,
  }));

  const currentData = timelineData[timelineData.length - 1]; // 현재 (마지막)
  const previousData = timelineData[timelineData.length - 2]; // 1주 전

  // 인사이트 계산 - 더 감정적이고 판단 중심의 메시지
  const insights = useMemo(() => {
    const allInChange = currentData.allIn - previousData.allIn;
    const cashChange = currentData.cash - previousData.cash;
    const myRatioChange = currentData.myRatio - previousData.myRatio;
    const avgCashChange = currentData.cash - timelineData[0].cash; // 4주 전 대비
    
    const result = [];
    
    // 나의 행동 vs 시장 흐름 비교
    if (myRatioChange > 0 && cashChange > 0) {
      // 내가 코인 비중을 늘렸는데, 시장은 현금을 늘림
      result.push({
        type: 'contrarian',
        icon: <AlertCircle className="w-4 h-4" />,
        message: `대다수의 고수들이 현금을 늘릴 때, 당신은 공격적으로 코인 비중을 높였습니다. 시장의 흐름과 반대로 움직이고 있네요.`,
      });
    } else if (myRatioChange < 0 && cashChange < 0) {
      // 내가 코인 비중을 줄였는데, 시장도 줄임
      result.push({
        type: 'positive',
        icon: <CheckCircle2 className="w-4 h-4" />,
        message: `고수들과 함께 현금 비중을 늘리고 있습니다. 하락장 대비 움직임에 동참하고 있네요.`,
      });
    } else if (myRatioChange < 0 && cashChange > 0) {
      // 내가 코인 비중을 줄였는데, 시장은 현금을 늘림
      result.push({
        type: 'warning',
        icon: <XCircle className="w-4 h-4" />,
        message: `고수들이 현금을 늘리는 동안, 당신은 코인 비중을 줄였습니다. 시장의 흐름과 반대로 움직이고 있어요.`,
      });
    }
    
    // 올인 비중 급증 경고
    if (allInChange > 5) {
      result.push({
        type: 'warning',
        icon: <TrendingUp className="w-4 h-4" />,
        message: `올인 비중이 ${previousData.allIn}%에서 ${currentData.allIn}%로 급증했습니다. 시장 포모(FOMO) 신호일 수 있습니다.`,
      });
    }
    
    return result;
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              등급 내 자산 배분 추이
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              최근 4주간 등급 내 유저들의 자산 배분 변화 추이를 확인하세요
            </p>
          </div>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="space-y-3">
          {/* 인사이트 배너 */}
          {insights.length > 0 && (
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-3 rounded-lg border flex items-start gap-3',
                    insight.type === 'warning'
                      ? 'border-orange-500/30 bg-orange-500/5'
                      : insight.type === 'contrarian'
                      ? 'border-yellow-500/30 bg-yellow-500/5'
                      : insight.type === 'positive'
                      ? 'border-green-500/30 bg-green-500/5'
                      : 'border-blue-500/30 bg-blue-500/5'
                  )}
                >
                  <div className={cn(
                    'p-1.5 rounded shrink-0',
                    insight.type === 'warning'
                      ? 'text-orange-500 bg-orange-500/10'
                      : insight.type === 'contrarian'
                      ? 'text-yellow-500 bg-yellow-500/10'
                      : insight.type === 'positive'
                      ? 'text-green-500 bg-green-500/10'
                      : 'text-blue-500 bg-blue-500/10'
                  )}>
                    {insight.icon}
                  </div>
                  <p className="text-sm text-foreground flex-1">{insight.message}</p>
                </div>
              ))}
            </div>
          )}

          {/* 누적 영역 차트 */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <defs>
                  {/* 더 부드러운 그라데이션 */}
                  <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#86efac" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#86efac" stopOpacity={0.15}/>
                  </linearGradient>
                  <linearGradient id="colorDiversified" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fde047" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#fde047" stopOpacity={0.15}/>
                  </linearGradient>
                  <linearGradient id="colorAggressive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fdba74" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#fdba74" stopOpacity={0.15}/>
                  </linearGradient>
                  <linearGradient id="colorAllIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fca5a5" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#fca5a5" stopOpacity={0.15}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '5px', fontSize: '12px', fontWeight: '500' }}
                  iconType="circle"
                  iconSize={10}
                />
                {/* 누적 영역 - 더 부드러운 스트로크 */}
                <Area
                  type="monotone"
                  dataKey="cash"
                  stackId="1"
                  stroke="#86efac"
                  strokeWidth={1.5}
                  fill="url(#colorCash)"
                  name="현금보유 (코인 < 10%)"
                />
                <Area
                  type="monotone"
                  dataKey="diversified"
                  stackId="1"
                  stroke="#fde047"
                  strokeWidth={1.5}
                  fill="url(#colorDiversified)"
                  name="분산투자 (코인 10-50%)"
                />
                <Area
                  type="monotone"
                  dataKey="aggressive"
                  stackId="1"
                  stroke="#fdba74"
                  strokeWidth={1.5}
                  fill="url(#colorAggressive)"
                  name="공격투자 (코인 50-90%)"
                />
                <Area
                  type="monotone"
                  dataKey="allIn"
                  stackId="1"
                  stroke="#fca5a5"
                  strokeWidth={1.5}
                  fill="url(#colorAllIn)"
                  name="올인 (코인 > 90%)"
                />
                {/* 나의 비중 선 - 파란색 강조 */}
                <Line
                  type="monotone"
                  dataKey="myRatio"
                  stroke="#1e40af"
                  strokeWidth={4}
                  dot={(props: any) => {
                    // 마지막 포인트(현재)만 큰 점으로 표시
                    const isLast = props.payload.date === '1/21';
                    if (isLast) {
                      return (
                        <g key={`dot-${props.payload.date}`}>
                          <circle
                            cx={props.cx}
                            cy={props.cy}
                            r={8}
                            fill="#1e40af"
                            stroke="#ffffff"
                            strokeWidth={3}
                          />
                          <text
                            x={props.cx}
                            y={props.cy - 15}
                            textAnchor="middle"
                            fill="#1e40af"
                            fontSize={12}
                            fontWeight="bold"
                          >
                            {props.payload.myRatio}%
                          </text>
                        </g>
                      );
                    }
                    return <circle key={`dot-${props.payload.date}`} cx={props.cx} cy={props.cy} r={0} />;
                  }}
                  activeDot={{ r: 8, fill: '#1e40af', stroke: '#ffffff', strokeWidth: 2 }}
                  name="나의 코인 비중"
                  strokeDasharray="0"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
