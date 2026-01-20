'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Users, Sparkles, MessageSquare, ArrowUpRight } from 'lucide-react';
import { GradeTopPortfolios } from './grade-top-portfolios';

export function MyRoiRanking() {
  const userRank = 5;
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isPortfolioViewOpen, setIsPortfolioViewOpen] = useState(false);
  const [isCommunityDialogOpen, setIsCommunityDialogOpen] = useState(false);
  const [hasSharedProfile, setHasSharedProfile] = useState(false);
  const [nickname, setNickname] = useState('');

  const handleCreateProfile = () => {
    if (nickname.trim()) {
      setHasSharedProfile(true);
      setIsProfileDialogOpen(false);
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="text-center">
          <CardTitle>내 현재 위치는?</CardTitle>
          <CardDescription>
          
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
              당신은 화이트 등급 내 상위 {userRank}%의 고수입니다.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              포트폴리오를 공유하고 등급 내 다른 고객들의 투자 현황을 확인해보세요.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          {hasSharedProfile ? (
            <Button 
              size="lg" 
              variant="default" 
              className="w-full"
              onClick={() => setIsPortfolioViewOpen(true)}
            >
              <Users className="w-4 h-4 mr-2" />
              다른사람들 포트폴리오 살펴보기
            </Button>
          ) : (
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full"
              onClick={() => setIsProfileDialogOpen(true)}
            >
              포트폴리오 공유하기
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* 익명 프로필 생성 다이얼로그 */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              익명 프로필 생성
            </DialogTitle>
            <DialogDescription>
              포트폴리오를 공유하기 위해 익명 프로필을 만들어주세요
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                placeholder="익명 고수123"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && nickname.trim()) {
                    handleCreateProfile();
                  }
                }}
              />
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold">익명 프로필을 만들면</p>
                  <p className="text-sm text-muted-foreground">
                    포트폴리오 공유하기를 누른 다른 사람들의 포트폴리오를 볼 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1"
                onClick={handleCreateProfile}
                disabled={!nickname.trim()}
              >
                프로필 생성하기
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsProfileDialogOpen(false)}
              >
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 다른 사람들 포트폴리오 보기 다이얼로그 */}
      <Dialog open={isPortfolioViewOpen} onOpenChange={setIsPortfolioViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle>등급 내 포트폴리오 랭킹</DialogTitle>
              <DialogDescription>
                등급 내 모든 유저들의 포트폴리오를 확인하고 따라 투자해보세요
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCommunityDialogOpen(true)}
              className="shrink-0"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              커뮤니티
            </Button>
          </DialogHeader>
          <div className="py-4">
            <GradeTopPortfolios hideHeader={true} />
          </div>
        </DialogContent>
      </Dialog>

      {/* 커뮤니티 기능 안내 다이얼로그 */}
      <Dialog open={isCommunityDialogOpen} onOpenChange={setIsCommunityDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>커뮤니티 기능</DialogTitle>
            <DialogDescription>
              이 기능은 그린등급 이상한테만 오픈됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <ArrowUpRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  등급을 올려서 커뮤니티 기능을 이용해보세요.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={() => setIsCommunityDialogOpen(false)}>
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
