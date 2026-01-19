
'use client';

import React, { useState } from 'react';
import { CalendarClock, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UpcomingEvents } from './upcoming-events';

export function ScheduleBanner() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button 
          className="w-full h-full bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between transition-all active:scale-[0.99] group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <CalendarClock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-blue-900">시장 일정 한눈에 파악하기</h3>
              <p className="text-sm text-blue-600/80 mt-1">주요 경제 지표와 호재 이슈를 놓치지 마세요</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-lg font-bold sr-only">
              주요 일정 캘린더
            </DialogTitle>
        </DialogHeader>
        <UpcomingEvents isDialogOpen={isDialogOpen} onOpenChange={setIsDialogOpen} showFullCalendar={true} />
      </DialogContent>
    </Dialog>
  );
}
