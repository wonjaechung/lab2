'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, ReferenceLine } from 'recharts';
import { ArrowDown, ArrowUp, Hand, Info, User, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const analysisData = [
  { id: 'btc', ticker: 'BTC', name: '비트코인', currentPrice: 98200000, avgHolderPrice: 95500000, img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032' },
  { id: 'eth', ticker: 'ETH', name: '이더리움', currentPrice: 3520000, avgHolderPrice: 3810000, img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032' },
  { id: 'xrp', ticker: 'XRP', name: '리플', currentPrice: 845, avgHolderPrice: 910, img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032' },
  { id: 'sol', ticker: 'SOL', name: '솔라나', currentPrice: 210000, avgHolderPrice: 185000, img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032' },
  { id: 'doge', ticker: 'DOGE', name: '도지코인', currentPrice: 215, avgHolderPrice: 205, img: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=032' },
];

const generateDistributionData = (avgPrice: number, currentPrice: number) => {
  const data = [];
  const totalHolders = 1000;
  
  // Create a normal-like distribution around the average price
  for (let i = -10; i <= 10; i++) {
    const price = avgPrice * (1 + i * 0.04);
    const deviation = Math.abs(price - avgPrice);
    const holders = Math.exp(-0.5 * Math.pow(deviation / (avgPrice * 0.1), 2)) * (totalHolders / 5);
    data.push({
      price: price,
      priceLabel: `~${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      holders: Math.max(5, holders),
    });
  }
  
  // Normalize holders to percentage
  const sumHolders = data.reduce((sum, d) => sum + d.holders, 0);
  return data.map(d => ({
    ...d,
    percentage: parseFloat(((d.holders / sumHolders) * 100).toFixed(1)),
  }));
};

const CustomTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 p-2 border rounded-md shadow-lg text-xs">
        <p className="font-bold">{label}</p>
        <p className="text-foreground">{`보유자 분포: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

export function AveragePriceAnalysis() {
  const [selectedTicker, setSelectedTicker] = useState('btc');
  
  const selectedAsset = useMemo(() => {
    return analysisData.find(asset => asset.id === selectedTicker) || analysisData[0];
  }, [selectedTicker]);

  const { distributionData, currentPriceIndex, avgPriceIndex } = useMemo(() => {
    const data = generateDistributionData(selectedAsset.avgHolderPrice, selectedAsset.currentPrice);
    let currentIdx = -1, avgIdx = -1;
    let minCurrentDiff = Infinity, minAvgDiff = Infinity;
    
    data.forEach((d, i) => {
      const currentDiff = Math.abs(d.price - selectedAsset.currentPrice);
      const avgDiff = Math.abs(d.price - selectedAsset.avgHolderPrice);
      if (currentDiff < minCurrentDiff) {
        minCurrentDiff = currentDiff;
        currentIdx = i;
      }
      if (avgDiff < minAvgDiff) {
        minAvgDiff = avgDiff;
        avgIdx = i;
      }
    });

    return { distributionData: data, currentPriceIndex: currentIdx, avgPriceIndex: avgIdx };
  }, [selectedAsset]);

  const gapPercentage = ((selectedAsset.currentPrice - selectedAsset.avgHolderPrice) / selectedAsset.avgHolderPrice) * 100;
  const isProfitable = gapPercentage > 0;

  const { profitableHoldersPercent, positionPercent } = useMemo(() => {
      let cumulative = 0;
      let profitablePercent = 0;
      let posPercent = 100;

      for (let i = 0; i < distributionData.length; i++) {
        if (i <= avgPriceIndex) {
            profitablePercent += distributionData[i].percentage;
        }
        if (i < currentPriceIndex) {
            cumulative += distributionData[i].percentage;
        } else if (i === currentPriceIndex) {
            cumulative += distributionData[i].percentage / 2;
        }
      }
      posPercent = cumulative;

      return { profitableHoldersPercent: parseFloat(profitablePercent.toFixed(1)), positionPercent: parseFloat(posPercent.toFixed(1)) };
  }, [distributionData, avgPriceIndex, currentPriceIndex]);


  const tableData = useMemo(() => {
      return analysisData.map(asset => {
        const gap = ((asset.currentPrice - asset.avgHolderPrice) / asset.avgHolderPrice) * 100;
        const distribution = generateDistributionData(asset.avgHolderPrice, asset.currentPrice);
        const avgIndex = distribution.findIndex(d => d.price >= asset.avgHolderPrice);
        let belowAvgHolders = 0;
        if(avgIndex !== -1) {
            for(let i=0; i <= avgIndex; i++) {
                belowAvgHolders += distribution[i].percentage;
            }
        }
        
        return {
            ...asset,
            gap,
            belowAvgHolders: parseFloat(belowAvgHolders.toFixed(1)),
            aboveAvgHolders: parseFloat((100 - belowAvgHolders).toFixed(1)),
        }
      }).sort((a,b) => b.gap - a.gap);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-lg font-semibold text-foreground">
          투자자가 가장 궁금해하는 것은 <strong className="text-primary">"내 평단이 남들보다 유리한가?"</strong>입니다.
        </h1>
        <p className="text-muted-foreground mt-2">
          빗썸 내부 데이터를 활용해 '해당 코인 보유자들의 평균 매수 단가'와 '현재가'의 괴리를 보여줍니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>코인별 분석</CardTitle>
            <Select onValueChange={setSelectedTicker} defaultValue={selectedTicker}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="코인 선택" />
              </SelectTrigger>
              <SelectContent>
                {analysisData.map(asset => (
                  <SelectItem key={asset.id} value={asset.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={asset.img} />
                        <AvatarFallback>{asset.ticker}</AvatarFallback>
                      </Avatar>
                      <span>{asset.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col">
               <div className='grid grid-cols-2 gap-4 w-full'>
                    <Card>
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">현재가</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-3xl font-bold">{selectedAsset.currentPrice.toLocaleString()}<span className="text-lg font-medium">원</span></p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">전체 보유자 평균단가</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-3xl font-bold">{selectedAsset.avgHolderPrice.toLocaleString()}<span className="text-lg font-medium">원</span></p>
                        </CardContent>
                    </Card>
               </div>
               <Card className="mt-4 bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-base text-center">분석 요약</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-3">
                      <div className="flex items-center justify-center gap-2">
                         <div className={cn("text-2xl font-bold flex items-center", isProfitable ? 'text-green-500' : 'text-red-500')}>
                            {isProfitable ? <TrendingUp size={24} className="mr-1" /> : <TrendingDown size={24} className="mr-1" />}
                            {gapPercentage.toFixed(2)}%
                          </div>
                          <p className="text-muted-foreground">괴리율</p>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                          현재 <strong className={cn(isProfitable ? 'text-green-500' : 'text-red-500')}>{selectedAsset.name}</strong>의 가격은 전체 보유자 평균 대비 <strong className={cn(isProfitable ? 'text-green-500' : 'text-red-500')}>{Math.abs(gapPercentage).toFixed(1)}%</strong> {isProfitable ? '높은' : '낮은'} 상태입니다. 
                          현재가의 위치는 전체 보유자의 <strong className="text-primary">상위 {(100 - positionPercent).toFixed(1)}%</strong> 지점입니다.
                      </p>
                       <p className="text-sm font-semibold text-primary">
                          {isProfitable ? `지금 매도하면 ${positionPercent.toFixed(0)}%의 보유자보다 높은 가격에 파는 셈이에요!` : `지금 매수하면 ${(100-profitableHoldersPercent).toFixed(0)}%의 보유자보다 유리해요!`}
                      </p>
                  </CardContent>
               </Card>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-center text-muted-foreground">평단가 분포 (빗썸 보유자 %)</h3>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="priceLabel" type="category" width={80} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltipContent />} cursor={{ fill: 'hsl(var(--accent))' }} />

                    <ReferenceLine 
                        y={avgPriceIndex} 
                        stroke="hsl(var(--primary))" 
                        strokeDasharray="3 3" 
                        strokeWidth={2}
                    />

                     <ReferenceLine 
                        y={currentPriceIndex} 
                        stroke={isProfitable ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-1))'} 
                        strokeDasharray="3 3" 
                        strokeWidth={2}
                     />

                    <Bar dataKey="percentage" fill="hsl(var(--primary) / 0.5)" radius={[0, 4, 4, 0]}>
                       <LabelList dataKey="percentage" position="right" formatter={(value: number) => `${value.toFixed(1)}%`} fontSize={11} className="fill-muted-foreground" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>전체 코인 평단 괴리율 비교</CardTitle>
            <CardDescription>현재가와 보유자 평균단가 간의 차이가 큰 종목들을 확인해보세요.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>종목</TableHead>
                        <TableHead className="text-right">괴리율</TableHead>
                        <TableHead className="text-right">평단 이하 보유자 (수익)</TableHead>
                        <TableHead className="text-right">평단 이상 보유자 (손실)</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableData.map(asset => (
                        <TableRow key={asset.id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                     <Avatar className="h-6 w-6">
                                        <AvatarImage src={asset.img} />
                                        <AvatarFallback>{asset.ticker}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-bold">{asset.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className={cn("text-right font-mono font-bold", asset.gap > 0 ? 'text-green-500' : 'text-red-500')}>
                                {asset.gap.toFixed(2)}%
                            </TableCell>
                            <TableCell className="text-right font-mono text-green-500">{asset.belowAvgHolders}%</TableCell>
                            <TableCell className="text-right font-mono text-red-500">{asset.aboveAvgHolders}%</TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm">거래하기</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
