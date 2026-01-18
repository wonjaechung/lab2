
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const positionsData = [
    { ticker: 'ETH', long: 897.44, short: 830.53, total: 1730, img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032' },
    { ticker: 'BTC', long: 362.86, short: 369.66, total: 732.52, img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032' },
    { ticker: 'SOL', long: 97.92, short: 98.53, total: 196.45, img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032' },
    { ticker: 'XRP', long: 84.42, short: 61.69, total: 146.11, img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032' },
    { ticker: 'HYPE', long: 172.10, short: 263.62, total: 435.73, img: 'https://picsum.photos/seed/hype/32/32' },
    { ticker: 'ZEC', long: 21.65, short: 46.31, total: 67.96, img: 'https://cryptologos.cc/logos/zcash-zec-logo.svg?v=032' },
    { ticker: 'FARTCOIN', long: 4.58, short: 26.81, total: 31.39, img: 'https://picsum.photos/seed/fart/32/32' },
    { ticker: 'ASTER', long: 6.66, short: 16.67, total: 23.33, img: 'https://picsum.photos/seed/aster/32/32' },
    { ticker: 'ENA', long: 4.15, short: 16.90, total: 21.05, img: 'https://cryptologos.cc/logos/ethena-ena-logo.svg?v=032' },
    { ticker: 'PUMP', long: 4.31, short: 15.31, total: 19.62, img: 'https://picsum.photos/seed/pump/32/32' },
];

const PositionBar = ({ long, short }: { long: number, short: number }) => {
    const total = long + short;
    const longPercent = total > 0 ? (long / total) * 100 : 0;
    
    return (
        <div className="w-full bg-red-500/20 rounded-full h-5 flex overflow-hidden relative border border-border">
            <div className="bg-green-500/50 h-full transition-all duration-500" style={{ width: `${longPercent}%` }}></div>
             <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-medium">
                <span className="text-green-800 dark:text-green-200 font-semibold">{longPercent.toFixed(1)}%</span>
                <span className="text-red-800 dark:text-red-200 font-semibold">{(100 - longPercent).toFixed(1)}%</span>
            </div>
        </div>
    );
};

function DexFuturesPositions() {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                </div>
            </div>
            <div className="space-y-4">
                {positionsData.map(item => (
                    <div key={item.ticker} className="grid grid-cols-10 items-center gap-4 text-sm">
                        <div className="col-span-2 flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={item.img} alt={item.ticker} />
                            <AvatarFallback>{item.ticker.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                          <span className="font-bold text-foreground">{item.ticker}</span>
                        </div>
                        <div className="col-span-6">
                            <PositionBar long={item.long} short={item.short} />
                        </div>
                         <div className="col-span-2 flex justify-end">
                            <Button variant="outline" size="sm" className="h-8 rounded-lg border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground">
                                거래하기
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


export function OnchainWhales() {
  return (
    <div className="w-full space-y-8">
        <div>
            <h1 className="text-lg font-semibold text-foreground mb-2">고래들은 지금, 매수할까 매도할까?</h1>
            <p className="text-muted-foreground">
                온체인 데이터를 통해 고래들의 포지션을 실시간으로 추적하고, 시장의 다음 움직임을 예측해보세요.
            </p>
        </div>
        <DexFuturesPositions />
    </div>
  );
}
