
'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const btcTreasuryData = [
    { rank: 1, ticker: 'MSTR', name: 'MicroStrategy', holdings: 660624, monthlyChange: 1500, supplyPercent: 3.146, img: 'https://g.twimg.com/Twitter_logo_blue.png' },
    { rank: 2, ticker: 'MARA', name: 'Marathon Digital Holdings', holdings: 53250, monthlyChange: 0, supplyPercent: 0.254, img: 'https://g.twimg.com/Twitter_logo_blue.png' },
    { rank: 3, ticker: 'XXI', name: 'Twenty One Capital', holdings: 43514, monthlyChange: -120, supplyPercent: 0.207, img: 'https://g.twimg.com/Twitter_logo_blue.png' },
    { rank: 4, ticker: 'MTPLF', name: 'Metaplanet Inc.', holdings: 30823, monthlyChange: 500, supplyPercent: 0.147, img: 'https://g.twimg.com/Twitter_logo_blue.png' },
    { rank: 5, ticker: 'CEPO', name: 'Bitcoin Standard Treasury', holdings: 30021, monthlyChange: 0, supplyPercent: 0.143, img: 'https://g.twimg.com/Twitter_logo_blue.png' },
    { rank: 6, ticker: 'BLSH', name: 'Bullish', holdings: 24300, monthlyChange: 0, supplyPercent: 0.116, img: 'https://g.twimg.com/Twitter_logo_blue.png' },
    { rank: 7, ticker: 'RIOT', name: 'Riot Platforms, Inc.', holdings: 19324, monthlyChange: -50, supplyPercent: 0.092, img: 'https://g.twimg.com/Twitter_logo_blue.png' },
    { rank: 8, ticker: 'COIN', name: 'Coinbase Global, Inc.', holdings: 14548, monthlyChange: 120, supplyPercent: 0.069, img: 'https://g.twimg.com/Twitter_logo_blue.png' },
];

const ethTreasuryData = [
    { rank: 1, ticker: 'ETC', name: 'Ethereum Foundation', holdings: 354311, monthlyChange: 0, supplyPercent: 0.295, img: 'https://g.twimg.com/Twitter_logo_blue.png' },
];


const totalBtcHoldings = btcTreasuryData.reduce((sum, company) => sum + company.holdings, 0);
const totalEthHoldings = ethTreasuryData.reduce((sum, company) => sum + company.holdings, 0);

const assetColors: { [key: string]: string } = {
  btc: '#F7931A',
  eth: '#627EEA',
  BTC: '#F7931A',
  ETH: '#627EEA',
  BTC_Price: '#22C55E',
};

const formatNumber = (value: number) => {
    return value.toLocaleString('en-US');
}

const TreasuryTable = ({ data, assetName }: { data: {rank: number, ticker: string, name: string, holdings: number, monthlyChange: number, supplyPercent: number, img: string}[], assetName: string }) => {
    return (
    <div className="h-full overflow-hidden">
        <div className="overflow-x-auto">
        <div className="w-full">
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs h-8 whitespace-nowrap">회사명</TableHead>
                <TableHead className="text-right text-xs h-8 whitespace-nowrap">보유량</TableHead>
                <TableHead className="text-right text-xs h-8 whitespace-nowrap">월간 변동</TableHead>
                <TableHead className="text-right text-xs h-8 whitespace-nowrap">공급량 %</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((company) => {
                    
                    return (
                    <TableRow key={company.name} className="h-9 hover:bg-muted/30">
                        <TableCell className="py-1">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={company.img} alt={company.name} />
                                    <AvatarFallback>{company.ticker.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-bold text-sm">{company.name}</div>
                                    <div className="text-xs text-muted-foreground">{company.ticker}</div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs py-1 text-foreground whitespace-nowrap">
                            {formatNumber(company.holdings)} {assetName.toUpperCase()}
                        </TableCell>
                        <TableCell className="text-right py-1 whitespace-nowrap">
                            <div className={`font-mono text-xs ${company.monthlyChange >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                                {company.monthlyChange >= 0 ? '+' : ''}{formatNumber(company.monthlyChange)}
                            </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs py-1 text-muted-foreground whitespace-nowrap">
                            {company.supplyPercent.toFixed(3)}%
                        </TableCell>
                    </TableRow>
                    )
                })}
            </TableBody>
        </Table>
        </div>
        </div>
    </div>
)};


const ListView = ({activeAsset}: {activeAsset: string}) => {
    const renderTable = () => {
        switch(activeAsset) {
        case 'btc':
            return <TreasuryTable data={btcTreasuryData} assetName="BTC" />;
        case 'eth':
            return <TreasuryTable data={ethTreasuryData} assetName="ETH" />;
        default:
            return null;
        }
    }
    return (
        <div className="h-full">
            {renderTable()}
        </div>
    );
}

export function CorporateTreasuryTracker() {
  const [activeAsset, setActiveAsset] = useState<string>('BTC');
  const chartAssets = ['BTC', 'ETH'];

  const getTotalHoldings = (asset: string) => {
    if (asset === 'BTC') return totalBtcHoldings;
    if (asset === 'ETH') return totalEthHoldings;
    return 0;
  };

  return (
    <Card className="w-full max-w-full overflow-hidden">
        <CardHeader>
            <div className="flex items-center gap-4 text-sm">
                  {chartAssets.map(asset => {
                    const total = getTotalHoldings(asset);
                    const isActive = activeAsset === asset;
                    const color = assetColors[asset as keyof typeof assetColors];
                    
                    return (
                      <button
                        key={asset}
                        onClick={() => setActiveAsset(asset)}
                        className={`flex items-center gap-1.5 cursor-pointer transition-all px-3 py-1.5 rounded-md ${
                          isActive 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                        <span className={`font-bold`}>{asset}</span>
                        <span className={`font-mono text-xs`}>
                            {formatNumber(total)}
                        </span>
                      </button>
                    )
                  })}
            </div>
        </CardHeader>
        
        <CardContent>
            <div className="min-h-[200px]">
                <ListView activeAsset={activeAsset.toLowerCase()} />
            </div>
        </CardContent>
    </Card>
  );
}
