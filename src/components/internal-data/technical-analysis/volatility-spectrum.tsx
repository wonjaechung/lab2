'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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

interface VolatilityCoinData {
  name: string;
  ticker: string;
  value: number; // RVOL value
  metric: 'RVOL';
  img: string;
  price: string;
}

function VolatilityInsight({ coin }: { coin: VolatilityCoinData }) {
    if (coin.value > 2.0) {
        return (
            <p className="text-center text-muted-foreground">
                {coin.name}의 {coin.metric}는 현재 <strong className="text-foreground">{coin.value.toFixed(1)}</strong>으로, 평균보다 <strong className="text-foreground">매우 높은 거래량</strong>을 보이고 있어요. 단기적으로 급격한 가격 변동이 예상되니 신중한 접근이 필요해요.
            </p>
        );
    }
     if (coin.value > 1.5) {
        return (
            <p className="text-center text-muted-foreground">
                {coin.name}의 {coin.metric}는 현재 <strong className="text-foreground">{coin.value.toFixed(1)}</strong>으로, <strong className="text-foreground">평균 이상의 거래량</strong>을 보이고 있어요. 시장의 움직임에 민감하게 반응할 수 있습니다.
            </p>
        );
    }
    return (
        <p className="text-center text-muted-foreground">
            {coin.name}의 {coin.metric}는 <strong className="text-foreground">{coin.value.toFixed(1)}</strong>으로, 현재 <strong className="text-foreground">평균적인 거래량</strong>을 보이고 있습니다.
        </p>
    );
}

const getPositionFromValue = (value: number) => {
    // Scale: 0 to 4, so position is (value / 4) * 100
    const maxVal = 4;
    const position = (value / maxVal) * 100;
    return Math.min(Math.max(position, 0), 100);
}

interface VolatilitySpectrumProps {
    volatilityData: VolatilityCoinData[];
    setVolatilityData: React.Dispatch<React.SetStateAction<VolatilityCoinData[]>>;
    allCoinsData: VolatilityCoinData[];
}


export function VolatilitySpectrum({ volatilityData, setVolatilityData, allCoinsData }: VolatilitySpectrumProps) {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCoin, setActiveCoin] = useState<VolatilityCoinData | null>(null);

  const handleAddCoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoin) return;

    const coinInfo = allCoinsData.find((c) => c.ticker === selectedCoin);
    if (!coinInfo) return;
    
    if (!volatilityData.some((coin) => coin.ticker === coinInfo.ticker)) {
      setVolatilityData([...volatilityData, coinInfo].sort((a, b) => b.value - a.value));
    }
    setSelectedCoin(null);
  };
  
  const handleRemoveCoin = (ticker: string) => {
    setVolatilityData(volatilityData.filter(c => c.ticker !== ticker));
    setModalOpen(false);
    setActiveCoin(null);
  }

  const handleIconClick = (coin: VolatilityCoinData) => {
    setActiveCoin(coin);
    setModalOpen(true);
  };

  return (
    <div className="w-full">
        <div className="flex justify-between items-center w-full mb-6">
            <h3 className="text-lg font-semibold text-foreground">
                거래량 급등 코인을 확인하고 기회를 포착하세요.
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
        <div className="relative h-8 w-full rounded-full bg-gradient-to-r from-gray-200 via-yellow-200 to-primary/80">
          {volatilityData.map((coin) => (
             <button
                key={coin.name}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                style={{ left: `${getPositionFromValue(coin.value)}%` }}
                onClick={() => handleIconClick(coin)}
              >
                <Avatar className="h-8 w-8 border-2 border-white shadow-md">
                  <AvatarImage src={coin.img} alt={coin.name} />
                  <AvatarFallback>{coin.ticker.charAt(0)}</AvatarFallback>
                </Avatar>
              </button>
          ))}
        </div>
        <div className="relative w-full h-4 mt-2">
            <div className="absolute h-full border-l border-dashed" style={{left: '25%'}}></div>
            <div className="absolute h-full border-l border-dashed" style={{left: '50%'}}></div>
            <div className="absolute h-full border-l border-dashed" style={{left: '75%'}}></div>
            <div className="absolute left-[25%] -translate-x-1/2 text-xs text-muted-foreground">평균</div>
            <div className="absolute left-[50%] -translate-x-1/2 text-xs text-muted-foreground">+100%</div>
            <div className="absolute left-[75%] -translate-x-1/2 text-xs text-muted-foreground">+200%</div>
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
                        <p className="text-4xl font-bold">{activeCoin.metric} {activeCoin.value.toFixed(1)}</p>
                    </div>
                   <VolatilityInsight coin={activeCoin} />
                </div>
                <div className="flex flex-col gap-2">
                    <Button 
                      className="w-full font-bold bg-primary hover:bg-primary/90"
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
