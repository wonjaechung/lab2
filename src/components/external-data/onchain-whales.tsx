
'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const allPositionsData = [
    { ticker: 'ETH', name: 'Ethereum', long: 897.44, short: 830.53, total: 1730, price: 3520000, changePercent: 1.2, img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032' },
    { ticker: 'BTC', name: 'Bitcoin', long: 362.86, short: 369.66, total: 732.52, price: 98200000, changePercent: -0.5, img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032' },
    { ticker: 'SOL', name: 'Solana', long: 97.92, short: 98.53, total: 196.45, price: 210000, changePercent: 0.2, img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032' },
    { ticker: 'XRP', name: 'XRP', long: 84.42, short: 61.69, total: 146.11, price: 845, changePercent: 2.8, img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032' },
    { ticker: 'PEPE', name: 'Pepe', long: 172.10, short: 263.62, total: 435.73, price: 0.012, changePercent: -3.5, img: 'https://cryptologos.cc/logos/pepe-pepe-logo.svg?v=032' },
    { ticker: 'ZEC', name: 'Zcash', long: 21.65, short: 46.31, total: 67.96, price: 185000, changePercent: -5.2, img: 'https://cryptologos.cc/logos/zcash-zec-logo.svg?v=032' },
    { ticker: 'SHIB', name: 'Shiba Inu', long: 4.58, short: 26.81, total: 31.39, price: 0.035, changePercent: -12.4, img: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.svg?v=032' },
    { ticker: 'SEI', name: 'Sei', long: 6.66, short: 16.67, total: 23.33, price: 1500, changePercent: -8.1, img: 'https://cryptologos.cc/logos/sei-sei-logo.svg?v=032' },
    { ticker: 'ENA', name: 'Ena', long: 4.15, short: 16.90, total: 21.05, price: 5200, changePercent: -15.3, img: 'https://cryptologos.cc/logos/ethena-ena-logo.svg?v=032' },
    { ticker: 'XLM', name: 'Stellar', long: 4.31, short: 15.31, total: 19.62, price: 180, changePercent: -10.2, img: 'https://cryptologos.cc/logos/stellar-xlm-logo.svg?v=032' },
    { ticker: 'EGLD', name: 'MultiversX', long: 8.5, short: 12.3, total: 20.8, price: 45000, changePercent: 3.2, img: 'https://cryptologos.cc/logos/multiversx-egld-logo.svg?v=032' },
    { ticker: 'SUI', name: 'Sui', long: 15.2, short: 18.5, total: 33.7, price: 2800, changePercent: 5.8, img: 'https://cryptologos.cc/logos/sui-sui-logo.svg?v=032' },
    { ticker: 'DOGE', name: 'Dogecoin', long: 45.3, short: 38.7, total: 84.0, price: 215, changePercent: 1.5, img: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=032' },
    { ticker: 'ADA', name: 'Cardano', long: 28.9, short: 22.1, total: 51.0, price: 650, changePercent: -2.1, img: 'https://cryptologos.cc/logos/cardano-ada-logo.svg?v=032' },
    { ticker: 'LINK', name: 'Chainlink', long: 12.4, short: 9.8, total: 22.2, price: 18500, changePercent: 4.3, img: 'https://cryptologos.cc/logos/chainlink-link-logo.svg?v=032' },
    { ticker: 'DOT', name: 'Polkadot', long: 18.6, short: 15.4, total: 34.0, price: 7200, changePercent: -1.8, img: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.svg?v=032' },
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

const formatPrice = (price: number) => {
    if (price >= 1000000) {
        return `${(price / 10000).toFixed(0)}만원`;
    } else if (price >= 1000) {
        return `${price.toLocaleString('ko-KR')}원`;
    } else {
        return `${price.toFixed(3)}원`;
    }
};

// 모의 데이터: 내가 보유한 코인 목록
const myHoldings = ['ETH', 'BTC', 'SOL', 'XRP', 'LINK'];

function DexFuturesPositions() {
    const [showAll, setShowAll] = useState(false);
    const [showMyHoldingsOnly, setShowMyHoldingsOnly] = useState(false);
    const initialCount = 10;
    
    // 필터링된 데이터
    const filteredData = showMyHoldingsOnly 
        ? allPositionsData.filter(item => myHoldings.includes(item.ticker))
        : allPositionsData;
    
    const displayedData = showAll ? filteredData : filteredData.slice(0, initialCount);
    
    return (
        <div>
            <div className="flex items-center justify-end mb-4">
                <div className="flex items-center gap-2">
                    {showMyHoldingsOnly && (
                        <span className="text-sm text-muted-foreground">
                            {filteredData.length}개
                        </span>
                    )}
                    <Button
                        variant={showMyHoldingsOnly ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowMyHoldingsOnly(!showMyHoldingsOnly)}
                        className="h-8"
                    >
                        {showMyHoldingsOnly ? '전체 보기' : '내 보유 코인만 보기'}
                    </Button>
                </div>
            </div>
            {showMyHoldingsOnly && filteredData.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    보유한 코인이 없습니다.
                </div>
            )}
            <div className="space-y-4">
                {displayedData.map(item => (
                    <div key={item.ticker} className="grid grid-cols-12 items-center gap-4 text-sm">
                        <div className="col-span-3 flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={item.img} alt={item.ticker} />
                            <AvatarFallback>{item.ticker.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground">{item.ticker}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground font-mono">{formatPrice(item.price)}</span>
                                <span className={`text-xs font-semibold ${item.changePercent >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                    {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                                </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-7">
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
            {!showAll && filteredData.length > initialCount && (
                <div className="flex justify-center mt-6">
                    <Button 
                        variant="outline" 
                        onClick={() => setShowAll(true)}
                        className="px-6"
                    >
                        더보기
                    </Button>
                </div>
            )}
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
