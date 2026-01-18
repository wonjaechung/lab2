'use client';

import { useState, useMemo } from 'react';
import { RsiSpectrum } from './rsi-spectrum';
import { TrendSpectrum } from './trend-spectrum';
import { VolatilitySpectrum } from './volatility-spectrum';
import { AtrSpectrum } from './atr-spectrum';
import { TradingViewTickerTape } from './tradingview-ticker-tape';

interface CoinData {
  name: string;
  ticker: string;
  rsi: number;
  img: string;
  price: string;
  slug: string;
}

interface VolatilityCoinData {
  name: string;
  ticker: string;
  value: number;
  metric: 'RVOL';
  img: string;
  price: string;
}

interface AtrCoinData {
  name: string;
  ticker: string;
  value: number;
  metric: 'ATR';
  img: string;
  price: string;
}

interface TrendCoinData {
  name: string;
  ticker: string;
  signal: 'Golden Cross' | 'Dead Cross';
  position: number; // 0-100 for horizontal positioning
  img: string;
  price: string;
}


const allRsiCoinsData: CoinData[] = [
    { name: '리플', ticker: 'XRP', rsi: 28.5, img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032', price: '700원', slug: 'xrp-xrp' },
    { name: '솔라나', ticker: 'SOL', rsi: 45.1, img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032', price: '230,000원', slug: 'solana-sol' },
    { name: '비트코인', ticker: 'BTC', rsi: 52.3, img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032', price: '98,000,000원', slug: 'bitcoin-btc' },
    { name: '이더리움', ticker: 'ETH', rsi: 82.1, img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032', price: '4,800,000원', slug: 'ethereum-eth' },
    { name: '도지코인', ticker: 'DOGE', rsi: 60, img: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=032', price: '210원', slug: 'dogecoin-doge' },
    { name: '카르다노', ticker: 'ADA', rsi: 29.1, img: 'https://cryptologos.cc/logos/cardano-ada-logo.svg?v=032', price: '650원', slug: 'cardano-ada' },
    { name: '아발란체', ticker: 'AVAX', rsi: 65, img: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=032', price: '50,000원', slug: 'avalanche-avax' },
    { name: '월드코인', ticker: 'WLD', rsi: 85.2, img: 'https://cryptologos.cc/logos/worldcoin-org-wld-logo.svg?v=032', price: '6,500원', slug: 'worldcoin-org-wld' },
    { name: '싱귤래리티넷', ticker: 'AGIX', rsi: 82.1, img: 'https://cryptologos.cc/logos/singularitynet-agix-logo.svg?v=032', price: '1,200원', slug: 'singularitynet-agix' },
];

const allVolatilityCoinsData: VolatilityCoinData[] = [
    { name: '월드코인', ticker: 'WLD', value: 3.8, metric: 'RVOL', img: 'https://cryptologos.cc/logos/worldcoin-org-wld-logo.svg?v=032', price: '6,500원' },
    { name: '멀티버스엑스', ticker: 'EGLD', value: 3.4, metric: 'RVOL', img: 'https://cryptologos.cc/logos/multiversx-egld-egld-logo.svg?v=032', price: '41,000원' },
    { name: '페페', ticker: 'PEPE', value: 3.1, metric: 'RVOL', img: 'https://cryptologos.cc/logos/pepe-pepe-logo.svg?v=032', price: '0.017원' },
    { name: '아이콘', ticker: 'ICX', value: 2.2, metric: 'RVOL', img: 'https://cryptologos.cc/logos/icon-icx-logo.svg?v=032', price: '320원' },
    { name: '트론', ticker: 'TRX', value: 1.9, metric: 'RVOL', img: 'https://cryptologos.cc/logos/tron-trx-logo.svg?v=032', price: '160원' },
    { name: '헤데라', ticker: 'HBAR', value: 1.5, metric: 'RVOL', img: 'https://cryptologos.cc/logos/hedera-hbar-logo.svg?v=032', price: '110원' },
    { name: '비트코인', ticker: 'BTC', value: 1.0, metric: 'RVOL', img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032', price: '98,000,000원' },
];

const allAtrCoinsData: AtrCoinData[] = [
    { name: '도지코인', ticker: 'DOGE', value: 0.8, metric: 'ATR', img: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=032', price: '210원' },
    { name: '리플', ticker: 'XRP', value: 1.2, metric: 'ATR', img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032', price: '700원' },
    { name: '솔라나', ticker: 'SOL', value: 2.5, metric: 'ATR', img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032', price: '230,000원' },
    { name: '이더리움', ticker: 'ETH', value: 1.5, metric: 'ATR', img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032', price: '4,800,000원' },
    { name: '비트코인', ticker: 'BTC', value: 1.0, metric: 'ATR', img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032', price: '98,000,000원' },
];

const allTrendCoinsData: TrendCoinData[] = [
  { name: '비트코인', ticker: 'BTC', signal: 'Golden Cross', position: 85, img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032', price: '98,000,000원' },
  { name: '이더리움', ticker: 'ETH', signal: 'Golden Cross', position: 95, img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032', price: '4,800,000원' },
  { name: '리플', ticker: 'XRP', signal: 'Dead Cross', position: 15, img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032', price: '700원' },
  { name: '솔라나', ticker: 'SOL', signal: 'Dead Cross', position: 5, img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032', price: '230,000원' },
  { name: '도지코인', ticker: 'DOGE', signal: 'Golden Cross', position: 65, img: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=032', price: '210원' },
];

const tickerToProName: { [key: string]: string } = {
  BTC: 'BITSTAMP:BTCUSD',
  ETH: 'BITSTAMP:ETHUSD',
  SOL: 'COINBASE:SOLUSD',
  XRP: 'BITSTAMP:XRPUSD',
  PEPE: 'BINANCE:PEPEUSDT',
  ADA: 'BINANCE:ADAUSDT',
  SUI: 'BINANCE:SUIUSDT',
  DOGE: 'BINANCE:DOGEUSDT',
  AVAX: 'COINBASE:AVAXUSD',
  WLD: 'BINANCE:WLDUSDT',
  AGIX: 'BINANCE:AGIXUSDT',
  EGLD: 'BINANCE:EGLDUSDT',
  ICX: 'BINANCE:ICXUSDT',
  TRX: 'BINANCE:TRXUSDT',
  HBAR: 'BINANCE:HBARUSDT',
};


export function TechnicalAnalysisGrid() {
  const [rsiData, setRsiData] = useState<CoinData[]>([
    allRsiCoinsData.find(c => c.ticker === 'XRP')!,
    allRsiCoinsData.find(c => c.ticker === 'SOL')!,
    allRsiCoinsData.find(c => c.ticker === 'BTC')!,
    allRsiCoinsData.find(c => c.ticker === 'ETH')!,
  ]);
  const [volatilityData, setVolatilityData] = useState<VolatilityCoinData[]>(allVolatilityCoinsData.slice(0, 5));
  const [atrData, setAtrData] = useState<AtrCoinData[]>(allAtrCoinsData.slice(0, 5));
  const [trendData, setTrendData] = useState<TrendCoinData[]>(allTrendCoinsData);


  const tradingViewSymbols = useMemo(() => {
    const allTickers = [
      ...rsiData.map(c => c.ticker),
      ...volatilityData.map(c => c.ticker),
      ...atrData.map(c => c.ticker),
      ...trendData.map(c => c.ticker),
    ];
    const uniqueTickers = [...new Set(allTickers)];
    
    return uniqueTickers.map(ticker => ({
      proName: tickerToProName[ticker] || `BINANCE:${ticker}USDT`,
      title: allRsiCoinsData.find(c => c.ticker === ticker)?.name || ticker,
    })).filter(symbol => symbol.proName);
  }, [rsiData, volatilityData, atrData, trendData]);


  return (
    <div className="space-y-12">
      <TradingViewTickerTape symbols={tradingViewSymbols} />
       <div className="space-y-12">
          <RsiSpectrum 
            rsiData={rsiData}
            setRsiData={setRsiData}
            allCoinsData={allRsiCoinsData}
          />
          <VolatilitySpectrum 
            volatilityData={volatilityData}
            setVolatilityData={setVolatilityData}
            allCoinsData={allVolatilityCoinsData}
          />
           <AtrSpectrum
            atrData={atrData}
            setAtrData={setAtrData}
            allCoinsData={allAtrCoinsData}
          />
          <TrendSpectrum
            trendData={trendData}
            setTrendData={setTrendData}
            allCoinsData={allTrendCoinsData}
          />
       </div>
    </div>
  );
}
