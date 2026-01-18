'use client';

import { useState, useEffect } from 'react';
import {
  Coins,
  Scale,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '../ui/button';

// Flame and Droplet are not in lucide-react, so using inline SVGs
const Flame = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.072-2-3.83-2-5a2.5 2.5 0 0 0-5 0c0 1.17 1 3 2 5 .5 1 1 1.62 1 3a2.5 2.5 0 0 0 2.5 2.5z"/><path d="M14.5 18.5a2.5 2.5 0 0 0 2.5-2.5c0-1.38-.5-2-1-3-1.072-2.072-2-3.83-2-5a2.5 2.5 0 0 0-5 0c0 1.17 1 3 2 5 .5 1 1 1.62 1 3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
);

const Droplet = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
);


const initialAssetDistributionData = [
  {
    label: '현금보유',
    description: '코인 < 10%',
    sub: '(관망)',
    percentage: 25,
    color: 'bg-green-500',
    textColor: 'text-green-500',
    lightColor: 'bg-green-100/50',
    borderColor: 'border-green-200',
    icon: Coins,
    ctaText: '하락장에서도 수익내기',
    ctaLink: '#', // Placeholder for lending page
  },
  {
    label: '밸런스',
    description: '코인 10-50%',
    sub: '(분산)',
    percentage: 45,
    color: 'bg-yellow-500',
    textColor: 'text-yellow-500',
    lightColor: 'bg-yellow-100/50',
    borderColor: 'border-yellow-200',
    icon: Scale,
    ctaText: '다른 고수들의 포트폴리오',
    ctaLink: '#', // Placeholder for portfolio page
  },
  {
    label: '공격투자',
    description: '코인 50-90%',
    sub: '(확신)',
    percentage: 20,
    color: 'bg-orange-500',
    textColor: 'text-orange-500',
    lightColor: 'bg-orange-100/50',
    borderColor: 'border-orange-200',
    icon: Flame,
    ctaText: '다른 고수들의 포트폴리오',
    ctaLink: '#',
  },
  {
    label: '올인',
    description: '코인 > 90%',
    sub: '(야수)',
    percentage: 10,
    color: 'bg-red-600',
    textColor: 'text-red-600',
    lightColor: 'bg-red-100/50',
    borderColor: 'border-red-200',
    icon: Droplet,
    ctaText: '다른 고수들의 포트폴리오',
    ctaLink: '#',
  },
];

const generateRandomDistribution = () => {
    let nums = [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100];
    const sum = nums.reduce((a, b) => a + b, 0);
    const percentages = nums.map(n => Math.round((n / sum) * 100));

    let currentSum = percentages.reduce((a,b) => a + b, 0);
    let diff = 100 - currentSum;
    
    // Adjust to make sum 100
    percentages[percentages.indexOf(Math.max(...percentages))] += diff;
    
    return initialAssetDistributionData.map((item, index) => ({
        ...item,
        percentage: percentages[index]
    }));
}


export function UserAssetDistribution() {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [assetDistributionData, setAssetDistributionData] = useState(initialAssetDistributionData);
  const [fomoIndex, setFomoIndex] = useState(72);

  useEffect(() => {
    const interval = setInterval(() => {
        const newDistribution = generateRandomDistribution();
        setAssetDistributionData(newDistribution);
        
        const aggressivePercentage = newDistribution.find(d => d.label === '공격투자')?.percentage || 0;
        const allInPercentage = newDistribution.find(d => d.label === '올인')?.percentage || 0;
        const cashPercentage = newDistribution.find(d => d.label === '현금보유')?.percentage || 0;
        
        const score = (allInPercentage * 1.5) + (aggressivePercentage * 1.0) - (cashPercentage * 1.0);
        const scaledScore = Math.round(((score + 100) / 250) * 100);
        const newFomoIndex = Math.max(0, Math.min(100, scaledScore));
        setFomoIndex(newFomoIndex);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <h3 className="text-lg font-semibold text-foreground">
          빗썸 유저들은 지금, 현금일까 코인일까?
        </h3>
        <div className="text-right">
            <span className="text-muted-foreground text-sm">시장 참여 심리</span>
            <p className="text-2xl font-bold text-red-500">{fomoIndex}점</p>
        </div>
      </div>
      <p className="text-muted-foreground mb-6">
        유저들의 실제 포트폴리오 구성을 분석해 현재 시장 참여자들의 심리를 객관적으로 보여드립니다.
      </p>

      <div className="w-full">
        <div className="flex w-full h-8 rounded-full overflow-hidden text-white font-semibold text-sm">
          {assetDistributionData.map((item) => (
            <div
              key={item.label}
              className={cn('h-full transition-all duration-500 flex items-center justify-center', item.color)}
              style={{ width: `${item.percentage}%` }}
              onMouseEnter={() => setHoveredSegment(item.label)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              {item.percentage > 5 && <span>{item.percentage}%</span>}
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-4 gap-4 text-center">
          {assetDistributionData.map((item) => (
            <div
              key={item.label}
              className={cn(
                'p-4 rounded-lg transition-all duration-300 border flex flex-col',
                 item.lightColor,
                 item.borderColor,
                 hoveredSegment === item.label ? 'transform -translate-y-2 shadow-lg' : 'shadow-sm'
              )}
              onMouseEnter={() => setHoveredSegment(item.label)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div className="flex items-center justify-center gap-2">
                <item.icon className={cn("h-5 w-5", item.textColor)} />
                <span className="text-base font-bold text-foreground">
                  {item.label}
                </span>
                 <span className="text-sm text-muted-foreground">{item.sub}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 mb-4 flex-grow">{item.description}</p>
               <Button asChild variant="outline" size="sm" className={cn(
                   "w-full bg-background/50 text-xs h-8 font-bold",
                   item.textColor,
                   item.borderColor,
                   `hover:${item.color} hover:text-white`
               )}>
                  <Link href={item.ctaLink}>
                    {item.ctaText}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
