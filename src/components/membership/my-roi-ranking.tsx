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

export function MyRoiRanking() {
  const userRank = 5;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="text-center">
        <CardTitle>내 현재 위치는?</CardTitle>
        <CardDescription>
          포트폴리오를 공유하고 등급 내 다른 고수들의 투자 현황을 확인해보세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              className="text-muted/40"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              className="text-primary"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              strokeDasharray={`${100 - userRank * 1.5}, 100`}
              transform="rotate(90 18 18)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground">상위</span>
            <span className="text-3xl font-bold text-primary">{userRank}%</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="font-bold text-foreground">
            당신은 BLACK 등급 내 상위 {userRank}%의 고수입니다.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            포트폴리오를 공유하고 다른 고수들의 투자 현황을 확인해보세요.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button size="lg" variant="outline" className="w-full">
          포트폴리오 공유하기
        </Button>
      </CardFooter>
    </Card>
  );
}
