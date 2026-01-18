'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import { allAssets, themeAssets as initialThemeAssets } from './data';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Theme = (typeof allAssets)[0] & {
  assets: (typeof allAssets)[0][];
};

type SortDirection = 'asc' | 'desc';

const getThemeCategoryParam = (themeId: string): string => {
  const categoryMap: Record<string, string> = {
    'AI': 'ai',
    'L2': 'l2',
    'GAME': 'game',
    'DeFi': 'defi',
    'RWA': 'rwa',
  };
  return categoryMap[themeId] || '';
};

export function ThemeDetails() {
  const [activePeriod, setActivePeriod] = useState('1D');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const themeData = useMemo(() => {
    const data = Object.keys(initialThemeAssets).map((themeId) => {
      const themeInfo = allAssets.find((a) => a.id === themeId);
      const assets = (initialThemeAssets[themeId] || [])
        .map((assetId) => allAssets.find((a) => a.id === assetId))
        .filter(Boolean) as (typeof allAssets)[0][];

      return {
        ...themeInfo,
        assets,
      } as Theme;
    });

    return data.sort((a, b) => {
      const changeA = a.change?.[activePeriod as keyof typeof a.change] ?? 0;
      const changeB = b.change?.[activePeriod as keyof typeof b.change] ?? 0;
      if (sortDirection === 'desc') {
        return changeB - changeA;
      }
      return changeA - changeB;
    });
  }, [activePeriod, sortDirection]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">테마 랭킹</h1>
        <div className="flex items-center gap-4">
          <div className="flex gap-1 rounded-md bg-muted p-1">
            {(['1D', '1W', '1M', '1Y']).map((period) => (
              <Button
                key={period}
                variant={activePeriod === period ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActivePeriod(period)}
                className="h-8 px-4 text-xs rounded"
              >
                {period === '1D' ? '오늘' : period === '1W' ? '1주' : period === '1M' ? '1개월' : '1년'}
              </Button>
            ))}
          </div>
          <div className="flex gap-1 rounded-md bg-muted p-1">
            <Button
              variant={sortDirection === 'desc' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortDirection('desc')}
              className="h-8 px-4 text-xs rounded flex items-center gap-1"
            >
              <ArrowUp className="w-4 h-4 text-red-500" />
              상승순
            </Button>
            <Button
              variant={sortDirection === 'asc' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortDirection('asc')}
              className="h-8 px-4 text-xs rounded flex items-center gap-1"
            >
              <ArrowDown className="w-4 h-4 text-blue-500" />
              하락순
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themeData.map((theme) => {
          if (!theme.id) return null;

          const themeChange = theme.change?.[activePeriod as keyof typeof theme.change] ?? 0;
          const isPositive = themeChange >= 0;

          return (
            <Card key={theme.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold">{theme.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{theme.value}</p>
                  </div>
                  <div
                    className={cn(
                      'flex items-center text-lg font-bold',
                      isPositive ? 'text-red-500' : 'text-blue-500'
                    )}
                  >
                    {isPositive ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
                    {Math.abs(themeChange).toFixed(2)}%
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                {theme.assets.slice(0, 3).map((asset) => {
                  const assetChange = asset.change?.[activePeriod as keyof typeof asset.change] ?? 0;
                  const assetIsPositive = assetChange >= 0;

                  return (
                    <div key={asset.id} className="flex items-center p-2 rounded-lg hover:bg-muted/50">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={asset.img} alt={asset.name} />
                        <AvatarFallback>{asset.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{asset.name}</div>
                        <div className="text-xs text-muted-foreground">{asset.id}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm">{asset.value}</div>
                        <div
                          className={cn(
                            'text-xs font-semibold',
                            assetIsPositive ? 'text-red-500' : 'text-blue-500'
                          )}
                        >
                          {assetIsPositive ? '+' : ''}
                          {assetChange.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
              <Link href={`/internal-data?tab=comparison&filter=category&category=${getThemeCategoryParam(theme.id)}`}>
                <Button variant="ghost" className="w-full mt-2 text-sm text-muted-foreground">
                  구성종목 전체보기
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
