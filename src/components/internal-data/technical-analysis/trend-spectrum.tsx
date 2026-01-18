'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface TrendCoinData {
  name: string;
  ticker: string;
  signal: 'Golden Cross' | 'Dead Cross';
  position: number; // 0-100 for horizontal positioning
  img: string;
  price: string;
}

function TrendInsight({ coin }: { coin: TrendCoinData }) {
    if (coin.signal === 'Golden Cross') {
        return (
            <p className="text-center text-muted-foreground">
                {coin.name}에서 <strong className="text-red-500">골든크로스</strong>가 발생했어요. 단기 이동평균선이 장기 이동평균선을 상향 돌파하는 강세 신호로, <strong className="text-foreground">상승 추세 전환</strong>을 기대해볼 수 있어요.
            </p>
        );
    }
    return (
        <p className="text-center text-muted-foreground">
            {coin.name}에서 <strong className="text-blue-500">데드크로스</strong>가 발생했어요. 단기 이동평균선이 장기 이동평균선을 하향 돌파하는 약세 신호로, <strong className="text-foreground">하락 추세 전환</strong>에 주의가 필요해요.
        </p>
    );
}

interface TrendSpectrumProps {
    trendData: TrendCoinData[];
    setTrendData: React.Dispatch<React.SetStateAction<TrendCoinData[]>>;
    allCoinsData: TrendCoinData[];
}

export function TrendSpectrum({ trendData, setTrendData, allCoinsData }: TrendSpectrumProps) {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCoin, setActiveCoin] = useState<TrendCoinData | null>(null);

  const handleAddCoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoin) return;

    const coinInfo = allCoinsData.find((c) => c.ticker === selectedCoin);
    if (!coinInfo) return;
    
    if (!trendData.some((coin) => coin.ticker === coinInfo.ticker)) {
      setTrendData([...trendData, coinInfo]);
    }
    setSelectedCoin(null);
  };
  
  const handleRemoveCoin = (ticker: string) => {
    setTrendData(trendData.filter(c => c.ticker !== ticker));
    setModalOpen(false);
    setActiveCoin(null);
  }

  const handleIconClick = (coin: TrendCoinData) => {
    setActiveCoin(coin);
    setModalOpen(true);
  };

  return (
    <div className="w-full">
        <div className="flex justify-between items-center w-full mb-6">
            <h3 className="text-lg font-semibold text-foreground">
                추세 신호를 포착하고 다음 움직임을 예측하세요.
            </h3>
            <form
              onSubmit={handleAddCoin}
              className="flex items-center justify-center gap-2"
            >
              <Select onValueChange={setSelectedCoin} value={selectedCoin || ''}>
                <SelectTrigger className="w-[180px] h-10 rounded-full">
                  <SelectValue placeholder="코인 선택" />
                </SelectTrigger>
                <SelectContent>
                  {allCoinsData
                    .map((coin) => (
                      <SelectItem key={coin.ticker} value={coin.ticker}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage
                              src={coin.img}
                            />
                            <AvatarFallback>
                              {coin.ticker.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{coin.ticker}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Button type="submit" size="default" className="rounded-full h-10" disabled={!selectedCoin}>
                <Plus className="h-4 w-4 mr-2" />
                코인 추가하기
              </Button>
            </form>
        </div>

      <div className="p-6 rounded-lg">
        <div className="relative h-8 w-full rounded-full bg-gradient-to-r from-blue-600 via-gray-200 to-red-600">
          {trendData.map((coin) => (
             <button
                key={coin.name}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                style={{ left: `${coin.position}%` }}
                onClick={() => handleIconClick(coin)}
              >
                <Avatar className="h-8 w-8 border-2 border-white shadow-md">
                  <AvatarImage src={coin.img} alt={coin.name} />
                  <AvatarFallback>{coin.ticker.charAt(0)}</AvatarFallback>
                </Avatar>
              </button>
          ))}
        </div>
        <div className="relative w-full h-4 mt-2 flex justify-between">
            <div className="text-xs font-semibold text-blue-600">하락 추세</div>
            <div className="text-xs font-semibold text-red-600">상승 추세</div>
        </div>

      </div>
      
      {activeCoin && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="text-center items-center">
                    <Avatar className="h-12 w-12 mb-2">
                        <AvatarImage src={activeCoin.img} alt={activeCoin.name} />
                        <AvatarFallback>{activeCoin.ticker.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <DialogTitle className="text-2xl">{activeCoin.name} ({activeCoin.ticker})</DialogTitle>
                    <p className="text-lg text-muted-foreground">{activeCoin.price}</p>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="text-center">
                        <Badge
                            variant="outline"
                            className={cn('text-lg px-4 py-1',
                            activeCoin.signal === 'Golden Cross'
                                ? 'text-red-600 border-red-200 bg-red-50'
                                : 'text-blue-600 border-blue-200 bg-blue-50'
                            )}
                        >
                            {activeCoin.signal === 'Golden Cross' ? (
                            <ArrowUp className="h-4 w-4 mr-1" />
                            ) : (
                            <ArrowDown className="h-4 w-4 mr-1" />
                            )}
                            {activeCoin.signal}
                        </Badge>
                    </div>
                   <TrendInsight coin={activeCoin} />
                </div>
                <div className="flex flex-col gap-2">
                    <Button 
                      className={cn("w-full font-bold", activeCoin.signal === 'Golden Cross' ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700")}
                    >
                      {activeCoin.name} 거래하러 가기
                    </Button>
                    <Button variant="link" className="text-muted-foreground" onClick={() => handleRemoveCoin(activeCoin.ticker)}>
                        이 목록에서 제거하기
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
    
