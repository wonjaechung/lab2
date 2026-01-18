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

interface CoinData {
  name: string;
  ticker: string;
  rsi: number;
  img: string;
  price: string;
  slug: string;
}

function RsiInsight({ rsi }: { rsi: number }) {
    if (rsi < 30) {
        return (
            <p className="text-center text-muted-foreground">
                현재 <strong className="text-foreground">과매도</strong> 구간이에요. 파는 사람이 너무 많아서 가격이 많이 떨어졌다는 뜻이죠. 통계적으로 반등할 가능성이 있어요. <strong className="text-foreground">저점 매수</strong> 기회일지도 몰라요!
            </p>
        );
    }
    if (rsi > 70) {
        return (
            <p className="text-center text-muted-foreground">
                현재 <strong className="text-foreground">과매수</strong> 구간이에요. 사는 열기가 너무 뜨거워요. 가격이 잠시 조정받을 수 있으니 주의가 필요해요.
            </p>
        );
    }
    return (
        <p className="text-center text-muted-foreground">
            지금은 <strong className="text-foreground">중립</strong> 상태예요. 특별한 과열 신호 없이 안정적으로 흘러가고 있어요.
        </p>
    );
}

interface RsiSpectrumProps {
    rsiData: CoinData[];
    setRsiData: React.Dispatch<React.SetStateAction<CoinData[]>>;
    allCoinsData: CoinData[];
}

export function RsiSpectrum({ rsiData, setRsiData, allCoinsData }: RsiSpectrumProps) {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCoin, setActiveCoin] = useState<CoinData | null>(null);

  const handleAddCoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoin) return;

    const coinInfo = allCoinsData.find((c) => c.ticker === selectedCoin);
    if (!coinInfo) return;
    
    if (!rsiData.some((coin) => coin.ticker === coinInfo.ticker)) {
      setRsiData([...rsiData, coinInfo]);
    }
    setSelectedCoin(null);
  };
  
  const handleRemoveCoin = (ticker: string) => {
    setRsiData(rsiData.filter(c => c.ticker !== ticker));
    setModalOpen(false);
    setActiveCoin(null);
  }

  const handleIconClick = (coin: CoinData) => {
    setActiveCoin(coin);
    setModalOpen(true);
  };

  return (
    <div className="w-full">
        <div className="flex justify-between items-center w-full mb-6">
            <h3 className="text-lg font-semibold text-foreground">
                과매수/과매도 상태를 확인해보세요.
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
        <div className="relative h-8 w-full rounded-full bg-gradient-to-r from-[#0051C7] via-white to-[#D60000]">
          {rsiData.map((coin) => (
             <button
                key={coin.name}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                style={{ left: `${coin.rsi}%` }}
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
            <div className="absolute h-full border-l border-dashed" style={{left: '30%'}}></div>
            <div className="absolute h-full border-l border-dashed" style={{left: '70%'}}></div>
            <div className="absolute left-0 text-xs text-muted-foreground">과매도</div>
            <div className="absolute right-0 text-xs text-muted-foreground">과매수</div>
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
                        <p className="text-4xl font-bold">RSI {activeCoin.rsi.toFixed(1)}</p>
                    </div>
                   <RsiInsight rsi={activeCoin.rsi} />
                </div>
                <div className="flex flex-col gap-2">
                    <Button 
                      className={cn("w-full font-bold", activeCoin.rsi < 30 ? "bg-blue-600 hover:bg-blue-700" : activeCoin.rsi > 70 ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/90")}
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
