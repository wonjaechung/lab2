
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Angry, Frown, Smile, Laugh } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export interface JournalEntry {
  date: string; // "yyyy-MM-dd"
  mood?: 'ecstatic' | 'happy' | 'neutral' | 'sad' | 'angry';
  score: number;
  technicalTriggers: string[];
  psychologicalTriggers: string[];
  memo: string;
}

interface TradingJournalProps {
  selectedDate: Date;
  entries: JournalEntry[];
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  setJournalOpen: (open: boolean) => void;
}

const moods = [
  { value: 'ecstatic', icon: <Laugh className="w-8 h-8 text-green-500" />, label: '최고' },
  { value: 'happy', icon: <Smile className="w-8 h-8 text-emerald-500" />, label: '좋음' },
  { value: 'neutral', icon: <Frown className="w-8 h-8 text-yellow-500" />, label: '보통' },
  { value: 'sad', icon: <Frown className="w-8 h-8 text-orange-500" />, label: '나쁨' },
  { value: 'angry', icon: <Angry className="w-8 h-8 text-red-500" />, label: '최악' },
];

const technicalTags = [
  'RSI 과매수', 'RSI 과매도', '거래량 폭발', '골든크로스', '데드크로스', '고베타 진입'
];

const psychologicalTags = [
  '뇌동매매', '물타기', '손절', '익절', 'FOMO', '기도매매', '원칙준수', '데이터', '뉴스', '이벤트', '저점매수', '고점매도'
];


export function TradingJournal({ selectedDate, entries, setEntries, setJournalOpen }: TradingJournalProps) {
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  
  const [entry, setEntry] = useState<JournalEntry>(() => {
    return entries.find(e => e.date === dateString) || {
      date: dateString,
      score: 50,
      technicalTriggers: [],
      psychologicalTriggers: [],
      memo: '',
    }
  });

  useEffect(() => {
    setEntry(entries.find(e => e.date === dateString) || {
        date: dateString,
        score: 50,
        technicalTriggers: [],
        psychologicalTriggers: [],
        memo: '',
      });
  }, [dateString, entries]);

  const handleSave = () => {
    setEntries(prev => {
        const existingEntryIndex = prev.findIndex(e => e.date === dateString);
        if (existingEntryIndex > -1) {
            const newEntries = [...prev];
            newEntries[existingEntryIndex] = entry;
            return newEntries;
        }
        return [...prev, entry];
    });
    setJournalOpen(false);
  };

  const handleToggle = (type: 'technical' | 'psychological', value: string) => {
    const key = type === 'technical' ? 'technicalTriggers' : 'psychologicalTriggers';
    const currentTags = entry[key];
    const newTags = currentTags.includes(value)
      ? currentTags.filter(tag => tag !== value)
      : [...currentTags, value];
    setEntry(prev => ({...prev, [key]: newTags }));
  }

  return (
    <div className="h-full flex flex-col bg-background max-h-[75vh]">
      <ScrollArea className="flex-1">
        <CardContent className="p-6 space-y-8">
          
          <div>
            <h3 className="text-md font-semibold mb-3">오늘의 매매 기분은?</h3>
            <ToggleGroup 
              type="single" 
              value={entry.mood}
              onValueChange={(mood) => setEntry(prev => ({ ...prev, mood: mood as any }))}
              className="flex justify-around"
            >
              {moods.map(m => (
                <ToggleGroupItem 
                    key={m.value} 
                    value={m.value} 
                    aria-label={m.label}
                    className="flex flex-col h-auto p-2 rounded-lg border data-[state=on]:bg-accent data-[state=on]:border-primary data-[state=on]:border-2"
                >
                    {m.icon}
                    <span className="text-xs mt-1">{m.label}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div>
          <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-md font-semibold">나의 매매 점수</h3>
                <p className="text-sm text-muted-foreground">
                    <span>수익보다 원칙 준수가 중요해요.</span>
                    <br/>
                    <span>스스로 평가하는 오늘의 점수는?</span>
                </p>
              </div>
              <span className="text-2xl font-bold text-primary w-16 text-center">{entry.score} 점</span>
            </div>
            <Slider
              value={[entry.score]}
              onValueChange={(value) => setEntry(prev => ({ ...prev, score: value[0] }))}
              max={100}
              step={1}
            />
          </div>

          <div>
            <h3 className="text-md font-semibold mb-3">기술적 근거</h3>
            <div className="flex flex-wrap gap-2">
                {technicalTags.map(tag => (
                    <Button 
                        key={tag} 
                        variant={entry.technicalTriggers.includes(tag) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleToggle('technical', tag)}
                    >{tag}</Button>
                ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-3">매매 심리/원인</h3>
             <div className="flex flex-wrap gap-2">
                {psychologicalTags.map(tag => (
                    <Button 
                        key={tag} 
                        variant={entry.psychologicalTriggers.includes(tag) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleToggle('psychological', tag)}
                    >{tag}</Button>
                ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-3">매매 메모</h3>
            <Textarea 
                value={entry.memo}
                onChange={(e) => setEntry(prev => ({ ...prev, memo: e.target.value }))}
                placeholder="오늘 매매에서 배운 점이나 내일의 전략을 적어보세요."
                className="min-h-[120px]"
            />
          </div>

        </CardContent>
      </ScrollArea>

      <div className="p-4 border-t flex-none">
        <Button onClick={handleSave} className="w-full h-12 text-lg font-bold">저장 완료</Button>
      </div>
    </div>
  );
}
