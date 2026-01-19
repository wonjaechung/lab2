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
import { Progress } from '@/components/ui/progress';
import { Badge } from '../ui/badge';

export function NextTierGauge() {
  const currentTier = '화이트';
  const nextTier = '블루';
  const remainingAmount = 2000000;
  const progress =
    100 - (remainingAmount / (remainingAmount + 7000000)) * 100;
  const daysLeft = 5;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="text-center">
        <CardTitle>다음 등급까지</CardTitle>
        <CardDescription>
          더 높은 등급의 혜택을 확인해보세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-primary">{nextTier}</span> 등급
            달성까지
          </p>
          <p className="text-3xl font-bold text-foreground my-1">
            {remainingAmount.toLocaleString()}원
          </p>
          <p className="text-sm text-muted-foreground">남았습니다.</p>
        </div>
        <div className="w-full max-w-sm mt-6">
          <Progress value={progress} className="h-2" indicatorClassName="bg-primary" />
          <div className="w-full flex justify-between text-xs text-muted-foreground mt-2 px-1">
            <span>{currentTier}</span>
            <span>{nextTier}</span>
          </div>
        </div>
        <Badge variant="outline" className="mt-6 font-medium">마감까지 D-{daysLeft}</Badge>
      </CardContent>
      <CardFooter>
        <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
          승급전 도전!
        </Button>
      </CardFooter>
    </Card>
  );
}
