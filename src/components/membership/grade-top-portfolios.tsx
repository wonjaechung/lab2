'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Copy, ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

// 전체 포트폴리오 데이터 생성
const generateAllPortfolios = () => {
  const portfolios = [
    {
      rank: 1,
      nickname: '고수123',
      roi: 45.2,
      topCoins: [
        { ticker: 'PEPE', name: '페페', weight: 25, return: 85.2, img: 'https://cryptologos.cc/logos/pepe-pepe-logo.svg?v=032' },
        { ticker: 'SOL', name: '솔라나', weight: 20, return: 65.1, img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032' },
        { ticker: 'WLD', name: '월드코인', weight: 15, return: 45.2, img: 'https://cryptologos.cc/logos/worldcoin-org-wld-logo.svg?v=032' },
      ],
      totalAssets: 125000000,
    },
    {
      rank: 2,
      nickname: '투자왕',
      roi: 38.7,
      topCoins: [
        { ticker: 'SOL', name: '솔라나', weight: 30, return: 65.1, img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032' },
        { ticker: 'AGIX', name: '싱귤래리티넷', weight: 20, return: 55.9, img: 'https://cryptologos.cc/logos/singularitynet-agix-logo.svg?v=032' },
        { ticker: 'LINK', name: '체인링크', weight: 15, return: 42.3, img: 'https://cryptologos.cc/logos/chainlink-link-logo.svg?v=032' },
      ],
      totalAssets: 98000000,
    },
    {
      rank: 3,
      nickname: '코인마스터',
      roi: 32.1,
      topCoins: [
        { ticker: 'PEPE', name: '페페', weight: 35, return: 85.2, img: 'https://cryptologos.cc/logos/pepe-pepe-logo.svg?v=032' },
        { ticker: 'STX', name: '스택스', weight: 18, return: 32.1, img: 'https://cryptologos.cc/logos/stacks-stx-logo.svg?v=032' },
        { ticker: 'RNDR', name: '렌더', weight: 12, return: 28.9, img: 'https://cryptologos.cc/logos/render-rndr-logo.svg?v=032' },
      ],
      totalAssets: 75000000,
    },
  ];

  // 추가 포트폴리오 생성 (4위부터)
  const additionalPortfolios = [
    { nickname: '암호화폐전문가', roi: 28.5, totalAssets: 68000000 },
    { nickname: '디파이킹', roi: 25.3, totalAssets: 55000000 },
    { nickname: '블록체인마스터', roi: 22.1, totalAssets: 48000000 },
    { nickname: '나', roi: 35, totalAssets: 35000000, isMe: true }, // 내 포트폴리오
    { nickname: '초보투자자', roi: 5.2, totalAssets: 28000000 },
    { nickname: '안정추구', roi: 3.1, totalAssets: 22000000 },
    { nickname: '장기투자', roi: 1.8, totalAssets: 18000000 },
    { nickname: '보수투자', roi: 0.5, totalAssets: 15000000 },
  ];

  additionalPortfolios.forEach((p, index) => {
    portfolios.push({
      rank: 4 + index,
      nickname: p.nickname,
      roi: p.roi,
      topCoins: [
        { ticker: 'BTC', name: '비트코인', weight: 30, return: p.roi * 0.8, img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032' },
        { ticker: 'ETH', name: '이더리움', weight: 25, return: p.roi * 0.7, img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032' },
        { ticker: 'SOL', name: '솔라나', weight: 20, return: p.roi * 0.6, img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032' },
      ],
      totalAssets: p.totalAssets,
      isMe: p.isMe || false,
    });
  });

  return portfolios;
};

const allPortfolios = generateAllPortfolios();

export function GradeTopPortfolios({ hideHeader = false }: { hideHeader?: boolean }) {
  const myRank = allPortfolios.findIndex(p => p.isMe) + 1;
  const myPortfolio = allPortfolios.find(p => p.isMe);

  return (
    <Card>
      {!hideHeader && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">등급 내 포트폴리오 랭킹</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                등급 내 모든 유저들의 포트폴리오를 확인하고 따라 투자해보세요
              </p>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent>
        {/* 내 등수 표시 */}
        {myPortfolio && (
          <div className="mb-6 p-4 rounded-lg border-2 border-primary/30 bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {myRank}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg">{myPortfolio.nickname}</p>
                    <Badge variant="default">나</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    총 자산: {(myPortfolio.totalAssets / 10000).toFixed(0)}만원
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  +{myPortfolio.roi.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">수익률</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {allPortfolios.map((portfolio) => (
            <div
              key={portfolio.rank}
              className={cn(
                'p-4 rounded-lg border transition-all hover:shadow-md',
                portfolio.rank === 1
                  ? 'border-primary/30 bg-primary/5'
                  : portfolio.isMe
                  ? 'border-primary/50 bg-primary/10'
                  : 'border-border bg-card'
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                    portfolio.rank === 1
                      ? 'bg-primary text-primary-foreground'
                      : portfolio.rank === 2
                      ? 'bg-muted-foreground/20 text-muted-foreground'
                      : 'bg-muted-foreground/10 text-muted-foreground'
                  )}>
                    {portfolio.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{portfolio.nickname}</p>
                      {portfolio.rank === 1 && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                      {portfolio.isMe && (
                        <Badge variant="default" className="text-xs">나</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      총 자산: {(portfolio.totalAssets / 10000).toFixed(0)}만원
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-500">
                    +{portfolio.roi.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">수익률</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">주요 보유 코인</p>
                {portfolio.topCoins.map((coin) => (
                  <div
                    key={coin.ticker}
                    className="flex items-center justify-between p-2 rounded bg-muted/30"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={coin.img} />
                        <AvatarFallback>{coin.ticker[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{coin.ticker}</p>
                        <p className="text-xs text-muted-foreground">{coin.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs font-semibold">{coin.weight}%</p>
                        <p className="text-xs text-muted-foreground">비중</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-green-500">
                          +{coin.return.toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">수익</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                size="sm"
                variant="default"
                className="w-full"
                onClick={() => console.log('Bundle buy:', portfolio.rank)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                묶음매수
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
