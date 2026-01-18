'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function TierBenefitCalculator() {
  const nextTier = 'BLACK';
  const estimatedBenefit = 1400000;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="text-center">
        <CardTitle>승급 혜택 계산기</CardTitle>
        <CardDescription>
          다음 등급 달성 시 예상 혜택을 확인해보세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center text-center">
        <p className="text-muted-foreground">지난달 거래액 기준,</p>
        <p className="text-muted-foreground">
          <span className="font-bold text-primary">{nextTier} 등급</span>
          이었다면
        </p>
        <p className="text-4xl font-bold text-primary my-2">
          월 {estimatedBenefit.toLocaleString()}원
        </p>
        <p className="text-muted-foreground">추가 혜택을 받을 수 있었어요.</p>
      </CardContent>
      <CardFooter>
        <Button size="lg" variant="outline" className="w-full">
          멤버십 혜택 자세히 보기
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
