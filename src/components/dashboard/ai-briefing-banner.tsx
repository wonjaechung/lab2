
'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Bot } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

// Mock AI briefing data
const aiBriefing = {
  title: "",
  summary: "",
  keyPoints: [],
  nextAction: ""
};

const getSentimentColors = (sentiment: string) => {
    switch (sentiment) {
        case 'positive': return 'bg-red-100 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-500/30 dark:text-red-300';
        case 'negative': return 'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-500/30 dark:text-blue-300';
        case 'warning': return 'bg-yellow-100 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-500/30 dark:text-yellow-300';
        default: return 'bg-secondary border-border';
    }
}


export function AiBriefingBanner() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => {
    setIsDialogOpen(true);
    setIsLoading(true);
    // Simulate loading AI data
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button 
          onClick={handleOpen}
          className="w-full h-full bg-purple-50/50 hover:bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center justify-between transition-all active:scale-[0.99] group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-purple-900">AI로 시장 상황 확인하기</h3>
              <p className="text-sm text-purple-600/80 mt-1">오늘의 시장 이슈를 AI가 요약해드려요</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Bot className="w-6 h-6 text-primary" />
            AI 데일리 브리핑
          </DialogTitle>
          <DialogDescription>
            AI가 분석한 오늘의 가상자산 시장 요약입니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 pb-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="space-y-4 pt-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-base mb-3">{aiBriefing.title}</h3>
              <div className="p-4 bg-muted/50 rounded-lg border mb-6">
                <p className="text-sm text-foreground/90 leading-relaxed">{aiBriefing.summary}</p>
              </div>

              <div className="space-y-3">
                {aiBriefing.keyPoints.map((point, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getSentimentColors(point.sentiment)}`}>
                    <h4 className="font-bold text-sm mb-1">{point.title}</h4>
                    <p className="text-sm leading-snug">{point.content}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-primary/10 rounded-lg text-center">
                <p className="text-sm font-semibold text-primary">{aiBriefing.nextAction}</p>
              </div>
            </div>
          )}
        </div>
         <div className="px-6 py-4 border-t bg-background/80 backdrop-blur-sm sticky bottom-0">
            <Button className="w-full" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                {isLoading ? "분석 중..." : "확인"}
            </Button>
         </div>
      </DialogContent>
    </Dialog>
  );
}
