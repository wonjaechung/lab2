'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown, User, Activity, X, Plus, RotateCcw, TrendingUp, TrendingDown, Info, Search } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { AssetDeepDive } from './asset-deep-dive';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { ScrollArea } from '../ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

const assetsData = [
  { rank: 1, name: '비트코인', ticker: 'BTC', today: 5.12, week: 12.5, month: 23.9, marketCap: '1,382조', circulatingSupply: '19,713,934 BTC', supplyRatio: 93.8, img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032', marketCapDominance: '52.5%', athPrice: '101,348,000원', athDate: '2024년 3월 14일'},
  { rank: 2, name: '이더리움', ticker: 'ETH', today: 3.88, week: 10.1, month: 18.43, marketCap: '488조', circulatingSupply: '120,073,398 ETH', supplyRatio: 100, img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032', marketCapDominance: '18.5%', athPrice: '5,985,000원', athDate: '2021년 11월 10일'},
  { rank: 3, name: '리플', ticker: 'XRP', today: -1.23, week: -5.67, month: 2.11, marketCap: '32조', circulatingSupply: '55,618,185,850 XRP', supplyRatio: 55.6, img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032', marketCapDominance: '1.2%', athPrice: '4,925원', athDate: '2018년 1월 4일'},
  { rank: 4, name: '솔라나', ticker: 'SOL', today: 8.4, week: 15.2, month: 35.1, marketCap: '88조', circulatingSupply: '462,135,937 SOL', supplyRatio: 80.5, img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032', marketCapDominance: '3.3%', athPrice: '335,000원', athDate: '2021년 11월 7일'},
  { rank: 5, name: '도지코인', ticker: 'DOGE', today: -2.5, week: 1.8, month: -8.9, marketCap: '22조', circulatingSupply: '144,855,296,383 DOGE', supplyRatio: 100, img: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=032', marketCapDominance: '0.8%', athPrice: '930원', athDate: '2021년 5월 8일'},
  { rank: 6, name: '스택스', ticker: 'STX', today: 7.2, week: 18.1, month: 40.2, marketCap: '4.5조', circulatingSupply: '1,469,339,187 STX', supplyRatio: 80.7, img: 'https://cryptologos.cc/logos/stacks-stx-logo.svg?v=032', marketCapDominance: '0.17%', athPrice: '5,000원', athDate: '2024년 4월 1일'},
  { rank: 7, name: '이뮤터블엑스', ticker: 'IMX', today: -3.1, week: -1.2, month: 5.5, marketCap: '3.2조', circulatingSupply: '1,507,875,589 IMX', supplyRatio: 75.4, img: 'https://cryptologos.cc/logos/immutable-x-imx-logo.svg?v=032', marketCapDominance: '0.12%', athPrice: '4,500원', athDate: '2021년 11월 10일'},
  { rank: 8, name: '수이', ticker: 'SUI', today: 2.5, week: 8.9, month: 22.3, marketCap: '2.8조', circulatingSupply: '2,339,197,381 SUI', supplyRatio: 23.4, img: 'https://cryptologos.cc/logos/sui-sui-logo.svg?v=032', marketCapDominance: '0.11%', athPrice: '2,800원', athDate: '2024년 3월 27일'},
  { rank: 9, name: '아비트럼', ticker: 'ARB', today: 3.2, week: 8.1, month: 12.5, marketCap: '2.7조', circulatingSupply: '3,231,588,116 ARB', supplyRatio: 32.3, img: 'https://cryptologos.cc/logos/arbitrum-arb-logo.svg?v=032', marketCapDominance: '0.10%', athPrice: '3,200원', athDate: '2024년 1월 12일'},
  { rank: 10, name: '렌더', ticker: 'RNDR', today: 7.8, week: 15.2, month: 22.0, marketCap: '2.5조', circulatingSupply: '388,646,672 RNDR', supplyRatio: 73.0, img: 'https://cryptologos.cc/logos/render-rndr-logo.svg?v=032', marketCapDominance: '0.09%', athPrice: '18,000원', athDate: '2024년 3월 17일'},
  { rank: 11, name: '온도', ticker: 'ONDO', today: -4.5, week: -12.0, month: 25.0, marketCap: '2.4조', circulatingSupply: '1,388,571,428 ONDO', supplyRatio: 13.9, img: 'https://cryptologos.cc/logos/ondo-ondo-logo.svg?v=032', marketCapDominance: '0.09%', athPrice: '2,000원', athDate: '2024년 6월 3일'},
  { rank: 12, name: '페치', ticker: 'FET', today: 9.5, week: 17.2, month: 33.0, marketCap: '2.3조', circulatingSupply: '848,133,333 FET', supplyRatio: 73.1, img: 'https://cryptologos.cc/logos/fetch-ai-fet-logo.svg?v=032', marketCapDominance: '0.09%', athPrice: '4,500원', athDate: '2024년 3월 28일'},
  { rank: 13, name: '월드코인', ticker: 'WLD', today: 12.4, week: 18.2, month: 25.0, marketCap: '2.1조', circulatingSupply: '243,303,831 WLD', supplyRatio: 2.4, img: 'https://cryptologos.cc/logos/worldcoin-org-wld-logo.svg?v=032', marketCapDominance: '0.08%', athPrice: '15,000원', athDate: '2024년 3월 10일'},
  { rank: 14, name: '엑시인피니티', ticker: 'AXS', today: 2.1, week: 4.5, month: 11.0, marketCap: '1.9조', circulatingSupply: '147,156,056 AXS', supplyRatio: 54.5, img: 'https://cryptologos.cc/logos/axie-infinity-axs-logo.svg?v=032', marketCapDominance: '0.07%', athPrice: '198,000원', athDate: '2021년 11월 6일'},
  { rank: 15, name: '메이커', ticker: 'MKR', today: -1.1, week: 1.5, month: -3.0, marketCap: '1.8조', circulatingSupply: '924,466 MKR', supplyRatio: 92.4, img: 'https://cryptologos.cc/logos/maker-mkr-logo.svg?v=032', marketCapDominance: '0.07%', athPrice: '8,000,000원', athDate: '2021년 5월 3일'},
  { rank: 16, name: '셀레스티아', ticker: 'TIA', today: 4.1, week: 9.2, month: 15.8, marketCap: '1.7조', circulatingSupply: '192,988,733 TIA', supplyRatio: 18.5, img: 'https://cryptologos.cc/logos/celestia-tia-logo.svg?v=032', marketCapDominance: '0.07%', athPrice: '27,000원', athDate: '2024년 2월 10일'},
  { rank: 17, name: '알트레이어', ticker: 'ALT', today: 6.5, week: 11.3, month: 19.8, marketCap: '1.6조', circulatingSupply: '1,532,499,996 ALT', supplyRatio: 15.3, img: 'https://cryptologos.cc/logos/altlayer-alt-logo.svg?v=032', marketCapDominance: '0.06%', athPrice: '900원', athDate: '2024년 3월 29일'},
  { rank: 18, name: '만타네트워크', ticker: 'MANTA', today: -0.8, week: 3.2, month: 8.9, marketCap: '1.5조', circulatingSupply: '325,319,791 MANTA', supplyRatio: 32.5, img: 'https://cryptologos.cc/logos/manta-network-manta-logo.svg?v=032', marketCapDominance: '0.06%', athPrice: '5,000원', athDate: '2024년 1월 18일'},
  { rank: 19, name: '스타크넷', ticker: 'STRK', today: 5.2, week: 10.1, month: 14.7, marketCap: '1.4조', circulatingSupply: '1,300,311,845 STRK', supplyRatio: 13.0, img: 'https://cryptologos.cc/logos/starknet-strk-logo.svg?v=032', marketCapDominance: '0.05%', athPrice: '3,500원', athDate: '2024년 2월 20일'},
  { rank: 20, name: '비체인', ticker: 'VET', today: 1.9, week: 5.6, month: 10.2, marketCap: '1.3조', circulatingSupply: '72,714,516,834 VET', supplyRatio: 84.6, img: 'https://cryptologos.cc/logos/vechain-vet-logo.svg?v=032', marketCapDominance: '0.05%', athPrice: '350원', athDate: '2021년 4월 17일'},
  { rank: 21, name: '블러', ticker: 'BLUR', today: -2.2, week: -6.1, month: 1.5, marketCap: '1.2조', circulatingSupply: '1,723,546,401 BLUR', supplyRatio: 57.4, img: 'https://cryptologos.cc/logos/blur-blur-logo.svg?v=032', marketCapDominance: '0.05%', athPrice: '1,800원', athDate: '2023년 2월 14일'},
  { rank: 22, name: '세이', ticker: 'SEI', today: 8.1, week: 12.8, month: 28.4, marketCap: '1.1조', circulatingSupply: '3,050,000,000 SEI', supplyRatio: 30.5, img: 'https://cryptologos.cc/logos/sei-sei-logo.svg?v=032', marketCapDominance: '0.04%', athPrice: '1,500원', athDate: '2024년 3월 16일'},
  { rank: 23, name: '제로엑스', ticker: 'ZRX', today: 3.5, week: 7.2, month: 11.8, marketCap: '1조', circulatingSupply: '847,496,054 ZRX', supplyRatio: 84.7, img: 'https://cryptologos.cc/logos/0x-zrx-logo.svg?v=032', marketCapDominance: '0.04%', athPrice: '3,000원', athDate: '2018년 1월 13일'},
  { rank: 24, name: '신세틱스', ticker: 'SNX', today: -1.5, week: 1.8, month: 6.0, marketCap: '9,500억', circulatingSupply: '327,769,198 SNX', supplyRatio: 100, img: 'https://cryptologos.cc/logos/synthetix-snx-logo.svg?v=032', marketCapDominance: '0.04%', athPrice: '35,000원', athDate: '2021년 2월 14일'},
  { rank: 25, name: '에이브', ticker: 'AAVE', today: 1.2, week: 5.8, month: 15.0, marketCap: '9,000억', circulatingSupply: '14,807,185 AAVE', supplyRatio: 92.5, img: 'https://cryptologos.cc/logos/aave-aave-logo.svg?v=032', marketCapDominance: '0.03%', athPrice: '800,000원', athDate: '2021년 5월 18일'},
  { rank: 26, name: '크로노스', ticker: 'CRO', today: -0.5, week: -2.3, month: 3.1, marketCap: '8,500억', circulatingSupply: '26,571,560,696 CRO', supplyRatio: 88.6, img: 'https://cryptologos.cc/logos/cronos-cro-logo.svg?v=032', marketCapDominance: '0.03%', athPrice: '1,200원', athDate: '2021년 11월 24일'},
  { rank: 27, name: '테조스', ticker: 'XTZ', today: 0.8, week: 4.1, month: 9.5, marketCap: '8,000억', circulatingSupply: '986,527,154 XTZ', supplyRatio: 100, img: 'https://cryptologos.cc/logos/tezos-xtz-logo.svg?v=032', marketCapDominance: '0.03%', athPrice: '11,000원', athDate: '2021년 10월 4일'},
  { rank: 28, name: '더그래프', ticker: 'GRT', today: 6.2, week: 14.1, month: 25.3, marketCap: '7,500억', circulatingSupply: '9,548,460,111 GRT', supplyRatio: 88.8, img: 'https://cryptologos.cc/logos/the-graph-grt-logo.svg?v=032', marketCapDominance: '0.03%', athPrice: '3,500원', athDate: '2021년 2월 12일'},
  { rank: 29, name: '팬텀', ticker: 'FTM', today: -3.3, week: -8.2, month: -15.1, marketCap: '7,000억', circulatingSupply: '2,803,634,835 FTM', supplyRatio: 88.8, img: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=032', marketCapDominance: '0.03%', athPrice: '4,500원', athDate: '2021년 10월 28일'},
  { rank: 30, name: '이오스', ticker: 'EOS', today: -1.8, week: -4.5, month: -9.8, marketCap: '6,500억', circulatingSupply: '1,152,709,077 EOS', supplyRatio: 100, img: 'https://cryptologos.cc/logos/eos-eos-logo.svg?v=032', marketCapDominance: '0.02%', athPrice: '28,000원', athDate: '2018년 4월 29일'},
  { rank: 31, name: '더샌드박스', ticker: 'SAND', today: 1.5, week: 3.2, month: 8.0, marketCap: '1.9조', circulatingSupply: '2,223,000,000 SAND', supplyRatio: 74.1, img: 'https://cryptologos.cc/logos/the-sandbox-sand-logo.svg?v=032', marketCapDominance: '0.07%', athPrice: '8,500원', athDate: '2021년 11월 25일'},
  { rank: 32, name: '디센트럴랜드', ticker: 'MANA', today: 3.5, week: 7.8, month: 15.0, marketCap: '1.8조', circulatingSupply: '1,893,095,370 MANA', supplyRatio: 100, img: 'https://cryptologos.cc/logos/decentraland-mana-logo.svg?v=032', marketCapDominance: '0.07%', athPrice: '5,900원', athDate: '2021년 11월 25일'},
  { rank: 33, name: '갈라', ticker: 'GALA', today: 5.8, week: 12.1, month: 25.0, marketCap: '1.4조', circulatingSupply: '35,000,000,000 GALA', supplyRatio: 100, img: 'https://cryptologos.cc/logos/gala-gala-logo.svg?v=032', marketCapDominance: '0.05%', athPrice: '0.84원', athDate: '2021년 11월 26일'},
  { rank: 34, name: '유니스왑', ticker: 'UNI', today: -0.8, week: 2.1, month: -5.0, marketCap: '1.3조', circulatingSupply: '598,187,016 UNI', supplyRatio: 59.8, img: 'https://cryptologos.cc/logos/uniswap-uni-logo.svg?v=032', marketCapDominance: '0.05%', athPrice: '44,500원', athDate: '2021년 5월 3일'},
  { rank: 35, name: '컴파운드', ticker: 'COMP', today: 0.5, week: 3.9, month: 9.0, marketCap: '1.1조', circulatingSupply: '8,087,137 COMP', supplyRatio: 80.9, img: 'https://cryptologos.cc/logos/compound-comp-logo.svg?v=032', marketCapDominance: '0.04%', athPrice: '1,800,000원', athDate: '2021년 5월 12일'},
  { rank: 36, name: '옵티미즘', ticker: 'OP', today: 2.5, week: 6.8, month: 10.2, marketCap: '1.0조', circulatingSupply: '1,194,588,517 OP', supplyRatio: 28.5, img: 'https://cryptologos.cc/logos/optimism-op-logo.svg?v=032', marketCapDominance: '0.04%', athPrice: '3,200원', athDate: '2024년 3월 6일'},
  { rank: 37, name: '매틱', ticker: 'MATIC', today: 4.5, week: 9.8, month: 18.0, marketCap: '9,500억', circulatingSupply: '10,000,000,000 MATIC', supplyRatio: 100, img: 'https://cryptologos.cc/logos/polygon-matic-logo.svg?v=032', marketCapDominance: '0.04%', athPrice: '2,900원', athDate: '2021년 12월 27일'},
  { rank: 38, name: '커브', ticker: 'CRV', today: 6.2, week: 13.5, month: 28.0, marketCap: '8,500억', circulatingSupply: '1,000,000,000 CRV', supplyRatio: 100, img: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.svg?v=032', marketCapDominance: '0.03%', athPrice: '6,200원', athDate: '2020년 8월 14일'},
  { rank: 39, name: '루프링', ticker: 'LRC', today: 2.1, week: 5.2, month: 10.0, marketCap: '7,000억', circulatingSupply: '1,374,569,494 LRC', supplyRatio: 100, img: 'https://cryptologos.cc/logos/loopring-lrc-logo.svg?v=032', marketCapDominance: '0.03%', athPrice: '3,800원', athDate: '2021년 11월 10일'},
  { rank: 40, name: '파이스네트워크', ticker: 'PYTH', today: 3.8, week: 9.2, month: 18.0, marketCap: '6,500억', circulatingSupply: '2,100,000,000 PYTH', supplyRatio: 21.0, img: 'https://cryptologos.cc/logos/pyth-network-pyth-logo.svg?v=032', marketCapDominance: '0.02%', athPrice: '1,200원', athDate: '2024년 11월 20일'},
  { rank: 41, name: '싱귤래리티넷', ticker: 'AGIX', today: 10.2, week: 18.5, month: 35.0, marketCap: '6,000억', circulatingSupply: '1,300,000,000 AGIX', supplyRatio: 100, img: 'https://cryptologos.cc/logos/singularitynet-agix-logo.svg?v=032', marketCapDominance: '0.02%', athPrice: '1,200원', athDate: '2021년 4월 28일'},
  { rank: 42, name: '오션프로토콜', ticker: 'OCEAN', today: 8.1, week: 15.0, month: 28.0, marketCap: '5,500억', circulatingSupply: '613,099,141 OCEAN', supplyRatio: 100, img: 'https://cryptologos.cc/logos/ocean-protocol-ocean-logo.svg?v=032', marketCapDominance: '0.02%', athPrice: '1,900원', athDate: '2021년 4월 10일'},
  { rank: 43, name: '폴카스타터', ticker: 'POLS', today: 1.8, week: 4.2, month: 8.0, marketCap: '5,000억', circulatingSupply: '100,000,000 POLS', supplyRatio: 100, img: 'https://cryptologos.cc/logos/polkastarter-pols-logo.svg?v=032', marketCapDominance: '0.02%', athPrice: '7,200원', athDate: '2021년 3월 27일'},
  { rank: 44, name: '센트리퓨즈', ticker: 'CFG', today: -2.5, week: -5.1, month: 12.0, marketCap: '4,500억', circulatingSupply: '400,000,000 CFG', supplyRatio: 100, img: 'https://cryptologos.cc/logos/centrifuge-cfg-logo.svg?v=032', marketCapDominance: '0.02%', athPrice: '1,200원', athDate: '2021년 9월 13일'},
];

const deepDiveData = {
  BTC: { internalCirculation: '21,345 BTC', internalCirculationValue: '2조 1,345억원', circulationChange: 0.15, netDeposit24h: '120억원', holderCount: 1234567, tradingVolume: '1.2조원', whaleHoldingRatio: 18, whaleTradingRatio: 35, buyOrderPressure: 62, sellOrderPressure: 38, tradingVolumeRank: 1, holderChange: '+1,234명', netDepositRank: 3, holderRank: 2, quarterlyReview: [{ year: 2026, q1: -10.75, q2: -67.34, q3: 23.47, q4: null }, { year: 2025, q1: 160.7, q2: 18.53, q3: 31.86, q4: 22.59 }, { year: 2024, q1: 3.02, q2: 69.62, q3: 59.5, q4: 104.15 }, { year: 2023, q1: 5.72, q2: 102.25, q3: -37.43, q4: -28.9 }, { year: 2022, q1: -46.61, q2: 15.29, q3: -48.69, q4: -41.62 }, { year: 2021, q1: 518.14, q2: 453.71, q3: 9.87, q4: 142.81 }, { year: 2020, q1: 10.58, q2: 8.95, q3: 6.51, q4: -39.47 },] },
  ETH: { internalCirculation: '250,123 ETH', internalCirculationValue: '1조 2,506억원', circulationChange: -0.05, netDeposit24h: '-80억원', holderCount: 987654, tradingVolume: '8,500억원', whaleHoldingRatio: 12, whaleTradingRatio: 28, buyOrderPressure: 55, sellOrderPressure: 45, tradingVolumeRank: 2, holderChange: '+876명', netDepositRank: 12, holderRank: 3, quarterlyReview: [{ year: 2026, q1: -12.5, q2: -70.1, q3: 30.2, q4: -5.1 }, { year: 2025, q1: 159.3, q2: 72.8, q3: 35.7, q4: 20.3 }, { year: 2024, q1: -11.9, q2: 78.4, q3: 56.4, q4: 108.2 }, { year: 2023, q1: 4.8, q2: 110.1, q3: -39.2, q4: -20.1 },] },
  SOL: { internalCirculation: '5,123,456 SOL', internalCirculationValue: '1조 1,783억원', circulationChange: 0.8, netDeposit24h: '550억원', holderCount: 456789, tradingVolume: '6,200억원', whaleHoldingRatio: 25, whaleTradingRatio: 42, buyOrderPressure: 48, sellOrderPressure: 52, tradingVolumeRank: 4, holderChange: '+2,345명', netDepositRank: 1, holderRank: 5, quarterlyReview: [{ year: 2026, q1: -30.2, q2: -80.5, q3: 10.5, q4: -60.2 }, { year: 2025, q1: 1800, q2: 10.2, q3: 400.1, q4: 30.5 },] },
  XRP: { internalCirculation: '1,234,567,890 XRP', internalCirculationValue: '8,642억원', circulationChange: -0.2, netDeposit24h: '-150억원', holderCount: 1567890, tradingVolume: '3,100억원', whaleHoldingRatio: 32, whaleTradingRatio: 55, buyOrderPressure: 70, sellOrderPressure: 30, tradingVolumeRank: 5, holderChange: '-567명', netDepositRank: 15, holderRank: 1, quarterlyReview: [{ year: 2026, q1: -5.2, q2: -55.8, q3: 45.1, q4: -2.3 }, { year: 2025, q1: 200.1, q2: 25.3, q3: -10.8, q4: 25.1 }, { year: 2024, q1: -15.4, q2: -5.2, q3: 40.1, q4: 150.9 },] },
  DOGE: { internalCirculation: '25,123,456,789 DOGE', internalCirculationValue: '5,275억원', circulationChange: 0.3, netDeposit24h: '30억원', holderCount: 876543, tradingVolume: '1,500억원', whaleHoldingRatio: 40, whaleTradingRatio: 60, buyOrderPressure: 65, sellOrderPressure: 35, tradingVolumeRank: 8, holderChange: '+1,012명', netDepositRank: 7, holderRank: 4, quarterlyReview: [{ year: 2025, q1: 500.1, q2: 450.2, q3: -20.3, q4: 10.2 }, { year: 2024, q1: 1.2, q2: 5.3, q3: 2.1, q4: 10.8 },] },
  STX: { internalCirculation: '123,456,789 STX', internalCirculationValue: '3,086억원', circulationChange: 1.2, netDeposit24h: '200억원', holderCount: 150000, tradingVolume: '800억원', whaleHoldingRatio: 22, whaleTradingRatio: 30, buyOrderPressure: 60, sellOrderPressure: 40, tradingVolumeRank: 15, holderChange: '+500명', netDepositRank: 5, holderRank: 10, quarterlyReview: [] },
  IMX: { internalCirculation: '456,789,012 IMX', internalCirculationValue: '1,004억원', circulationChange: -0.5, netDeposit24h: '-50억원', holderCount: 80000, tradingVolume: '400억원', whaleHoldingRatio: 28, whaleTradingRatio: 38, buyOrderPressure: 45, sellOrderPressure: 55, tradingVolumeRank: 20, holderChange: '-100명', netDepositRank: 25, holderRank: 15, quarterlyReview: [] },
  SUI: { internalCirculation: '789,012,345 SUI', internalCirculationValue: '946억원', circulationChange: 0.9, netDeposit24h: '150억원', holderCount: 120000, tradingVolume: '600억원', whaleHoldingRatio: 15, whaleTradingRatio: 25, buyOrderPressure: 55, sellOrderPressure: 45, tradingVolumeRank: 18, holderChange: '+800명', netDepositRank: 8, holderRank: 12, quarterlyReview: [] },
  ARB: { internalCirculation: '1,012,345,678 ARB', internalCirculationValue: '1,214억원', circulationChange: 0.1, netDeposit24h: '80억원', holderCount: 200000, tradingVolume: '1,000억원', whaleHoldingRatio: 10, whaleTradingRatio: 20, buyOrderPressure: 58, sellOrderPressure: 42, tradingVolumeRank: 11, holderChange: '+1200명', netDepositRank: 10, holderRank: 8, quarterlyReview: [] },
  RNDR: { internalCirculation: '23,456,789 RNDR', internalCirculationValue: '340억원', circulationChange: 2.5, netDeposit24h: '30억원', holderCount: 60000, tradingVolume: '500억원', whaleHoldingRatio: 35, whaleTradingRatio: 45, buyOrderPressure: 65, sellOrderPressure: 35, tradingVolumeRank: 19, holderChange: '+300명', netDepositRank: 14, holderRank: 18, quarterlyReview: [] },
  ONDO: { internalCirculation: '56,789,012 ONDO', internalCirculationValue: '937억원', circulationChange: -1.8, netDeposit24h: '-100억원', holderCount: 90000, tradingVolume: '700억원', whaleHoldingRatio: 40, whaleTradingRatio: 50, buyOrderPressure: 40, sellOrderPressure: 60, tradingVolumeRank: 16, holderChange: '-200명', netDepositRank: 28, holderRank: 14, quarterlyReview: [] },
  FET: { internalCirculation: '89,012,345 FET', internalCirculationValue: '213억원', circulationChange: 3.1, netDeposit24h: '50억원', holderCount: 70000, tradingVolume: '300억원', whaleHoldingRatio: 18, whaleTradingRatio: 28, buyOrderPressure: 62, sellOrderPressure: 38, tradingVolumeRank: 22, holderChange: '+400명', netDepositRank: 12, holderRank: 16, quarterlyReview: [] },
  WLD: { internalCirculation: '12,345,678 WLD', internalCirculationValue: '765억원', circulationChange: 4.2, netDeposit24h: '80억원', holderCount: 250000, tradingVolume: '1,200억원', whaleHoldingRatio: 8, whaleTradingRatio: 18, buyOrderPressure: 70, sellOrderPressure: 30, tradingVolumeRank: 9, holderChange: '+1500명', netDepositRank: 9, holderRank: 6, quarterlyReview: [] },
  AXS: { internalCirculation: '45,678,901 AXS', internalCirculationValue: '4,476억원', circulationChange: -0.9, netDeposit24h: '-30억원', holderCount: 300000, tradingVolume: '500억원', whaleHoldingRatio: 25, whaleTradingRatio: 35, buyOrderPressure: 50, sellOrderPressure: 50, tradingVolumeRank: 18, holderChange: '-500명', netDepositRank: 22, holderRank: 5, quarterlyReview: [] },
  MKR: { internalCirculation: '78,901 MKR', internalCirculationValue: '3,156억원', circulationChange: -2.1, netDeposit24h: '-80억원', holderCount: 50000, tradingVolume: '200억원', whaleHoldingRatio: 45, whaleTradingRatio: 55, buyOrderPressure: 42, sellOrderPressure: 58, tradingVolumeRank: 25, holderChange: '-300명', netDepositRank: 27, holderRank: 20, quarterlyReview: [] },
  TIA: { internalCirculation: '123,456,789 TIA', internalCirculationValue: '1,543억원', circulationChange: 1.5, netDeposit24h: '100억원', holderCount: 100000, tradingVolume: '800억원', whaleHoldingRatio: 12, whaleTradingRatio: 22, buyOrderPressure: 57, sellOrderPressure: 43, tradingVolumeRank: 14, holderChange: '+600명', netDepositRank: 11, holderRank: 13, quarterlyReview: [] },
  ALT: { internalCirculation: '456,789,012 ALT', internalCirculationValue: '2,055억원', circulationChange: 2.8, netDeposit24h: '120억원', holderCount: 80000, tradingVolume: '700억원', whaleHoldingRatio: 10, whaleTradingRatio: 18, buyOrderPressure: 60, sellOrderPressure: 40, tradingVolumeRank: 15, holderChange: '+400명', netDepositRank: 9, holderRank: 15, quarterlyReview: [] },
  MANTA: { internalCirculation: '789,012,345 MANTA', internalCirculationValue: '1,104억원', circulationChange: -1.2, netDeposit24h: '-40억원', holderCount: 60000, tradingVolume: '300억원', whaleHoldingRatio: 14, whaleTradingRatio: 24, buyOrderPressure: 48, sellOrderPressure: 52, tradingVolumeRank: 23, holderChange: '-150명', netDepositRank: 24, holderRank: 17, quarterlyReview: [] },
  STRK: { internalCirculation: '123,456,789 STRK', internalCirculationValue: '1,604억원', circulationChange: 3.9, netDeposit24h: '180억원', holderCount: 110000, tradingVolume: '900억원', whaleHoldingRatio: 11, whaleTradingRatio: 21, buyOrderPressure: 59, sellOrderPressure: 41, tradingVolumeRank: 12, holderChange: '+700명', netDepositRank: 7, holderRank: 11, quarterlyReview: [] },
  VET: { internalCirculation: '4,567,890,123 VET', internalCirculationValue: '2,055억원', circulationChange: 0.5, netDeposit24h: '50억원', holderCount: 400000, tradingVolume: '400억원', whaleHoldingRatio: 20, whaleTradingRatio: 30, buyOrderPressure: 54, sellOrderPressure: 46, tradingVolumeRank: 21, holderChange: '+2000명', netDepositRank: 13, holderRank: 3, quarterlyReview: [] },
  BLUR: { internalCirculation: '789,012,345 BLUR', internalCirculationValue: '2,761억원', circulationChange: -2.8, netDeposit24h: '-70억원', holderCount: 90000, tradingVolume: '600억원', whaleHoldingRatio: 30, whaleTradingRatio: 40, buyOrderPressure: 46, sellOrderPressure: 54, tradingVolumeRank: 17, holderChange: '-400명', netDepositRank: 26, holderRank: 14, quarterlyReview: [] },
  SEI: { internalCirculation: '123,456,789 SEI', internalCirculationValue: '617억원', circulationChange: 5.1, netDeposit24h: '60억원', holderCount: 130000, tradingVolume: '700억원', whaleHoldingRatio: 16, whaleTradingRatio: 26, buyOrderPressure: 63, sellOrderPressure: 37, tradingVolumeRank: 16, holderChange: '+900명', netDepositRank: 11, holderRank: 11, quarterlyReview: [] },
  ZRX: { internalCirculation: '847,496,054 ZRX', internalCirculationValue: '5,084억원', circulationChange: -0.5, netDeposit24h: '10억원', holderCount: 85000, tradingVolume: '150억원', whaleHoldingRatio: 24, whaleTradingRatio: 34, buyOrderPressure: 52, sellOrderPressure: 48, tradingVolumeRank: 28, holderChange: '+50명', netDepositRank: 18, holderRank: 15, quarterlyReview: [] },
  SNX: { internalCirculation: '327,769,198 SNX', internalCirculationValue: '9,833억원', circulationChange: 1.8, netDeposit24h: '40억원', holderCount: 75000, tradingVolume: '250억원', whaleHoldingRatio: 33, whaleTradingRatio: 43, buyOrderPressure: 56, sellOrderPressure: 44, tradingVolumeRank: 24, holderChange: '+300명', netDepositRank: 15, holderRank: 16, quarterlyReview: [] },
  AAVE: { internalCirculation: '14,807,185 AAVE', internalCirculationValue: '1조 7,768억원', circulationChange: 0.9, netDeposit24h: '80억원', holderCount: 65000, tradingVolume: '450억원', whaleHoldingRatio: 38, whaleTradingRatio: 48, buyOrderPressure: 53, sellOrderPressure: 47, tradingVolumeRank: 20, holderChange: '+200명', netDepositRank: 10, holderRank: 17, quarterlyReview: [] },
  CRO: { internalCirculation: '26,571,560,696 CRO', internalCirculationValue: '3,188억원', circulationChange: -1.1, netDeposit24h: '-20억원', holderCount: 350000, tradingVolume: '200억원', whaleHoldingRatio: 19, whaleTradingRatio: 29, buyOrderPressure: 49, sellOrderPressure: 51, tradingVolumeRank: 26, holderChange: '-800명', netDepositRank: 21, holderRank: 4, quarterlyReview: [] },
  XTZ: { internalCirculation: '986,527,154 XTZ', internalCirculationValue: '1,183억원', circulationChange: 0.2, netDeposit24h: '5억원', holderCount: 180000, tradingVolume: '100억원', whaleHoldingRatio: 13, whaleTradingRatio: 23, buyOrderPressure: 51, sellOrderPressure: 49, tradingVolumeRank: 30, holderChange: '+100명', netDepositRank: 19, holderRank: 9, quarterlyReview: [] },
  GRT: { internalCirculation: '9,548,460,111 GRT', internalCirculationValue: '2,959억원', circulationChange: 4.3, netDeposit24h: '90억원', holderCount: 220000, tradingVolume: '600억원', whaleHoldingRatio: 9, whaleTradingRatio: 19, buyOrderPressure: 61, sellOrderPressure: 39, tradingVolumeRank: 17, holderChange: '+1100명', netDepositRank: 9, holderRank: 7, quarterlyReview: [] },
  FTM: { internalCirculation: '2,803,634,835 FTM', internalCirculationValue: '1,962억원', circulationChange: -2.5, netDeposit24h: '-60억원', holderCount: 160000, tradingVolume: '350억원', whaleHoldingRatio: 26, whaleTradingRatio: 36, buyOrderPressure: 47, sellOrderPressure: 53, tradingVolumeRank: 22, holderChange: '-600명', netDepositRank: 25, holderRank: 9, quarterlyReview: [] },
  EOS: { internalCirculation: '1,152,709,077 EOS', internalCirculationValue: '1,037억원', circulationChange: -1.9, netDeposit24h: '-30억원', holderCount: 500000, tradingVolume: '150억원', whaleHoldingRatio: 36, whaleTradingRatio: 46, buyOrderPressure: 44, sellOrderPressure: 56, tradingVolumeRank: 29, holderChange: '-1000명', netDepositRank: 23, holderRank: 2, quarterlyReview: [] },
  SAND: { internalCirculation: '5,678,901 SAND', internalCirculationValue: '35억원', circulationChange: 0.1, netDeposit24h: '1억원', holderCount: 234567, tradingVolume: '80억원', whaleHoldingRatio: 18, whaleTradingRatio: 35, buyOrderPressure: 50, sellOrderPressure: 50, tradingVolumeRank: 25, holderChange: '+234명', netDepositRank: 22, holderRank: 5, quarterlyReview: [] },
  MANA: { internalCirculation: '1,800,000,000 MANA', internalCirculationValue: '8100억원', circulationChange: 1.2, netDeposit24h: '50억원', holderCount: 300000, tradingVolume: '100억원', whaleHoldingRatio: 20, whaleTradingRatio: 30, buyOrderPressure: 54, sellOrderPressure: 46, tradingVolumeRank: 20, holderChange: '+1500명', netDepositRank: 12, holderRank: 3, quarterlyReview: [] },
  GALA: { internalCirculation: '35,000,000,000 GALA', internalCirculationValue: '1조 4000억원', circulationChange: 2.5, netDeposit24h: '100억원', holderCount: 400000, tradingVolume: '200억원', whaleHoldingRatio: 25, whaleTradingRatio: 35, buyOrderPressure: 60, sellOrderPressure: 40, tradingVolumeRank: 13, holderChange: '+2000명', netDepositRank: 9, holderRank: 4, quarterlyReview: [] },
  UNI: { internalCirculation: '1,234,567 UNI', internalCirculationValue: '166억원', circulationChange: -0.8, netDeposit24h: '-10억원', holderCount: 154321, tradingVolume: '250억원', whaleHoldingRatio: 14, whaleTradingRatio: 26, buyOrderPressure: 48, sellOrderPressure: 52, tradingVolumeRank: 11, holderChange: '-100명', netDepositRank: 17, holderRank: 8, quarterlyReview: [] },
  COMP: { internalCirculation: '345,678 COMP', internalCirculationValue: '283억원', circulationChange: 0.4, netDeposit24h: '5억원', holderCount: 43210, tradingVolume: '90억원', whaleHoldingRatio: 25, whaleTradingRatio: 38, buyOrderPressure: 54, sellOrderPressure: 46, tradingVolumeRank: 24, holderChange: '+123명', netDepositRank: 16, holderRank: 15, quarterlyReview: [] },
  OP: { internalCirculation: '2,345,678 OP', internalCirculationValue: '75억원', circulationChange: 0.2, netDeposit24h: '8억원', holderCount: 98765, tradingVolume: '180억원', whaleHoldingRatio: 11, whaleTradingRatio: 22, buyOrderPressure: 55, sellOrderPressure: 45, tradingVolumeRank: 13, holderChange: '+987명', netDepositRank: 9, holderRank: 9, quarterlyReview: [] },
  MATIC: { internalCirculation: '10,000,000 MATIC', internalCirculationValue: '90억원', circulationChange: 0.5, netDeposit24h: '10억원', holderCount: 200000, tradingVolume: '150억원', whaleHoldingRatio: 15, whaleTradingRatio: 25, buyOrderPressure: 58, sellOrderPressure: 42, tradingVolumeRank: 15, holderChange: '+1000명', netDepositRank: 14, holderRank: 6, quarterlyReview: [] },
  CRV: { internalCirculation: '1,000,000,000 CRV', internalCirculationValue: '4500억원', circulationChange: 3.1, netDeposit24h: '80억원', holderCount: 150000, tradingVolume: '120억원', whaleHoldingRatio: 30, whaleTradingRatio: 40, buyOrderPressure: 62, sellOrderPressure: 38, tradingVolumeRank: 18, holderChange: '+800명', netDepositRank: 11, holderRank: 7, quarterlyReview: [] },
  LRC: { internalCirculation: '5,000,000 LRC', internalCirculationValue: '17.5억원', circulationChange: -0.2, netDeposit24h: '-0.5억원', holderCount: 60000, tradingVolume: '30억원', whaleHoldingRatio: 5, whaleTradingRatio: 10, buyOrderPressure: 50, sellOrderPressure: 50, tradingVolumeRank: 40, holderChange: '-100명', netDepositRank: 30, holderRank: 18, quarterlyReview: [] },
  PYTH: { internalCirculation: '5,678,901 PYTH', internalCirculationValue: '25.5억원', circulationChange: -1.2, netDeposit24h: '-2억원', holderCount: 56789, tradingVolume: '110억원', whaleHoldingRatio: 12, whaleTradingRatio: 25, buyOrderPressure: 40, sellOrderPressure: 60, tradingVolumeRank: 18, holderChange: '-345명', netDepositRank: 21, holderRank: 10, quarterlyReview: [] },
  AGIX: { internalCirculation: '1,000,000 AGIX', internalCirculationValue: '12억원', circulationChange: 2.1, netDeposit24h: '2억원', holderCount: 30000, tradingVolume: '50억원', whaleHoldingRatio: 10, whaleTradingRatio: 15, buyOrderPressure: 65, sellOrderPressure: 35, tradingVolumeRank: 28, holderChange: '+300명', netDepositRank: 20, holderRank: 19, quarterlyReview: [] },
  OCEAN: { internalCirculation: '3,000,000 OCEAN', internalCirculationValue: '21억원', circulationChange: 0.8, netDeposit24h: '1억원', holderCount: 25000, tradingVolume: '40억원', whaleHoldingRatio: 8, whaleTradingRatio: 12, buyOrderPressure: 55, sellOrderPressure: 45, tradingVolumeRank: 35, holderChange: '+200명', netDepositRank: 28, holderRank: 20, quarterlyReview: [] },
  POLS: { internalCirculation: '90,000,000 POLS', internalCirculationValue: '450억원', circulationChange: 0.1, netDeposit24h: '1억원', holderCount: 20000, tradingVolume: '10억원', whaleHoldingRatio: 5, whaleTradingRatio: 8, buyOrderPressure: 51, sellOrderPressure: 49, tradingVolumeRank: 50, holderChange: '+50명', netDepositRank: 40, holderRank: 21, quarterlyReview: [] },
  CFG: { internalCirculation: '400,000,000 CFG', internalCirculationValue: '3200억원', circulationChange: -1.8, netDeposit24h: '-10억원', holderCount: 35000, tradingVolume: '50억원', whaleHoldingRatio: 10, whaleTradingRatio: 18, buyOrderPressure: 48, sellOrderPressure: 52, tradingVolumeRank: 33, holderChange: '-200명', netDepositRank: 28, holderRank: 22, quarterlyReview: [] },
};


type Asset = (typeof assetsData)[0] & { deepDive: (typeof deepDiveData)['BTC'] };
type SortKey = keyof Asset | 'holderCount' | 'influenceScore' | 'tradingVolume' | 'marketCap' | 'netDeposit24h';

type Filter = {
  id: string;
  type: 'market' | 'category' | 'mcap' | 'change' | 'trend' | 'rsi' | 'volume' | 'feargreed' | 'ma' | 'buysurge' | 'deposit' | 'whaletrade' | 'profit' | 'beta' | 'volatility';
  label: string;
  value: string;
  rawValue?: string | string[] | number[] | Record<string, any>;
};

type FilterOption = {
  id: string;
  name: string;
  description?: string;
  type: 'radio' | 'checkbox' | 'range' | 'custom';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
};

const filterOptions: Record<string, FilterOption> = {
  market: {
    id: 'market',
    name: '시장',
    description: '거래 시장 유형을 선택하세요',
    type: 'radio',
    options: [
      { value: 'krw', label: '원화 (KRW)' },
      { value: 'btc', label: '비트코인 (BTC) 마켓' },
    ],
  },
  category: {
    id: 'category',
    name: '카테고리',
    description: '가상자산 카테고리를 선택하세요',
    type: 'checkbox',
    options: [
      { value: 'ai', label: '인공지능(AI)' },
      { value: 'l2', label: '레이어2' },
      { value: 'game', label: '게임' },
      { value: 'defi', label: '디파이' },
      { value: 'rwa', label: '실물자산(RWA)' },
    ],
  },
  mcap: {
    id: 'mcap',
    name: '시가총액',
    description: '원하는 시가총액 범위를 선택하세요',
    type: 'range',
    min: 0,
    max: 100000000000000,
    step: 1000000000,
    unit: '원',
  },
  change: {
    id: 'change',
    name: '주가등락률',
    description: '기준 날짜와 등락률을 설정하세요',
    type: 'custom',
  },
  trend: {
    id: 'trend',
    name: '주가 연속상승',
    description: '기준 날짜와 연속 상승 일수를 설정하세요',
    type: 'custom',
  },
  rsi: {
    id: 'rsi',
    name: '과매수/과매도',
    description: 'RSI는 코인의 과매수 또는 과매도 상태를 나타내는 지표예요. RSI가 70 이상이면 과매수로 매도 타이밍을 고려해볼 수 있고, 30 이하면 과매도로 매수 기회로 볼 수 있어요.',
    type: 'custom',
  },
  ma: {
    id: 'ma',
    name: '골든크로스/데드크로스',
    description: '단기 이동평균선이 장기 이동평균선을 상향 돌파하면 골든크로스, 하향 돌파하면 데드크로스예요. 골든크로스는 상승 추세 전환, 데드크로스는 하락 추세 전환 신호로 해석돼요.',
    type: 'custom',
  },
  volume: {
    id: 'volume',
    name: '상대 거래량',
    description: '한달 일평균 거래량 대비 현재 거래량의 비율을 나타내요. RVOL이 높을수록 시장 관심이 높아 급격한 가격 변동이 예상되고, 낮을수록 거래가 침체된 상태예요.',
    type: 'custom',
  },
  buysurge: {
    id: 'buysurge',
    name: '매수세 급증',
    description: '1시간 매수량이 24시간 평균보다 많고, 체결강도(매수총액/매도총액)가 높은 코인을 찾아요.',
    type: 'custom',
  },
  deposit: {
    id: 'deposit',
    name: '거래소입금',
    description: '최근 1시간 동안의 순입금액이 직전 24시간 평균 대비 급증한 코인을 찾아요.',
    type: 'custom',
  },
  whaletrade: {
    id: 'whaletrade',
    name: '큰손동향',
    description: '자산 규모 및 3개월 평균 거래량 상위 100인의 주간 순매수/순매도 동향을 추적합니다. 시장을 주도하는 스마트 머니의 흐름을 확인하세요.',
    type: 'custom',
  },
  profit: {
    id: 'profit',
    name: '미실현수익',
    description: '현재 가격 기준으로 빗썸 유저들이 보유한 총 수익금 규모입니다. 수익 비중이 높을수록 가격 변동 시 차익 실현 매물이 나올 가능성이 높음을 의미합니다.',
    type: 'custom',
  },
  beta: {
    id: 'beta',
    name: '베타',
    description: '비트코인 대비 움직임을 나타내는 지표예요. 베타가 1.0보다 크면 비트코인보다 더 공격적으로 움직이고, 1.0보다 작으면 더 방어적으로 움직여요.',
    type: 'custom',
  },
  volatility: {
    id: 'volatility',
    name: '일간 변동폭',
    description: '당일 최저가와 최고가의 차이를 백분율로 나타냅니다. 수치가 높을수록 단기 매매 기회가 많지만 리스크도 함께 커집니다.',
    type: 'custom',
  },
};

const filterGroups = [
  {
    id: 'main',
    name: '주요정보',
    items: [
      { id: 'market', name: '마켓' },
      { id: 'category', name: '섹터' },
      { id: 'mcap', name: '시가총액' },
    ],
  },
  {
    id: 'exchange',
    name: '거래소 동향',
    items: [
      { id: 'deposit', name: '거래소입금' },
      { id: 'whaletrade', name: '큰손동향' },
    ],
  },
  {
    id: 'price',
    name: '시세정보',
    items: [
      { id: 'change', name: '가격등락률' },
      { id: 'volatility', name: '일간 변동폭' },
    ],
  },
  {
    id: 'technical',
    name: '기술적분석',
    items: [
      { id: 'rsi', name: '과매수/과매도' },
      { id: 'ma', name: '골든크로스/데드크로스' },
      { id: 'volume', name: '상대 거래량' },
      { id: 'beta', name: '베타' },
      { id: 'buysurge', name: '매수세 급증' },
    ],
  },
];

const defaultAssets: Asset[] = assetsData.map(asset => ({
  ...asset,
  deepDive: deepDiveData[asset.ticker as keyof typeof deepDiveData] || deepDiveData.BTC
}));

function formatPercentage(value: number) {
  if (value === null || value === undefined) return '-';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

const getInfluenceLevel = (holding: number, trading: number) => {
    const score = holding * 0.4 + trading * 0.6;
    if (score > 50) return { text: "매우 높음", color: "bg-red-500", score };
    if (score > 35) return { text: "높음", color: "bg-orange-500", score };
    if (score > 20) return { text: "보통", color: "bg-yellow-500", score };
    return { text: "낮음", color: "bg-gray-400", score };
}

interface AssetComparisonTableProps {
  initialAssets?: Asset[] | any[];
  hideDeepDive?: boolean;
  initialFilter?: {
    filter?: string | null;
    direction?: string | null;
    sentiment?: string | null;
    range?: string | null;
    crossover?: string | null;
    category?: string | null;
    multiplier?: string | null;
    executionStrength?: string | null;
    tradeType?: string | null;
    amount?: string | null;
    betaDirection?: string | null;
    betaMultiplier?: string | null;
    volatilityThreshold?: string | null;
  };
}

export function AssetComparisonTable({ initialAssets = defaultAssets, hideDeepDive = false, initialFilter }: AssetComparisonTableProps) {
  // Convert allAssets format to assetsData format if needed
  const convertedAssets = useMemo(() => {
    return initialAssets.map((asset: any) => {
      // If asset already has assetsData structure (rank, today, week, month, etc.), return as is
      if ('rank' in asset && 'today' in asset && 'week' in asset && 'month' in asset) {
        return asset as Asset;
      }
      
      // Otherwise, try to find matching asset in assetsData by ticker
      const ticker = asset.ticker || asset.id;
      const matchingAsset = assetsData.find(a => a.ticker === ticker);
      
      if (matchingAsset) {
        return {
          ...matchingAsset,
          ...asset,
          deepDive: asset.deepDive || deepDiveData[ticker as keyof typeof deepDiveData] || deepDiveData.BTC
        } as Asset;
      }
      
      // If no match found, create a basic structure with default values
      return {
        rank: 0,
        name: asset.name || '',
        ticker: ticker || '',
        today: asset.change?.['1D'] || 0,
        week: asset.change?.['1W'] || 0,
        month: asset.change?.['1M'] || 0,
        marketCap: '-',
        circulatingSupply: '-',
        supplyRatio: 0,
        img: asset.img || '',
        marketCapDominance: '-',
        athPrice: '-',
        athDate: '-',
        ...asset,
        deepDive: asset.deepDive || deepDiveData[ticker as keyof typeof deepDiveData] || deepDiveData.BTC
      } as Asset;
    });
  }, [initialAssets]);

  // Filter state
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedFilterMenu, setSelectedFilterMenu] = useState<string>('mcap');
  const [tempFilterValues, setTempFilterValues] = useState<Record<string, string | string[] | number[] | number[][]>>({});
  const [mcapFilterMode, setMcapFilterMode] = useState<'range' | 'rank'>('range');
  
  // Custom filter states
  const [changeFilterPeriod, setChangeFilterPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [changeFilterMin, setChangeFilterMin] = useState<string>('');
  const [changeFilterMax, setChangeFilterMax] = useState<string>('');
  
  const [trendFilterDate, setTrendFilterDate] = useState<Date | undefined>(new Date());
  const [trendFilterDays, setTrendFilterDays] = useState<number>(3);
  
  const [maFilterTimeframe, setMaFilterTimeframe] = useState<'15m' | '1h' | '4h' | '1d'>('1d');
  const [rsiSelected, setRsiSelected] = useState<'oversold' | 'overbought' | null>(null);
  const [maSelected, setMaSelected] = useState<'golden' | 'dead' | null>(null);
  
  const [volumeFilterDate, setVolumeFilterDate] = useState<Date | undefined>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });
  const [volumeFilterRvol, setVolumeFilterRvol] = useState<number>(1.5);
  const [volumeFilterDirection, setVolumeFilterDirection] = useState<'above' | 'below'>('above');
  
  const [buySurgeMultiplier, setBuySurgeMultiplier] = useState<number>(2.0);
  const [buySurgeExecutionStrength, setBuySurgeExecutionStrength] = useState<number>(100);
  
  const [depositMultiplier, setDepositMultiplier] = useState<number>(1.5);
  
  const [whaleTradeType, setWhaleTradeType] = useState<'whale_buy' | 'whale_sell' | 'trader_buy' | 'trader_sell' | null>(null);
  
  const [profitAmount, setProfitAmount] = useState<number | null>(null);
  const [profitRatio, setProfitRatio] = useState<number | null>(null);
  
  const [betaDirection, setBetaDirection] = useState<'same' | 'opposite'>('same');
  const [betaMultiplier, setBetaMultiplier] = useState<number>(1.0);
  
  const [volatilityThreshold, setVolatilityThreshold] = useState<number>(10.0);

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({ key: 'rank', direction: 'ascending' });
  
  // 검색 기능 state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedAsset, setSearchedAsset] = useState<Asset | null>(null);

  // URL 파라미터로부터 필터 자동 적용
  useEffect(() => {
    if (!initialFilter?.filter) return;

    const filterType = initialFilter.filter;
    
    if (filterType === 'rsi') {
      // RSI 필터
      const range = initialFilter.range;
      let rsiFilter: Filter;
      
      if (range === 'overbought') {
        rsiFilter = {
          id: 'rsi-auto',
          type: 'rsi',
          label: 'RSI',
          value: 'RSI 70 이상 (과매수)',
          rawValue: { type: 'rsi', overbought: true, oversold: false, timeframe: '1d' },
        };
      } else if (range === 'oversold') {
        rsiFilter = {
          id: 'rsi-auto',
          type: 'rsi',
          label: 'RSI',
          value: 'RSI 30 이하 (과매도)',
          rawValue: { type: 'rsi', overbought: false, oversold: true, timeframe: '1d' },
        };
      } else {
        // 기본값: 과매도
        rsiFilter = {
          id: 'rsi-auto',
          type: 'rsi',
          label: 'RSI',
          value: 'RSI 30 이하 (과매도)',
          rawValue: { type: 'rsi', overbought: false, oversold: true, timeframe: '1d' },
        };
      }
      setActiveFilters([rsiFilter]);
      setSelectedFilterMenu('rsi');
    } else if (filterType === 'change' && initialFilter.direction) {
      // 주가등락률 필터
      const direction = initialFilter.direction === 'up' ? 'up' : 'down';
      setChangeFilterPeriod('today');
      setChangeFilterMin(direction === 'up' ? '0' : '');
      setChangeFilterMax('');
      setSelectedFilterMenu('change');
      
      // 필터 자동 적용
      const changeFilter: Filter = {
        id: 'change-auto',
        type: 'change',
        label: '가격등락률',
        value: `24시간 ${direction === 'up' ? '0% 이상' : '0% 이하'}`,
        rawValue: { 
          period: 'today',
          min: direction === 'up' ? 0 : -100,
          max: direction === 'up' ? null : 0,
        },
      };
      setActiveFilters([changeFilter]);
    } else if (filterType === 'trend') {
      // 추세 필터
      const date = new Date();
      setTrendFilterDate(date);
      setTrendFilterDays(3);
      setSelectedFilterMenu('trend');
      
      // 필터 자동 적용
      const trendFilter: Filter = {
        id: 'trend-auto',
        type: 'trend',
        label: '주가 연속상승',
        value: `${format(date, 'yyyy년 MM월 dd일')} 기준 3일 이상 연속 상승`,
        rawValue: { date: format(date, 'yyyy-MM-dd'), days: 3 },
      };
      setActiveFilters([trendFilter]);
    } else if (filterType === 'volume') {
      // 거래량 필터 (RVOL 기준) - 기본값: 거래량 급등 (한달 일평균 대비)
      setVolumeFilterRvol(1.5);
      setVolumeFilterDirection('above');
      
      const volumeFilter: Filter = {
        id: 'volume-auto',
        type: 'volume',
        label: '상대거래량(RVOL)',
        value: '거래량 급등 (한달 일평균 대비 1.5배 이상)',
        rawValue: { 
          type: 'volume', 
          rvol: 1.5,
          direction: 'above',
        },
      };
      setActiveFilters([volumeFilter]);
      setSelectedFilterMenu('volume');
    } else if (filterType === 'feargreed' && initialFilter.sentiment) {
      // 공포탐욕지수 필터
      const sentimentFilter: Filter = {
        id: 'feargreed-auto',
        type: 'feargreed',
        label: '공포탐욕지수',
        value: initialFilter.sentiment === 'greed' ? '탐욕 상태' : '공포 상태',
        rawValue: { type: 'feargreed', sentiment: initialFilter.sentiment },
      };
      setActiveFilters([sentimentFilter]);
    } else if (filterType === 'ma' && initialFilter.crossover) {
      // 이동평균선 돌파 필터
      const crossover = initialFilter.crossover;
      setMaFilterTimeframe('1d');
      const maFilter: Filter = {
        id: 'ma-auto',
        type: 'ma',
        label: '이동평균선 돌파',
        value: crossover === 'golden' 
          ? `골든크로스 (5일선이 20일선을 상향돌파)`
          : `데드크로스 (5일선이 20일선을 하향돌파)`,
        rawValue: { 
          type: 'ma', 
          crossover: crossover,
          shortPeriod: 5,
          longPeriod: 20,
          timeframe: '1d',
        },
      };
      setActiveFilters([maFilter]);
      setSelectedFilterMenu('ma');
    } else if (filterType === 'category' && initialFilter.category) {
      // 카테고리 필터
      const category = initialFilter.category;
      const categoryLabels: Record<string, string> = {
        'ai': '인공지능(AI)',
        'l2': '레이어2',
        'game': '게임',
        'defi': '디파이',
        'rwa': '실물자산(RWA)',
      };
      
      const categoryFilter: Filter = {
        id: 'category-auto',
        type: 'category',
        label: '카테고리',
        value: categoryLabels[category] || category,
        rawValue: [category],
      };
      setActiveFilters([categoryFilter]);
      setSelectedFilterMenu('category');
    } else if (filterType === 'buysurge') {
      // 매수세 급증 필터
      const multiplier = parseFloat(initialFilter.multiplier || '1.5');
      const executionStrength = parseInt(initialFilter.executionStrength || '100');
      
      setBuySurgeMultiplier(multiplier);
      setBuySurgeExecutionStrength(executionStrength);
      
      const buySurgeFilter: Filter = {
        id: 'buysurge-auto',
        type: 'buysurge',
        label: '매수세 급증',
        value: `1시간 매수량이 24시간 평균보다 ${multiplier.toFixed(1)}배 많고, 체결강도가 ${executionStrength}% 이상인 코인`,
        rawValue: {
          type: 'buysurge',
          multiplier: multiplier,
          executionStrength: executionStrength,
        },
      };
      setActiveFilters([buySurgeFilter]);
      setSelectedFilterMenu('buysurge');
    } else if (filterType === 'deposit') {
      // 거래소입금 필터
      const multiplier = parseFloat(initialFilter.multiplier || '1.5');
      
      setDepositMultiplier(multiplier);
      
      const depositFilter: Filter = {
        id: 'deposit-auto',
        type: 'deposit',
        label: '거래소입금',
        value: `최근 1시간 동안의 순입금액이 직전 24시간 평균 대비 ${multiplier.toFixed(1)}배 이상 유입된 코인`,
        rawValue: {
          type: 'deposit',
          multiplier: multiplier,
        },
      };
      setActiveFilters([depositFilter]);
      setSelectedFilterMenu('deposit');
    } else if (filterType === 'whaletrade') {
      // 큰손동향 필터
      const tradeType = initialFilter.tradeType as 'whale_buy' | 'whale_sell' | 'trader_buy' | 'trader_sell' | null;
      if (!tradeType) return;
      
      setWhaleTradeType(tradeType);
      
      const labels: Record<string, string> = {
        'whale_buy': '고래 순매수',
        'whale_sell': '고래 순매도',
        'trader_buy': '거래왕 순매수',
        'trader_sell': '거래왕 순매도',
      };
      
      const whaleTradeFilter: Filter = {
        id: 'whaletrade-auto',
        type: 'whaletrade',
        label: '큰손동향',
        value: labels[tradeType],
        rawValue: {
          type: 'whaletrade',
          tradeType: tradeType,
        },
      };
      setActiveFilters([whaleTradeFilter]);
      setSelectedFilterMenu('whaletrade');
    } else if (filterType === 'profit') {
      // 미실현수익 필터
      const amount = initialFilter.amount ? parseFloat(initialFilter.amount) : null;
      
      if (amount === null) return;
      
      setProfitAmount(amount);
      
      const profitFilter: Filter = {
        id: 'profit-auto',
        type: 'profit',
        label: '미실현수익',
        value: `미실현 수익금 합계가 ${amount}억원 이상인 코인`,
        rawValue: {
          type: 'profit',
          amount: amount,
        },
      };
      setActiveFilters([profitFilter]);
      setSelectedFilterMenu('profit');
    } else if (filterType === 'beta') {
      // 베타 필터
      const direction = (initialFilter.betaDirection || 'same') as 'same' | 'opposite';
      const multiplier = parseFloat(initialFilter.betaMultiplier || '1.0');
      
      setBetaDirection(direction);
      setBetaMultiplier(multiplier);
      
      const directionLabel = direction === 'same' ? '같은' : '반대';
      const betaFilter: Filter = {
        id: 'beta-auto',
        type: 'beta',
        label: '베타',
        value: `비트코인과 ${directionLabel} 방향으로 ${multiplier.toFixed(1)}배 이상 움직이는 종목`,
        rawValue: {
          type: 'beta',
          direction: direction,
          multiplier: multiplier,
        },
      };
      setActiveFilters([betaFilter]);
      setSelectedFilterMenu('beta');
    } else if (filterType === 'volatility') {
      // 일간 변동폭 필터
      const threshold = parseFloat(initialFilter.volatilityThreshold || '10.0');
      
      setVolatilityThreshold(threshold);
      
      const volatilityFilter: Filter = {
        id: 'volatility-auto',
        type: 'volatility',
        label: '일간 변동폭',
        value: `당일 저가 대비 고가 차이가 ${threshold.toFixed(1)}% 이상인 종목`,
        rawValue: {
          type: 'volatility',
          threshold: threshold,
        },
      };
      setActiveFilters([volatilityFilter]);
      setSelectedFilterMenu('volatility');
    }
  }, [initialFilter]);

  const parseCurrency = (valueStr: string): number => {
    const num = parseFloat(valueStr.replace(/[^0-9.]/g, ''));
    if (valueStr.includes('조')) return num * 1_0000_0000_0000;
    if (valueStr.includes('억')) return num * 1_0000_0000;
    if (valueStr.includes('만')) return num * 1_0000;
    return num;
  }

  const parseMarketCap = (marketCapStr: string): number => {
    if (!marketCapStr || marketCapStr === '-') return 0;
    const cleaned = marketCapStr.replace(/,/g, '');
    let number = parseFloat(cleaned.replace(/[조억만원]/g, '')) || 0;
    
    if (cleaned.includes('조')) {
      number *= 1000000000000;
    } else if (cleaned.includes('억')) {
      number *= 100000000;
    } else if (cleaned.includes('만')) {
      number *= 10000;
    }
    
    return number;
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1000000000000) {
      return `${(value / 1000000000000).toFixed(1)}조원`;
    } else if (value >= 100000000) {
      return `${(value / 100000000).toFixed(0)}억원`;
    } else if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}만원`;
    }
    return `${value.toLocaleString()}원`;
  };

  const parseCurrencyInput = (input: string): number => {
    const cleaned = input.replace(/[^0-9.조억만]/g, '');
    let number = parseFloat(cleaned.replace(/[조억만]/g, '')) || 0;
    
    if (cleaned.includes('조')) {
      number *= 1000000000000;
    } else if (cleaned.includes('억')) {
      number *= 100000000;
    } else if (cleaned.includes('만')) {
      number *= 10000;
    }
    
    return number;
  };

  // Filter assets
  const filteredAssets = useMemo(() => {
    let assets = [...convertedAssets];
    
    // 검색된 티커가 있으면 해당 티커만 필터링
    if (searchedAsset) {
      return assets.filter(asset => asset.ticker === searchedAsset.ticker);
    }

    if (activeFilters.length === 0) {
      return assets;
    }

    return assets.filter(asset => {
      return activeFilters.every(filter => {
        if (filter.type === 'mcap' && filter.rawValue && Array.isArray(filter.rawValue)) {
          // 여러개 선택된 경우 (배열의 배열)
          if (filter.rawValue.length > 0 && Array.isArray(filter.rawValue[0])) {
            const ranges = filter.rawValue as number[][];
            return ranges.some(([min, max]) => {
              // 순위권 필터인지 확인 (max가 10000 이하인 경우 순위권으로 판단)
              if (max <= 10000) {
                return asset.rank >= min && asset.rank <= max;
              }
              // 시가총액 범위 필터
              const assetMcap = parseMarketCap(asset.marketCap || '0');
              return assetMcap >= min && assetMcap <= max;
            });
          } else if (filter.rawValue.length === 2) {
            // 단일 선택인 경우
            const [min, max] = filter.rawValue as number[];
            // 순위권 필터인지 확인 (max가 10000 이하인 경우 순위권으로 판단)
            if (max <= 10000) {
              return asset.rank >= min && asset.rank <= max;
            }
            // 시가총액 범위 필터
            const assetMcap = parseMarketCap(asset.marketCap || '0');
            return assetMcap >= min && assetMcap <= max;
          }
        }
        if (filter.type === 'change' && filter.rawValue && typeof filter.rawValue === 'object' && !Array.isArray(filter.rawValue)) {
          const changeFilter = filter.rawValue as { period?: string; min?: number; max?: number; date?: string; value?: number; direction?: string };
          
          // 새로운 필터 형식 (period, min, max)
          if (changeFilter.period && changeFilter.min !== undefined && changeFilter.max !== undefined) {
            let assetValue: number;
            if (changeFilter.period === 'today') {
              assetValue = asset.today;
            } else if (changeFilter.period === 'week') {
              assetValue = asset.week;
            } else {
              assetValue = asset.month;
            }
            return assetValue >= changeFilter.min && assetValue <= changeFilter.max;
          }
          
          // 기존 필터 형식 (date, value, direction) - 하위 호환성
          if (changeFilter.direction === 'up') {
            return asset.today >= (changeFilter.value || 0);
          } else if (changeFilter.direction === 'down') {
            return asset.today <= (changeFilter.value || 0);
          }
        }
        if (filter.type === 'buysurge' && filter.rawValue && typeof filter.rawValue === 'object' && !Array.isArray(filter.rawValue)) {
          const buySurgeFilter = filter.rawValue as { multiplier?: number; executionStrength?: number };
          // TODO: 실제 데이터와 연동 필요
          // asset에 buyVolumeMultiplier (1시간 매수량/24시간 평균 매수량)와 
          // executionStrength (매수총액/매도총액 * 100) 속성이 있다고 가정
          // const assetMultiplier = (asset as any).buyVolumeMultiplier || 0;
          // const assetExecutionStrength = (asset as any).executionStrength || 0;
          // return assetMultiplier >= (buySurgeFilter.multiplier || 0) && 
          //        assetExecutionStrength >= (buySurgeFilter.executionStrength || 0);
          // 임시로 모든 asset 통과 (실제 데이터 연동 시 위 주석 해제)
          return true;
        }
        if (filter.type === 'deposit' && filter.rawValue && typeof filter.rawValue === 'object' && !Array.isArray(filter.rawValue)) {
          const depositFilter = filter.rawValue as { multiplier?: number };
          // TODO: 실제 데이터와 연동 필요
          // asset에 depositMultiplier (최근 1시간 순입금액/직전 24시간 평균 순입금액) 속성이 있다고 가정
          // const assetDepositMultiplier = (asset as any).depositMultiplier || 0;
          // return assetDepositMultiplier >= (depositFilter.multiplier || 0);
          // 임시로 모든 asset 통과 (실제 데이터 연동 시 위 주석 해제)
          return true;
        }
        if (filter.type === 'profit' && filter.rawValue && typeof filter.rawValue === 'object' && !Array.isArray(filter.rawValue)) {
          const profitFilter = filter.rawValue as { amount?: number | null };
          // TODO: 실제 데이터와 연동 필요
          // asset에 unrealizedProfit (미실현 수익금 합계, 억원 단위) 속성이 있다고 가정
          // const assetProfit = (asset as any).unrealizedProfit || 0;
          // if (profitFilter.amount !== null && profitFilter.amount !== undefined && assetProfit < profitFilter.amount) {
          //   return false;
          // }
          // return true;
          // 임시로 모든 asset 통과 (실제 데이터 연동 시 위 주석 해제)
          return true;
        }
        if (filter.type === 'beta' && filter.rawValue && typeof filter.rawValue === 'object' && !Array.isArray(filter.rawValue)) {
          const betaFilter = filter.rawValue as { direction?: 'same' | 'opposite'; multiplier?: number };
          // TODO: 실제 데이터와 연동 필요
          // asset에 beta (비트코인 대비 움직임 배수) 속성이 있다고 가정
          // const assetBeta = (asset as any).beta || 0;
          // const multiplier = betaFilter.multiplier || 1.0;
          // if (betaFilter.direction === 'same') {
          //   // 같은 방향: 베타가 양수이고 절댓값이 multiplier 이상
          //   return assetBeta >= multiplier;
          // } else {
          //   // 반대 방향: 베타가 음수이고 절댓값이 multiplier 이상
          //   return assetBeta <= -multiplier;
          // }
          // 임시로 모든 asset 통과 (실제 데이터 연동 시 위 주석 해제)
          return true;
        }
        if (filter.type === 'volatility' && filter.rawValue && typeof filter.rawValue === 'object' && !Array.isArray(filter.rawValue)) {
          const volatilityFilter = filter.rawValue as { threshold?: number };
          // TODO: 실제 데이터와 연동 필요
          // asset에 volatility (당일 저가 대비 고가 차이, 퍼센트) 속성이 있다고 가정
          // const assetVolatility = (asset as any).volatility || 0;
          // const threshold = volatilityFilter.threshold || 0;
          // return assetVolatility >= threshold;
          // 임시로 모든 asset 통과 (실제 데이터 연동 시 위 주석 해제)
          return true;
        }
        // Other filters can be added here
        return true;
      });
    });
  }, [activeFilters, convertedAssets, searchedAsset]);

  const sortedAssets = useMemo(() => {
    let sortableItems = [...filteredAssets];
    sortableItems.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch(sortConfig.key) {
        case 'holderCount':
          aValue = a.deepDive.holderCount;
          bValue = b.deepDive.holderCount;
          break;
        case 'netDeposit24h':
          aValue = parseCurrency(a.deepDive.netDeposit24h);
          bValue = parseCurrency(b.deepDive.netDeposit24h);
          break;
        case 'influenceScore':
          aValue = getInfluenceLevel(a.deepDive.whaleHoldingRatio, a.deepDive.whaleTradingRatio).score;
          bValue = getInfluenceLevel(b.deepDive.whaleHoldingRatio, b.deepDive.whaleTradingRatio).score;
          break;
        case 'tradingVolume':
          aValue = parseCurrency(a.deepDive.tradingVolume);
          bValue = parseCurrency(b.deepDive.tradingVolume);
          break;
        case 'marketCap':
          aValue = parseCurrency(a.marketCap);
          bValue = parseCurrency(b.marketCap);
          break;
        default:
          aValue = a[sortConfig.key as keyof Asset];
          bValue = b[sortConfig.key as keyof Asset];
      }


      if (typeof aValue === 'string') {
        aValue = parseFloat(aValue.replace(/[^0-9.-]+/g,""));
      }
      if (typeof bValue === 'string') {
        bValue = parseFloat(bValue.replace(/[^0-9.-]+/g,""));
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortableItems;
  }, [sortConfig, filteredAssets, searchedAsset]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) {
      return <ChevronDown className="h-4 w-4" />;
    }
    return sortConfig.direction === 'ascending' ? <ChevronDown className="h-4 w-4 transform rotate-180" /> : <ChevronDown className="h-4 w-4" />;
  };

  // Filter handlers
  const handleApplyFilter = () => {
    const currentFilter = filterOptions[selectedFilterMenu];
    if (!currentFilter) return;

    let displayValue = '';
    let rawValue: string | string[] | number[] | Record<string, any> | undefined;

    if (currentFilter.type === 'custom') {
      if (selectedFilterMenu === 'change') {
        // 가격등락률 필터는 버튼 클릭 시 바로 적용되므로 여기서는 처리하지 않음
        return;
      } else if (selectedFilterMenu === 'trend') {
        if (!trendFilterDate) return;
        const dateStr = format(trendFilterDate, 'yyyy-MM-dd');
        displayValue = `${format(trendFilterDate, 'yyyy년 MM월 dd일')} 기준 ${trendFilterDays}일 이상 연속 상승`;
        rawValue = { date: dateStr, days: trendFilterDays } as Record<string, any>;
      }
    } else {
      const value = tempFilterValues[selectedFilterMenu];
      if (!value || (Array.isArray(value) && value.length === 0)) return;

      if (currentFilter.type === 'range' && selectedFilterMenu === 'mcap') {
        // 시가총액 필터: 여러개 선택 지원
        if (Array.isArray(value) && value.length > 0) {
          if (Array.isArray(value[0])) {
            // 여러개 선택된 경우
            const ranges = value as number[][];
            if (ranges.length === 0) return;
            
            const labels: string[] = [];
            ranges.forEach(([min, max]) => {
              if (mcapFilterMode === 'rank' && max <= 10000) {
                if (min === 1 && max <= 100) {
                  labels.push(`${max}위권 이내`);
                } else if (max === 9999) {
                  labels.push(`${min}위 이상`);
                } else {
                  labels.push(`${min}위 ~ ${max}위`);
                }
              } else {
                labels.push(`${formatCurrency(min)} ~ ${formatCurrency(max)}`);
              }
            });
            displayValue = labels.join(', ');
            rawValue = ranges;
          } else if (value.length === 2) {
            // 단일 선택인 경우
            const [min, max] = value as number[];
            if (min === currentFilter.min && max === currentFilter.max) {
              return;
            }
            // 순위권 필터인지 확인
            if (mcapFilterMode === 'rank' && max <= 10000) {
              if (min === 1 && max <= 100) {
                displayValue = `${max}위권 이내`;
              } else if (max === 9999) {
                displayValue = `${min}위 이상`;
              } else {
                displayValue = `${min}위 ~ ${max}위`;
              }
            } else {
              displayValue = `${formatCurrency(min)} ~ ${formatCurrency(max)}`;
            }
            rawValue = value;
          }
        }
      } else if (currentFilter.type === 'range' && Array.isArray(value) && value.length === 2) {
        const [min, max] = value as number[];
        if (min === currentFilter.min && max === currentFilter.max) {
          return;
        }
        displayValue = `${formatCurrency(min)} ~ ${formatCurrency(max)}`;
        rawValue = value;
      } else if (Array.isArray(value)) {
        displayValue = value.map(v => {
          const option = currentFilter.options?.find(opt => opt.value === v);
          return option?.label || v;
        }).join(', ');
        rawValue = value;
      } else {
        const option = currentFilter.options?.find(opt => opt.value === value);
        displayValue = option?.label || value;
        rawValue = value;
      }
    }

    if (!displayValue) return;

    const existingFilterIndex = activeFilters.findIndex(f => f.type === selectedFilterMenu as Filter['type']);
    
    const filterData: Filter = {
      id: `${selectedFilterMenu}-${Date.now()}`,
      type: selectedFilterMenu as Filter['type'],
      label: currentFilter.name,
      value: displayValue,
      rawValue: rawValue as any,
    };
    
    if (existingFilterIndex >= 0) {
      const newFilters = [...activeFilters];
      newFilters[existingFilterIndex] = filterData;
      setActiveFilters(newFilters);
    } else {
      setActiveFilters([...activeFilters, filterData]);
    }

    setFilterDialogOpen(false);
  };

  const handleRemoveFilter = (filterId: string) => {
    setActiveFilters(activeFilters.filter(f => f.id !== filterId));
  };

  const handleResetFilters = () => {
    setActiveFilters([]);
    setTempFilterValues({});
    setChangeFilterPeriod('today');
    setChangeFilterMin('');
    setChangeFilterMax('');
    setTrendFilterDate(new Date());
    setTrendFilterDays(3);
  };

  const handleFilterValueChange = (value: string) => {
    const currentFilter = filterOptions[selectedFilterMenu];
    if (!currentFilter) return;

    if (currentFilter.type === 'checkbox') {
      const currentValues = (tempFilterValues[selectedFilterMenu] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      setTempFilterValues({ ...tempFilterValues, [selectedFilterMenu]: newValues });
    } else {
      setTempFilterValues({ ...tempFilterValues, [selectedFilterMenu]: value });
    }
  };

  const handleRangeChange = (values: number[]) => {
    setTempFilterValues({ ...tempFilterValues, [selectedFilterMenu]: values });
  };

  const handleRangeInputChange = (index: 0 | 1, inputValue: string) => {
    const currentFilter = filterOptions[selectedFilterMenu];
    if (!currentFilter || currentFilter.type !== 'range') return;
    
    const numericValue = parseCurrencyInput(inputValue);
    const clampedValue = Math.max(
      currentFilter.min || 0,
      Math.min(currentFilter.max || 100000000000000, numericValue)
    );
    
    const currentRange = (tempFilterValues[selectedFilterMenu] as number[]) || [
      currentFilter.min || 0,
      currentFilter.max || 100000000000000,
    ];
    const newRange = [...currentRange];
    newRange[index] = clampedValue;
    
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = newRange[1];
    }
    
    setTempFilterValues({ ...tempFilterValues, [selectedFilterMenu]: newRange });
  };

  return (
    <div className="w-full space-y-12">
      <div>
        {!hideDeepDive && (
          <div className="mb-6">

          </div>
        )}
        
        {/* Filter Add Bar */}
        <div className="pb-4 border-b mb-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* 검색 - 필터 추가 왼쪽 */}
            <div className="flex items-center gap-2">
              {searchedAsset && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchedAsset(null);
                    setSelectedAsset(null);
                    setSearchQuery('');
                  }}
                  className="h-8 px-2"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
              <Popover open={searchOpen} onOpenChange={(open) => {
                setSearchOpen(open);
                if (!open) {
                  setSearchQuery('');
                }
              }}>
                <PopoverTrigger asChild>
                  <Button
                    variant={searchedAsset ? "default" : "outline"}
                    size="sm"
                    className="h-8 px-3 text-sm"
                  >
                    <Search className="w-3 h-3 mr-1" />
                    검색
                    {searchedAsset && (
                      <span className="ml-1">({searchedAsset.ticker})</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-2">
                    <Input
                      placeholder="티커 검색 (예: BTC, ETH)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                      className="mb-2"
                    />
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-1">
                        {convertedAssets
                          .filter(asset => 
                            asset.ticker.includes(searchQuery) || 
                            asset.name.includes(searchQuery) ||
                            searchQuery === ''
                          )
                          .map((asset) => (
                            <button
                              key={asset.ticker}
                              onClick={() => {
                                setSearchedAsset(asset);
                                setSelectedAsset(asset);
                                setSearchOpen(false);
                                setSearchQuery('');
                              }}
                              className="w-full flex items-center gap-2 p-2 rounded hover:bg-muted text-left"
                            >
                              {asset.img && (
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={asset.img} alt={asset.name} />
                                  <AvatarFallback>{asset.ticker}</AvatarFallback>
                                </Avatar>
                              )}
                              <div className="flex-1">
                                <div className="text-sm font-medium">{asset.name}</div>
                                <div className="text-xs text-muted-foreground">{asset.ticker}</div>
                              </div>
                            </button>
                          ))}
                      </div>
                    </ScrollArea>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
            <Dialog open={filterDialogOpen} onOpenChange={(open) => {
            setFilterDialogOpen(open);
            if (open) {
              // Dialog가 열릴 때 선택 상태 초기화
              setRsiSelected(null);
              setMaSelected(null);
            }
          }}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-sm"
              >
                <Plus className="w-3 h-3 mr-1" />
                필터 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl w-[90vw] max-h-[85vh] flex flex-col p-0">
              <DialogHeader className="px-6 pt-6 pb-4 border-b">
                <DialogTitle>필터 추가</DialogTitle>
              </DialogHeader>
              <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Filter Menu */}
                <div className="w-48 border-r bg-muted/30 p-4 overflow-y-auto">
                  <nav className="space-y-4">
                    {filterGroups.map((group) => {
                      // 각 카테고리별 색상 정의
                      const getGroupColor = (groupId: string) => {
                        switch (groupId) {
                          case 'main':
                            return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
                          case 'exchange':
                            return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
                          case 'price':
                            return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
                          case 'technical':
                            return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
                          default:
                            return 'bg-muted text-foreground border-border/50';
                        }
                      };
                      
                      return (
                        <div key={group.id} className="space-y-1">
                          <div className={cn(
                            "px-3 py-2 text-xs font-semibold rounded-md mb-1 border-b",
                            getGroupColor(group.id)
                          )}>
                            {group.name}
                          </div>
                        {group.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setSelectedFilterMenu(item.id);
                              // 필터 메뉴 변경 시 선택 상태 초기화
                              if (item.id === 'rsi') {
                                setRsiSelected(null);
                              } else if (item.id === 'ma') {
                                setMaSelected(null);
                              }
                            }}
                            className={cn(
                              'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors',
                              selectedFilterMenu === item.id
                                ? 'bg-muted text-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    );
                    })}
                  </nav>
                </div>

                {/* Right Content - Filter Options */}
                <div className="flex-1 p-8 overflow-y-auto">
                  {filterOptions[selectedFilterMenu] && (() => {
                    const currentFilter = filterOptions[selectedFilterMenu];
                    const currentValue = tempFilterValues[selectedFilterMenu];

                    if (currentFilter.type === 'range') {
                      const defaultRange: number[] = [
                        currentFilter.min || 0,
                        currentFilter.max || 100000000000000,
                      ];
                      if (!currentValue || !Array.isArray(currentValue)) {
                        setTempFilterValues({ ...tempFilterValues, [selectedFilterMenu]: defaultRange });
                      }
                    }

                    return (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-3">
                            {currentFilter.name}
                          </h3>
                          {selectedFilterMenu === 'mcap' ? (
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">
                                시가총액은 코인의 현재 가격에 유통량을 곱한 값이에요. 시가총액이 높을수록 시장에서 차지하는 비중이 크고, 안정적인 대형 코인으로 볼 수 있어요.
                              </p>
                            </div>
                          ) : currentFilter.description ? (
                            <p className="text-sm text-muted-foreground">
                              {currentFilter.description}
                            </p>
                          ) : null}
                        </div>

                        <div className="space-y-4">
                          {currentFilter.type === 'radio' && currentFilter.options && (
                            <div className="grid grid-cols-2 gap-3">
                              {currentFilter.options.map((option) => {
                                const isSelected = typeof currentValue === 'string' && currentValue === option.value;
                                return (
                                  <button
                                    key={option.value}
                                    onClick={() => handleFilterValueChange(option.value)}
                                    className={cn(
                                      'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                                      'hover:border-primary/50 hover:shadow-md',
                                      isSelected
                                        ? 'border-primary bg-primary/5 shadow-sm'
                                        : 'border-border bg-background'
                                    )}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-sm">{option.label}</span>
                                      {isSelected && (
                                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                          <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {currentFilter.type === 'checkbox' && currentFilter.options && (
                            <div className="grid grid-cols-2 gap-3">
                              {currentFilter.options.map((option) => {
                                const checked = Array.isArray(currentValue) && (currentValue as string[]).includes(option.value);
                                return (
                                  <button
                                    key={option.value}
                                    onClick={() => handleFilterValueChange(option.value)}
                                    className={cn(
                                      'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                                      'hover:border-primary/50 hover:shadow-md',
                                      checked
                                        ? 'border-primary bg-primary/5 shadow-sm'
                                        : 'border-border bg-background'
                                    )}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-sm">{option.label}</span>
                                      {checked && (
                                        <div className="w-5 h-5 rounded border-2 border-primary bg-primary flex items-center justify-center">
                                          <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {currentFilter.type === 'range' && selectedFilterMenu === 'mcap' && (
                            <div className="space-y-6">
                              {/* 필터 모드 선택 */}
                              <div className="flex items-center justify-end gap-4">
                                <div className="inline-flex gap-1 rounded-lg border border-border bg-background p-1 shrink-0">
                                  <button
                                    onClick={() => {
                                      setMcapFilterMode('range');
                                      // 모드 변경 시 tempFilterValues 초기화 (순위권 필터인 경우)
                                      if (tempFilterValues.mcap) {
                                        const newValues = { ...tempFilterValues };
                                        delete newValues.mcap;
                                        setTempFilterValues(newValues);
                                      }
                                    }}
                                    className={cn(
                                      'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                                      mcapFilterMode === 'range'
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    )}
                                  >
                                    시가총액 범위
                                  </button>
                                  <button
                                    onClick={() => {
                                      setMcapFilterMode('rank');
                                      // 모드 변경 시 tempFilterValues 초기화 (시가총액 범위 필터인 경우)
                                      if (tempFilterValues.mcap) {
                                        const newValues = { ...tempFilterValues };
                                        delete newValues.mcap;
                                        setTempFilterValues(newValues);
                                      }
                                    }}
                                    className={cn(
                                      'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                                      mcapFilterMode === 'rank'
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    )}
                                  >
                                    순위권
                                  </button>
                                </div>
                              </div>

                              {mcapFilterMode === 'range' && (
                                <div className="space-y-3">
                                  <Label className="text-sm font-medium text-foreground">시가총액 범위 선택</Label>
                                  <div className="grid grid-cols-2 gap-2.5">
                                    {[
                                      { label: '1000억 미만', min: 0, max: 100000000000 },
                                      { label: '1000억 ~ 5000억', min: 100000000000, max: 500000000000 },
                                      { label: '5000억 ~ 1조', min: 500000000000, max: 1000000000000 },
                                      { label: '1조 ~ 5조', min: 1000000000000, max: 5000000000000 },
                                      { label: '5조 ~ 10조', min: 5000000000000, max: 10000000000000 },
                                      { label: '10조 이상', min: 10000000000000, max: 100000000000000 },
                                    ].map((preset) => {
                                      const currentMcap = tempFilterValues.mcap;
                                      let isSelected = false;
                                      
                                      // 다중 선택 지원: 배열의 배열인 경우
                                      if (Array.isArray(currentMcap) && currentMcap.length > 0) {
                                        if (Array.isArray(currentMcap[0])) {
                                          // 여러개 선택된 경우
                                          isSelected = (currentMcap as number[][]).some(
                                            ([min, max]) => min === preset.min && max === preset.max
                                          );
                                        } else if (currentMcap.length === 2) {
                                          // 단일 선택인 경우
                                          isSelected = currentMcap[0] === preset.min && currentMcap[1] === preset.max;
                                        }
                                      }
                                      
                                      return (
                                        <button
                                          key={preset.label}
                                          onClick={() => {
                                            const currentMcap = tempFilterValues.mcap;
                                            let newMcap: number[][] = [];
                                            
                                            if (Array.isArray(currentMcap) && currentMcap.length > 0 && Array.isArray(currentMcap[0])) {
                                              // 이미 여러개 선택된 경우
                                              newMcap = [...(currentMcap as number[][])];
                                              const index = newMcap.findIndex(
                                                ([min, max]) => min === preset.min && max === preset.max
                                              );
                                              if (index >= 0) {
                                                // 이미 선택된 경우 제거
                                                newMcap.splice(index, 1);
                                              } else {
                                                // 추가
                                                newMcap.push([preset.min, preset.max]);
                                              }
                                            } else if (Array.isArray(currentMcap) && currentMcap.length === 2) {
                                              // 기존 단일 선택이 있는 경우
                                              const [min, max] = currentMcap as number[];
                                              if (min === preset.min && max === preset.max) {
                                                // 같은 항목 클릭 시 제거
                                                newMcap = [];
                                              } else {
                                                // 다른 항목 추가
                                                newMcap = [[min, max], [preset.min, preset.max]];
                                              }
                                            } else {
                                              // 새로 선택
                                              newMcap = [[preset.min, preset.max]];
                                            }
                                            
                                            setTempFilterValues({
                                              ...tempFilterValues,
                                              mcap: newMcap.length === 1 ? newMcap[0] : newMcap,
                                            });
                                          }}
                                          className={cn(
                                            'p-3.5 rounded-xl border-2 transition-all duration-200 text-left relative',
                                            'hover:border-primary/50 hover:bg-primary/5',
                                            isSelected
                                              ? 'border-primary bg-primary/10 shadow-sm'
                                              : 'border-border bg-background'
                                          )}
                                        >
                                          <span className="font-medium text-sm block">{preset.label}</span>
                                          {isSelected && (
                                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                              <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                              </svg>
                                            </div>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {mcapFilterMode === 'rank' && (
                                <div className="space-y-3">
                                  <Label className="text-sm font-medium text-foreground">순위권 선택</Label>
                                  <div className="grid grid-cols-3 gap-2.5">
                                    {[
                                      { label: '10위권 이내', min: 1, max: 10 },
                                      { label: '50위권 이내', min: 1, max: 50 },
                                      { label: '100위권 이내', min: 1, max: 100 },
                                      { label: '100위 ~ 200위', min: 100, max: 200 },
                                      { label: '200위 ~ 300위', min: 200, max: 300 },
                                      { label: '300위 이상', min: 300, max: 9999 },
                                    ].map((preset) => {
                                      const currentMcap = tempFilterValues.mcap;
                                      let isSelected = false;
                                      
                                      // 다중 선택 지원: 배열의 배열인 경우
                                      if (Array.isArray(currentMcap) && currentMcap.length > 0) {
                                        if (Array.isArray(currentMcap[0])) {
                                          // 여러개 선택된 경우
                                          isSelected = (currentMcap as number[][]).some(
                                            ([min, max]) => min === preset.min && max === preset.max
                                          );
                                        } else if (currentMcap.length === 2) {
                                          // 단일 선택인 경우
                                          isSelected = currentMcap[0] === preset.min && currentMcap[1] === preset.max;
                                        }
                                      }
                                      
                                      return (
                                        <button
                                          key={preset.label}
                                          onClick={() => {
                                            const currentMcap = tempFilterValues.mcap;
                                            let newMcap: number[][] = [];
                                            
                                            if (Array.isArray(currentMcap) && currentMcap.length > 0 && Array.isArray(currentMcap[0])) {
                                              // 이미 여러개 선택된 경우
                                              newMcap = [...(currentMcap as number[][])];
                                              const index = newMcap.findIndex(
                                                ([min, max]) => min === preset.min && max === preset.max
                                              );
                                              if (index >= 0) {
                                                // 이미 선택된 경우 제거
                                                newMcap.splice(index, 1);
                                              } else {
                                                // 추가
                                                newMcap.push([preset.min, preset.max]);
                                              }
                                            } else if (Array.isArray(currentMcap) && currentMcap.length === 2) {
                                              // 기존 단일 선택이 있는 경우
                                              const [min, max] = currentMcap as number[];
                                              if (min === preset.min && max === preset.max) {
                                                // 같은 항목 클릭 시 제거
                                                newMcap = [];
                                              } else {
                                                // 다른 항목 추가
                                                newMcap = [[min, max], [preset.min, preset.max]];
                                              }
                                            } else {
                                              // 새로 선택
                                              newMcap = [[preset.min, preset.max]];
                                            }
                                            
                                            setTempFilterValues({
                                              ...tempFilterValues,
                                              mcap: newMcap.length === 1 ? newMcap[0] : newMcap,
                                            });
                                          }}
                                          className={cn(
                                            'p-4 rounded-xl border-2 transition-all duration-200 text-center relative',
                                            'hover:border-primary/50 hover:bg-primary/5',
                                            isSelected
                                              ? 'border-primary bg-primary/10 shadow-sm'
                                              : 'border-border bg-background'
                                          )}
                                        >
                                          <span className="font-medium text-sm block">{preset.label}</span>
                                          {isSelected && (
                                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                              <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                              </svg>
                                            </div>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {currentFilter.type === 'range' && selectedFilterMenu !== 'mcap' && (
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <Slider
                                  value={
                                    Array.isArray(currentValue) && currentValue.length === 2
                                      ? (currentValue as number[])
                                      : [currentFilter.min || 0, currentFilter.max || 100000000000000]
                                  }
                                  onValueChange={handleRangeChange}
                                  min={currentFilter.min || 0}
                                  max={currentFilter.max || 100000000000000}
                                  step={currentFilter.step || 1000000000}
                                  className="w-full"
                                />
                                <div className="flex items-center gap-4">
                                  <div className="flex-1 space-y-2">
                                    <Label className="text-sm font-medium text-foreground">최소값</Label>
                                    <Input
                                      type="text"
                                      value={
                                        Array.isArray(currentValue) && currentValue.length === 2
                                          ? formatCurrency(currentValue[0] as number)
                                          : formatCurrency(currentFilter.min || 0)
                                      }
                                      onChange={(e) => handleRangeInputChange(0, e.target.value)}
                                      className="h-11 text-base"
                                    />
                                  </div>
                                  <div className="pt-8 text-muted-foreground text-lg font-medium">~</div>
                                  <div className="flex-1 space-y-2">
                                    <Label className="text-sm font-medium text-foreground">최대값</Label>
                                    <Input
                                      type="text"
                                      value={
                                        Array.isArray(currentValue) && currentValue.length === 2
                                          ? formatCurrency(currentValue[1] as number)
                                          : formatCurrency(currentFilter.max || 100000000000000)
                                      }
                                      onChange={(e) => handleRangeInputChange(1, e.target.value)}
                                      className="h-11 text-base"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentFilter.type === 'custom' && selectedFilterMenu === 'change' && (
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <div className="flex items-center justify-end gap-4">
                                  <div className="inline-flex gap-1 rounded-lg border border-border bg-background p-1 shrink-0">
                                    <button
                                      onClick={() => setChangeFilterPeriod('today')}
                                      className={cn(
                                        'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                                        changeFilterPeriod === 'today'
                                          ? 'bg-primary text-primary-foreground shadow-sm'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                      )}
                                    >
                                      24시간
                                    </button>
                                    <button
                                      onClick={() => setChangeFilterPeriod('week')}
                                      className={cn(
                                        'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                                        changeFilterPeriod === 'week'
                                          ? 'bg-primary text-primary-foreground shadow-sm'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                      )}
                                    >
                                      1주일
                                    </button>
                                    <button
                                      onClick={() => setChangeFilterPeriod('month')}
                                      className={cn(
                                        'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                                        changeFilterPeriod === 'month'
                                          ? 'bg-primary text-primary-foreground shadow-sm'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                      )}
                                    >
                                      1개월
                                    </button>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-foreground">등락률 범위</Label>
                                    <div className="flex items-center gap-4">
                                      <div className="flex-1 space-y-2">
                                        <Label className="text-sm font-medium text-foreground">최소값</Label>
                                        <div className="flex items-center gap-2">
                                          <Input
                                            type="number"
                                            placeholder="예: -10"
                                            value={changeFilterMin}
                                            onChange={(e) => {
                                              setChangeFilterMin(e.target.value);
                                            }}
                                            step={0.1}
                                            className="h-11 text-base"
                                          />
                                          <span className="text-muted-foreground text-sm">%</span>
                                        </div>
                                      </div>
                                      <div className="pt-8 text-muted-foreground text-lg font-medium">~</div>
                                      <div className="flex-1 space-y-2">
                                        <Label className="text-sm font-medium text-foreground">최대값 (선택)</Label>
                                        <div className="flex items-center gap-2">
                                          <Input
                                            type="number"
                                            value={changeFilterMax}
                                            onChange={(e) => {
                                              setChangeFilterMax(e.target.value);
                                            }}
                                            step={0.1}
                                            className="h-11 text-base"
                                          />
                                          <span className="text-muted-foreground text-sm">%</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 pt-2">
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        if (!changeFilterMin) return;
                                        const periodLabel = changeFilterPeriod === 'today' ? '24시간' : changeFilterPeriod === 'week' ? '1주일' : '1개월';
                                        const min = parseFloat(changeFilterMin);
                                        const max = changeFilterMax ? parseFloat(changeFilterMax) : null;
                                        
                                        let valueLabel = '';
                                        if (max !== null) {
                                          const minLabel = min >= 0 ? `+${min.toFixed(1)}` : min.toFixed(1);
                                          const maxLabel = max >= 0 ? `+${max.toFixed(1)}` : max.toFixed(1);
                                          valueLabel = `${minLabel}% ~ ${maxLabel}%`;
                                        } else {
                                          const minLabel = min >= 0 ? `+${min.toFixed(1)}` : min.toFixed(1);
                                          valueLabel = `${minLabel}% 이상`;
                                        }
                                        
                                        const changeFilter: Filter = {
                                          id: 'change-auto',
                                          type: 'change',
                                          label: '가격등락률',
                                          value: `${periodLabel} ${valueLabel}`,
                                          rawValue: { 
                                            period: changeFilterPeriod,
                                            min: min,
                                            max: max,
                                          },
                                        };
                                        setActiveFilters([changeFilter]);
                                      }}
                                      className="flex-1 h-11"
                                      disabled={!changeFilterMin}
                                    >
                                      적용
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentFilter.type === 'custom' && selectedFilterMenu === 'rsi' && (
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-foreground">RSI 범위 선택</Label>
                                  <div className="grid grid-cols-2 gap-3">
                                    <button
                                      onClick={() => setRsiSelected('oversold')}
                                      className={cn(
                                        'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                                        rsiSelected === 'oversold'
                                          ? 'border-primary bg-primary/5 shadow-sm'
                                          : 'border-border bg-background hover:border-primary/50 hover:shadow-md'
                                      )}
                                    >
                                      <div className="font-medium text-sm">과매도</div>
                                      <div className="text-xs text-muted-foreground mt-1">RSI 30 이하</div>
                                    </button>
                                    <button
                                      onClick={() => setRsiSelected('overbought')}
                                      className={cn(
                                        'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                                        rsiSelected === 'overbought'
                                          ? 'border-primary bg-primary/5 shadow-sm'
                                          : 'border-border bg-background hover:border-primary/50 hover:shadow-md'
                                      )}
                                    >
                                      <div className="font-medium text-sm">과매수</div>
                                      <div className="text-xs text-muted-foreground mt-1">RSI 70 이상</div>
                                    </button>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      if (rsiSelected === 'oversold') {
                                        const rsiFilter: Filter = {
                                          id: 'rsi-oversold',
                                          type: 'rsi',
                                          label: 'RSI',
                                          value: `RSI 30 이하 (과매도)`,
                                          rawValue: { type: 'rsi', overbought: false, oversold: true, timeframe: '1d' },
                                        };
                                        // 기존 RSI 필터 제거하고 새 필터 추가
                                        const otherFilters = activeFilters.filter(f => f.type !== 'rsi');
                                        setActiveFilters([...otherFilters, rsiFilter]);
                                        setRsiSelected(null);
                                      } else if (rsiSelected === 'overbought') {
                                        const rsiFilter: Filter = {
                                          id: 'rsi-overbought',
                                          type: 'rsi',
                                          label: 'RSI',
                                          value: `RSI 70 이상 (과매수)`,
                                          rawValue: { type: 'rsi', overbought: true, oversold: false, timeframe: '1d' },
                                        };
                                        // 기존 RSI 필터 제거하고 새 필터 추가
                                        const otherFilters = activeFilters.filter(f => f.type !== 'rsi');
                                        setActiveFilters([...otherFilters, rsiFilter]);
                                        setRsiSelected(null);
                                      }
                                    }}
                                    disabled={!rsiSelected}
                                    className="flex-1 h-11"
                                  >
                                    {rsiSelected === 'oversold' ? '과매도 적용하기' : rsiSelected === 'overbought' ? '과매수 적용하기' : '적용'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentFilter.type === 'custom' && selectedFilterMenu === 'ma' && (
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-foreground">돌파 방향</Label>
                                  <div className="grid grid-cols-2 gap-3">
                                    <button
                                      onClick={() => setMaSelected('golden')}
                                      className={cn(
                                        'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                                        maSelected === 'golden'
                                          ? 'border-primary bg-primary/5 shadow-sm'
                                          : 'border-border bg-background hover:border-primary/50 hover:shadow-md'
                                      )}
                                    >
                                      <div className="font-medium text-sm">골든크로스</div>
                                      <div className="text-xs text-muted-foreground mt-1">5일선 20일선 상향돌파</div>
                                    </button>
                                    <button
                                      onClick={() => setMaSelected('dead')}
                                      className={cn(
                                        'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                                        maSelected === 'dead'
                                          ? 'border-primary bg-primary/5 shadow-sm'
                                          : 'border-border bg-background hover:border-primary/50 hover:shadow-md'
                                      )}
                                    >
                                      <div className="font-medium text-sm">데드크로스</div>
                                      <div className="text-xs text-muted-foreground mt-1">5일선 20일선 하향돌파</div>
                                    </button>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      if (maSelected === 'golden') {
                                        const maFilter: Filter = {
                                          id: 'ma-golden',
                                          type: 'ma',
                                          label: '이동평균선 돌파',
                                          value: `골든크로스 (5일선이 20일선을 상향돌파)`,
                                          rawValue: { 
                                            type: 'ma', 
                                            crossover: 'golden',
                                            shortPeriod: 5,
                                            longPeriod: 20,
                                            timeframe: '1d',
                                          },
                                        };
                                        // 기존 MA 필터 제거하고 새 필터 추가
                                        const otherFilters = activeFilters.filter(f => f.type !== 'ma');
                                        setActiveFilters([...otherFilters, maFilter]);
                                        setMaSelected(null);
                                      } else if (maSelected === 'dead') {
                                        const maFilter: Filter = {
                                          id: 'ma-dead',
                                          type: 'ma',
                                          label: '이동평균선 돌파',
                                          value: `데드크로스 (5일선이 20일선을 하향돌파)`,
                                          rawValue: { 
                                            type: 'ma', 
                                            crossover: 'dead',
                                            shortPeriod: 5,
                                            longPeriod: 20,
                                            timeframe: '1d',
                                          },
                                        };
                                        // 기존 MA 필터 제거하고 새 필터 추가
                                        const otherFilters = activeFilters.filter(f => f.type !== 'ma');
                                        setActiveFilters([...otherFilters, maFilter]);
                                        setMaSelected(null);
                                      }
                                    }}
                                    disabled={!maSelected}
                                    className="flex-1 h-11"
                                  >
                                    {maSelected === 'golden' ? '골든크로스 적용하기' : maSelected === 'dead' ? '데드크로스 적용하기' : '적용'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentFilter.type === 'custom' && selectedFilterMenu === 'volume' && (
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-foreground">거래량 상태</Label>
                                  <div className="grid grid-cols-2 gap-3">
                                    <button
                                      onClick={() => {
                                        setVolumeFilterDirection('above');
                                        setVolumeFilterRvol(1.5);
                                      }}
                                      className={cn(
                                        'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                                        volumeFilterDirection === 'above'
                                          ? 'border-primary bg-primary/5 shadow-sm'
                                          : 'border-border bg-background hover:border-primary/50 hover:shadow-md'
                                      )}
                                    >
                                      <div className="font-medium text-sm">거래량 급등</div>
                                      <div className="text-xs text-muted-foreground mt-1">한달 일평균 대비 1.5배 이상</div>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setVolumeFilterDirection('below');
                                        setVolumeFilterRvol(0.5);
                                      }}
                                      className={cn(
                                        'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                                        volumeFilterDirection === 'below'
                                          ? 'border-primary bg-primary/5 shadow-sm'
                                          : 'border-border bg-background hover:border-primary/50 hover:shadow-md'
                                      )}
                                    >
                                      <div className="font-medium text-sm">거래량 침체</div>
                                      <div className="text-xs text-muted-foreground mt-1">한달 일평균 대비 0.5배 이하</div>
                                    </button>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      const rvol = volumeFilterRvol;
                                      const direction = volumeFilterDirection;
                                      
                                      const volumeFilter: Filter = {
                                        id: 'volume-custom',
                                        type: 'volume',
                                        label: '상대거래량(RVOL)',
                                        value: direction === 'above' 
                                          ? `거래량 급등 (한달 일평균 대비 ${rvol.toFixed(1)}배 이상)`
                                          : `거래량 침체 (한달 일평균 대비 ${rvol.toFixed(1)}배 이하)`,
                                        rawValue: { 
                                          type: 'volume', 
                                          rvol: rvol,
                                          direction: direction,
                                        },
                                      };
                                      // 기존 거래량 필터 제거하고 새 필터 추가
                                      const otherFilters = activeFilters.filter(f => f.type !== 'volume');
                                      setActiveFilters([...otherFilters, volumeFilter]);
                                    }}
                                    className="flex-1 h-11"
                                  >
                                    적용
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentFilter.type === 'custom' && selectedFilterMenu === 'buysurge' && (
                            <div className="space-y-6">
                              <div className="space-y-6">
                                <div className="space-y-4">
                                  <div className="space-y-3">
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium text-foreground">1시간 매수량 배수</Label>
                                      <div className="space-y-3">
                                        <Slider
                                          value={[buySurgeMultiplier]}
                                          onValueChange={(value) => setBuySurgeMultiplier(value[0])}
                                          min={1.0}
                                          max={10.0}
                                          step={0.1}
                                          className="w-full"
                                        />
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs text-muted-foreground">1.0배</span>
                                          <div className="flex items-center gap-2">
                                            <Input
                                              type="number"
                                              value={buySurgeMultiplier.toFixed(1)}
                                              onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                if (!isNaN(val) && val >= 1.0 && val <= 10.0) {
                                                  setBuySurgeMultiplier(val);
                                                }
                                              }}
                                              className="w-20 h-8 text-center text-sm"
                                              step="0.1"
                                              min="1.0"
                                              max="10.0"
                                            />
                                            <span className="text-xs text-muted-foreground">배</span>
                                          </div>
                                          <span className="text-xs text-muted-foreground">10.0배</span>
                                        </div>
                                   
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Label className="text-sm font-medium text-foreground">체결강도</Label>
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger>
                                              <Info className="w-4 h-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>체결강도는 매수총액/매도총액을 의미합니다.</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </div>
                                      <div className="space-y-3">
                                        <Slider
                                          value={[buySurgeExecutionStrength]}
                                          onValueChange={(value) => setBuySurgeExecutionStrength(value[0])}
                                          min={50}
                                          max={200}
                                          step={5}
                                          className="w-full"
                                        />
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs text-muted-foreground">50%</span>
                                          <div className="flex items-center gap-2">
                                            <Input
                                              type="number"
                                              value={buySurgeExecutionStrength}
                                              onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (!isNaN(val) && val >= 50 && val <= 200) {
                                                  setBuySurgeExecutionStrength(val);
                                                }
                                              }}
                                              className="w-20 h-8 text-center text-sm"
                                              step="5"
                                              min="50"
                                              max="200"
                                            />
                                            <span className="text-xs text-muted-foreground">% 이상</span>
                                          </div>
                                          <span className="text-xs text-muted-foreground">200%</span>
                                        </div>
                                        
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex gap-2 pt-2">
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        const buySurgeFilter: Filter = {
                                          id: 'buysurge-custom',
                                          type: 'buysurge',
                                          label: '매수세 급증',
                                          value: `1시간 매수량이 24시간 평균보다 ${buySurgeMultiplier.toFixed(1)}배 많고, 체결강도가 ${buySurgeExecutionStrength}% 이상인 코인`,
                                          rawValue: {
                                            type: 'buysurge',
                                            multiplier: buySurgeMultiplier,
                                            executionStrength: buySurgeExecutionStrength,
                                          },
                                        };
                                        // 기존 매수세 급증 필터 제거하고 새 필터 추가
                                        const otherFilters = activeFilters.filter(f => f.type !== 'buysurge');
                                        setActiveFilters([...otherFilters, buySurgeFilter]);
                                      }}
                                      className="flex-1 h-11"
                                    >
                                      적용
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentFilter.type === 'custom' && selectedFilterMenu === 'deposit' && (
                            <div className="space-y-6">
                              <div className="space-y-6">
                                <div className="space-y-4">
                                  <div className="space-y-3">
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium text-foreground">순입금액 배수</Label>
                                      <div className="space-y-3">
                                        <Slider
                                          value={[depositMultiplier]}
                                          onValueChange={(value) => setDepositMultiplier(value[0])}
                                          min={1.0}
                                          max={10.0}
                                          step={0.1}
                                          className="w-full"
                                        />
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs text-muted-foreground">1.0배</span>
                                          <div className="flex items-center gap-2">
                                            <Input
                                              type="number"
                                              value={depositMultiplier.toFixed(1)}
                                              onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                if (!isNaN(val) && val >= 1.0 && val <= 10.0) {
                                                  setDepositMultiplier(val);
                                                }
                                              }}
                                              className="w-20 h-8 text-center text-sm"
                                              step="0.1"
                                              min="1.0"
                                              max="10.0"
                                            />
                                            <span className="text-xs text-muted-foreground">배 이상</span>
                                          </div>
                                          <span className="text-xs text-muted-foreground">10.0배</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex gap-2 pt-2">
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        const depositFilter: Filter = {
                                          id: 'deposit-custom',
                                          type: 'deposit',
                                          label: '거래소입금',
                                          value: `최근 1시간 동안의 순입금액이 직전 24시간 평균 대비 ${depositMultiplier.toFixed(1)}배 이상 유입된 코인`,
                                          rawValue: {
                                            type: 'deposit',
                                            multiplier: depositMultiplier,
                                          },
                                        };
                                        // 기존 거래소입금 필터 제거하고 새 필터 추가
                                        const otherFilters = activeFilters.filter(f => f.type !== 'deposit');
                                        setActiveFilters([...otherFilters, depositFilter]);
                                      }}
                                      className="flex-1 h-11"
                                    >
                                      적용
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentFilter.type === 'custom' && selectedFilterMenu === 'whaletrade' && (
                            <div className="space-y-6">
                              <div className="space-y-6">
                                <div className="space-y-4">
                                  <div className="space-y-3">
                                    <div className="space-y-3">
                                      <div className="grid grid-cols-2 gap-3">
                                        <button
                                          onClick={() => setWhaleTradeType(whaleTradeType === 'whale_buy' ? null : 'whale_buy')}
                                          className={cn(
                                            'p-4 rounded-xl border-2 transition-all duration-200 text-left relative',
                                            'hover:border-primary/50 hover:bg-primary/5',
                                            whaleTradeType === 'whale_buy'
                                              ? 'border-primary bg-primary/10 shadow-sm'
                                              : 'border-border bg-background'
                                          )}
                                        >
                                          <div className="font-medium text-sm mb-1">고래 순매수</div>
                                          <div className="text-xs text-muted-foreground">자산규모 상위 100명이 가장 많이 사는 종목</div>
                                          {whaleTradeType === 'whale_buy' && (
                                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                              <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                              </svg>
                                            </div>
                                          )}
                                        </button>
                                        <button
                                          onClick={() => setWhaleTradeType(whaleTradeType === 'whale_sell' ? null : 'whale_sell')}
                                          className={cn(
                                            'p-4 rounded-xl border-2 transition-all duration-200 text-left relative',
                                            'hover:border-primary/50 hover:bg-primary/5',
                                            whaleTradeType === 'whale_sell'
                                              ? 'border-primary bg-primary/10 shadow-sm'
                                              : 'border-border bg-background'
                                          )}
                                        >
                                          <div className="font-medium text-sm mb-1">고래 순매도</div>
                                          <div className="text-xs text-muted-foreground">자산규모 상위 100명이 가장 많이 파는 종목</div>
                                          {whaleTradeType === 'whale_sell' && (
                                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                              <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                              </svg>
                                            </div>
                                          )}
                                        </button>
                                        <button
                                          onClick={() => setWhaleTradeType(whaleTradeType === 'trader_buy' ? null : 'trader_buy')}
                                          className={cn(
                                            'p-4 rounded-xl border-2 transition-all duration-200 text-left relative',
                                            'hover:border-primary/50 hover:bg-primary/5',
                                            whaleTradeType === 'trader_buy'
                                              ? 'border-primary bg-primary/10 shadow-sm'
                                              : 'border-border bg-background'
                                          )}
                                        >
                                          <div className="font-medium text-sm mb-1">거래왕 순매수</div>
                                          <div className="text-xs text-muted-foreground">거래량 상위 100명이 가장 많이 사는 종목</div>
                                          {whaleTradeType === 'trader_buy' && (
                                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                              <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                              </svg>
                                            </div>
                                          )}
                                        </button>
                                        <button
                                          onClick={() => setWhaleTradeType(whaleTradeType === 'trader_sell' ? null : 'trader_sell')}
                                          className={cn(
                                            'p-4 rounded-xl border-2 transition-all duration-200 text-left relative',
                                            'hover:border-primary/50 hover:bg-primary/5',
                                            whaleTradeType === 'trader_sell'
                                              ? 'border-primary bg-primary/10 shadow-sm'
                                              : 'border-border bg-background'
                                          )}
                                        >
                                          <div className="font-medium text-sm mb-1">거래왕 순매도</div>
                                          <div className="text-xs text-muted-foreground">거래량 상위 100명이 가장 많이 파는 종목</div>
                                          {whaleTradeType === 'trader_sell' && (
                                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                              <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                              </svg>
                                            </div>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex gap-2 pt-2">
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        if (!whaleTradeType) return;
                                        
                                        const labels: Record<string, string> = {
                                          'whale_buy': '고래 순매수',
                                          'whale_sell': '고래 순매도',
                                          'trader_buy': '거래왕 순매수',
                                          'trader_sell': '거래왕 순매도',
                                        };
                                        
                                        const whaleTradeFilter: Filter = {
                                          id: 'whaletrade-custom',
                                          type: 'whaletrade',
                                          label: '큰손동향',
                                          value: labels[whaleTradeType],
                                          rawValue: {
                                            type: 'whaletrade',
                                            tradeType: whaleTradeType,
                                          },
                                        };
                                        // 기존 큰손동향 필터 제거하고 새 필터 추가
                                        const otherFilters = activeFilters.filter(f => f.type !== 'whaletrade');
                                        setActiveFilters([...otherFilters, whaleTradeFilter]);
                                      }}
                                      disabled={!whaleTradeType}
                                      className="flex-1 h-11"
                                    >
                                      적용
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentFilter.type === 'custom' && selectedFilterMenu === 'beta' && (
                            <div className="space-y-6">
                              <div className="space-y-6">
                                <div className="space-y-4">
                                  <div className="space-y-3">
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium text-foreground">방향 선택</Label>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => setBetaDirection('same')}
                                          className={cn(
                                            'flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-200',
                                            betaDirection === 'same'
                                              ? 'border-primary bg-primary/10 shadow-sm'
                                              : 'border-border bg-background hover:border-primary/50 hover:bg-primary/5'
                                          )}
                                        >
                                          <span className="font-medium text-sm">같은 방향</span>
                                        </button>
                                        <button
                                          onClick={() => setBetaDirection('opposite')}
                                          className={cn(
                                            'flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-200',
                                            betaDirection === 'opposite'
                                              ? 'border-primary bg-primary/10 shadow-sm'
                                              : 'border-border bg-background hover:border-primary/50 hover:bg-primary/5'
                                          )}
                                        >
                                          <span className="font-medium text-sm">반대 방향</span>
                                        </button>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium text-foreground">베타 배수</Label>
                                      <div className="space-y-3">
                                        <Slider
                                          value={[betaMultiplier]}
                                          onValueChange={(value) => setBetaMultiplier(value[0])}
                                          min={0.1}
                                          max={5.0}
                                          step={0.1}
                                          className="w-full"
                                        />
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs text-muted-foreground">0.1배</span>
                                          <div className="flex items-center gap-2">
                                            <Input
                                              type="number"
                                              value={betaMultiplier.toFixed(1)}
                                              onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                if (!isNaN(val) && val >= 0.1 && val <= 5.0) {
                                                  setBetaMultiplier(val);
                                                }
                                              }}
                                              className="w-20 h-8 text-center text-sm"
                                              step="0.1"
                                              min="0.1"
                                              max="5.0"
                                            />
                                            <span className="text-xs text-muted-foreground">배 이상</span>
                                          </div>
                                          <span className="text-xs text-muted-foreground">5.0배</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex gap-2 pt-2">
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        const directionLabel = betaDirection === 'same' ? '같은' : '반대';
                                        const betaFilter: Filter = {
                                          id: 'beta-custom',
                                          type: 'beta',
                                          label: '베타',
                                          value: `비트코인과 ${directionLabel} 방향으로 ${betaMultiplier.toFixed(1)}배 이상 움직이는 종목`,
                                          rawValue: {
                                            type: 'beta',
                                            direction: betaDirection,
                                            multiplier: betaMultiplier,
                                          },
                                        };
                                        // 기존 베타 필터 제거하고 새 필터 추가
                                        const otherFilters = activeFilters.filter(f => f.type !== 'beta');
                                        setActiveFilters([...otherFilters, betaFilter]);
                                      }}
                                      className="flex-1 h-11"
                                    >
                                      적용
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentFilter.type === 'custom' && selectedFilterMenu === 'volatility' && (
                            <div className="space-y-6">
                              <div className="space-y-6">
                                <div className="space-y-4">
                                  <div className="space-y-3">
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium text-foreground">변동폭 기준</Label>
                                      <div className="space-y-3">
                                        <Slider
                                          value={[volatilityThreshold]}
                                          onValueChange={(value) => setVolatilityThreshold(value[0])}
                                          min={0.1}
                                          max={50.0}
                                          step={0.1}
                                          className="w-full"
                                        />
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs text-muted-foreground">0.1%</span>
                                          <div className="flex items-center gap-2">
                                            <Input
                                              type="number"
                                              value={volatilityThreshold.toFixed(1)}
                                              onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                if (!isNaN(val) && val >= 0.1 && val <= 50.0) {
                                                  setVolatilityThreshold(val);
                                                }
                                              }}
                                              className="w-20 h-8 text-center text-sm"
                                              step="0.1"
                                              min="0.1"
                                              max="50.0"
                                            />
                                            <span className="text-xs text-muted-foreground">% 이상</span>
                                          </div>
                                          <span className="text-xs text-muted-foreground">50.0%</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex gap-2 pt-2">
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        const volatilityFilter: Filter = {
                                          id: 'volatility-custom',
                                          type: 'volatility',
                                          label: '일간 변동폭',
                                          value: `당일 저가 대비 고가 차이가 ${volatilityThreshold.toFixed(1)}% 이상인 종목`,
                                          rawValue: {
                                            type: 'volatility',
                                            threshold: volatilityThreshold,
                                          },
                                        };
                                        // 기존 일간 변동폭 필터 제거하고 새 필터 추가
                                        const otherFilters = activeFilters.filter(f => f.type !== 'volatility');
                                        setActiveFilters([...otherFilters, volatilityFilter]);
                                      }}
                                      className="flex-1 h-11"
                                    >
                                      적용
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentFilter.type === 'custom' && selectedFilterMenu === 'profit' && (
                            <div className="space-y-6">
                              <div className="space-y-6">
                                <div className="space-y-4">
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium text-foreground">미실현 수익금 합계 (선택)</Label>
                                      <div className="space-y-3">
                                        <Slider
                                          value={profitAmount !== null ? [profitAmount] : [100]}
                                          onValueChange={(value) => setProfitAmount(value[0])}
                                          min={0}
                                          max={1000}
                                          step={10}
                                          className="w-full"
                                        />
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs text-muted-foreground">0억원</span>
                                          <div className="flex items-center gap-2">
                                            <Input
                                              type="number"
                                              value={profitAmount !== null ? profitAmount : ''}
                                              onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                if (!isNaN(val) && val >= 0 && val <= 1000) {
                                                  setProfitAmount(val);
                                                } else if (e.target.value === '') {
                                                  setProfitAmount(null);
                                                }
                                              }}
                                              placeholder="선택 안함"
                                              className="w-24 h-8 text-center text-sm"
                                              step="10"
                                              min="0"
                                              max="1000"
                                            />
                                            <span className="text-xs text-muted-foreground">억원 이상</span>
                                          </div>
                                          <span className="text-xs text-muted-foreground">1000억원</span>
                                        </div>
                                      </div>
                                    </div>

                                  </div>

                                  <div className="flex gap-2 pt-2">
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        if (profitAmount === null) return;
                                        
                                        const profitFilter: Filter = {
                                          id: 'profit-custom',
                                          type: 'profit',
                                          label: '미실현수익',
                                          value: `미실현 수익금 합계가 ${profitAmount}억원 이상인 코인`,
                                          rawValue: {
                                            type: 'profit',
                                            amount: profitAmount,
                                          },
                                        };
                                        // 기존 미실현수익 필터 제거하고 새 필터 추가
                                        const otherFilters = activeFilters.filter(f => f.type !== 'profit');
                                        setActiveFilters([...otherFilters, profitFilter]);
                                      }}
                                      disabled={profitAmount === null}
                                      className="flex-1 h-11"
                                    >
                                      적용
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t bg-background">
                {/* Active Filters */}
                {activeFilters.length > 0 && (
                  <div className="px-6 pt-4 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {activeFilters.map((filter) => (
                        <div
                          key={filter.id}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted/50 border border-border/50 rounded-full text-xs"
                        >
                          <span className="text-foreground font-medium">{filter.value || filter.label}</span>
                          <button
                            onClick={() => handleRemoveFilter(filter.id)}
                            className="hover:text-destructive transition-colors rounded-full hover:bg-destructive/10 p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="px-6 pb-6 pt-3 flex items-center justify-between gap-3">
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                  >
                    모든 필터 초기화
                  </button>
                  <Button
                    onClick={handleApplyFilter}
                    className="h-11 px-6 font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <span className="text-base">{filteredAssets.length}개</span>
                    <span className="text-sm ml-1 opacity-90">코인 보기</span>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
            </div>
          </div>
          
          {/* 필터 목록 - 필터 추가 버튼 아래 */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {activeFilters.map((filter) => {
                const isChangeFilter = filter.type === 'change';
            const isMaFilter = filter.type === 'ma';
            const isRsiFilter = filter.type === 'rsi';
            const isVolumeFilter = filter.type === 'volume';
            const filterRawValue = filter.rawValue as any;
            
            return (
              <Popover 
                key={filter.id}
                onOpenChange={(open) => {
                  if (open && isChangeFilter && filterRawValue) {
                    if (filterRawValue.period) {
                      setChangeFilterPeriod(filterRawValue.period);
                    }
                    if (filterRawValue.min !== undefined) {
                      setChangeFilterMin(filterRawValue.min.toString());
                    }
                    if (filterRawValue.max !== null && filterRawValue.max !== undefined) {
                      setChangeFilterMax(filterRawValue.max.toString());
                    } else {
                      setChangeFilterMax('');
                    }
                  }
                  // RSI 필터는 시간대 선택이 없으므로 초기화 불필요
                  // MA 필터는 시간대 선택이 없으므로 초기화 불필요
                  if (open && isVolumeFilter && filterRawValue) {
                    if (filterRawValue.spike !== undefined) {
                      setVolumeFilterRvol(filterRawValue.spike ? 1.5 : 0.5);
                      setVolumeFilterDirection(filterRawValue.spike ? 'above' : 'below');
                    } else {
                      setVolumeFilterRvol(filterRawValue.rvol ?? 1.5);
                      setVolumeFilterDirection(filterRawValue.direction ?? 'above');
                    }
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-1 px-3 py-1 bg-muted rounded-md text-sm cursor-pointer hover:bg-muted/80 transition-colors">
                    <span className="text-muted-foreground">{filter.label}:</span>
                    <span className="font-medium">{filter.value}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFilter(filter.id);
                      }}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </PopoverTrigger>
                {isRsiFilter && (
                  <PopoverContent className="w-auto p-4" align="start">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">RSI 범위 선택</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              const updatedFilter: Filter = {
                                ...filter,
                                id: 'rsi-oversold',
                                value: `RSI 30 이하 (과매도)`,
                                rawValue: { type: 'rsi', overbought: false, oversold: true, timeframe: '1d' },
                              };
                              setActiveFilters(activeFilters.map(f => 
                                f.id === filter.id ? updatedFilter : f
                              ));
                            }}
                            className={cn(
                              'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                              filterRawValue?.oversold && !filterRawValue?.overbought
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-border bg-background hover:border-primary/50 hover:shadow-md'
                            )}
                          >
                            <div className="font-medium text-sm">과매도</div>
                            <div className="text-xs text-muted-foreground mt-1">RSI 30 이하</div>
                          </button>
                          <button
                            onClick={() => {
                              const updatedFilter: Filter = {
                                ...filter,
                                id: 'rsi-overbought',
                                value: `RSI 70 이상 (과매수)`,
                                rawValue: { type: 'rsi', overbought: true, oversold: false, timeframe: '1d' },
                              };
                              setActiveFilters(activeFilters.map(f => 
                                f.id === filter.id ? updatedFilter : f
                              ));
                            }}
                            className={cn(
                              'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                              filterRawValue?.overbought && !filterRawValue?.oversold
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-border bg-background hover:border-primary/50 hover:shadow-md'
                            )}
                          >
                            <div className="font-medium text-sm">과매수</div>
                            <div className="text-xs text-muted-foreground mt-1">RSI 70 이상</div>
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveFilter(filter.id)}
                          className="flex-1 h-9"
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                )}
                {isChangeFilter && (
                  <PopoverContent className="w-auto p-4" align="start">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">기간 선택</Label>
                        <div className="flex gap-2 rounded-md bg-muted p-1">
                          <button
                            onClick={() => {
                              const rawValue = filterRawValue as { period?: string; min?: number; max?: number | null };
                              const period = 'today';
                              const periodLabel = '24시간';
                              const min = rawValue.min ?? (parseFloat(changeFilterMin) || 0);
                              const max = rawValue.max ?? (changeFilterMax ? parseFloat(changeFilterMax) : null);
                              
                              let valueLabel = '';
                              if (max !== null && max !== undefined) {
                                const minLabel = min >= 0 ? `+${min.toFixed(1)}` : min.toFixed(1);
                                const maxLabel = max >= 0 ? `+${max.toFixed(1)}` : max.toFixed(1);
                                valueLabel = `${minLabel}% ~ ${maxLabel}%`;
                              } else {
                                const minLabel = min >= 0 ? `+${min.toFixed(1)}` : min.toFixed(1);
                                valueLabel = `${minLabel}% 이상`;
                              }
                              
                              const updatedFilter: Filter = {
                                ...filter,
                                value: `${periodLabel} ${valueLabel}`,
                                rawValue: { ...rawValue, period, min, max },
                              };
                              setActiveFilters(activeFilters.map(f => 
                                f.id === filter.id ? updatedFilter : f
                              ));
                            }}
                            className={cn(
                              'flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors',
                              (filterRawValue as { period?: string })?.period === 'today' || !(filterRawValue as { period?: string })?.period
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            24시간
                          </button>
                          <button
                            onClick={() => {
                              const rawValue = filterRawValue as { period?: string; min?: number; max?: number | null };
                              const period = 'week';
                              const periodLabel = '1주일';
                              const min = rawValue.min ?? (parseFloat(changeFilterMin) || 0);
                              const max = rawValue.max ?? (changeFilterMax ? parseFloat(changeFilterMax) : null);
                              
                              let valueLabel = '';
                              if (max !== null && max !== undefined) {
                                const minLabel = min >= 0 ? `+${min.toFixed(1)}` : min.toFixed(1);
                                const maxLabel = max >= 0 ? `+${max.toFixed(1)}` : max.toFixed(1);
                                valueLabel = `${minLabel}% ~ ${maxLabel}%`;
                              } else {
                                const minLabel = min >= 0 ? `+${min.toFixed(1)}` : min.toFixed(1);
                                valueLabel = `${minLabel}% 이상`;
                              }
                              
                              const updatedFilter: Filter = {
                                ...filter,
                                value: `${periodLabel} ${valueLabel}`,
                                rawValue: { ...rawValue, period, min, max },
                              };
                              setActiveFilters(activeFilters.map(f => 
                                f.id === filter.id ? updatedFilter : f
                              ));
                            }}
                            className={cn(
                              'flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors',
                              (filterRawValue as { period?: string })?.period === 'week'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            1주일
                          </button>
                          <button
                            onClick={() => {
                              const rawValue = filterRawValue as { period?: string; min?: number; max?: number | null };
                              const period = 'month';
                              const periodLabel = '1개월';
                              const min = rawValue.min ?? (parseFloat(changeFilterMin) || 0);
                              const max = rawValue.max ?? (changeFilterMax ? parseFloat(changeFilterMax) : null);
                              
                              let valueLabel = '';
                              if (max !== null && max !== undefined) {
                                const minLabel = min >= 0 ? `+${min.toFixed(1)}` : min.toFixed(1);
                                const maxLabel = max >= 0 ? `+${max.toFixed(1)}` : max.toFixed(1);
                                valueLabel = `${minLabel}% ~ ${maxLabel}%`;
                              } else {
                                const minLabel = min >= 0 ? `+${min.toFixed(1)}` : min.toFixed(1);
                                valueLabel = `${minLabel}% 이상`;
                              }
                              
                              const updatedFilter: Filter = {
                                ...filter,
                                value: `${periodLabel} ${valueLabel}`,
                                rawValue: { ...rawValue, period, min, max },
                              };
                              setActiveFilters(activeFilters.map(f => 
                                f.id === filter.id ? updatedFilter : f
                              ));
                            }}
                            className={cn(
                              'flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors',
                              (filterRawValue as { period?: string })?.period === 'month'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            1개월
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-foreground">등락률 범위</Label>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 space-y-2">
                              <Label className="text-sm font-medium text-foreground">최소값</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  placeholder="예: -10"
                                  value={changeFilterMin}
                                  onChange={(e) => {
                                    setChangeFilterMin(e.target.value);
                                  }}
                                  step={0.1}
                                  className="h-10 text-sm"
                                />
                                <span className="text-muted-foreground text-sm">%</span>
                              </div>
                            </div>
                            <div className="pt-8 text-muted-foreground text-lg font-medium">~</div>
                            <div className="flex-1 space-y-2">
                              <Label className="text-sm font-medium text-foreground">최대값 (선택)</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                 
                                  value={changeFilterMax}
                                  onChange={(e) => {
                                    setChangeFilterMax(e.target.value);
                                  }}
                                  step={0.1}
                                  className="h-10 text-sm"
                                />
                                <span className="text-muted-foreground text-sm">%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              if (!changeFilterMin) return;
                              const rawValue = filterRawValue as { period?: string; min?: number; max?: number | null };
                              const period = rawValue.period || 'today';
                              const periodLabel = period === 'today' ? '24시간' : period === 'week' ? '1주일' : '1개월';
                              const min = parseFloat(changeFilterMin);
                              const max = changeFilterMax ? parseFloat(changeFilterMax) : null;
                              
                              let valueLabel = '';
                              if (max !== null && !isNaN(max)) {
                                const minLabel = min >= 0 ? `+${min.toFixed(1)}` : min.toFixed(1);
                                const maxLabel = max >= 0 ? `+${max.toFixed(1)}` : max.toFixed(1);
                                valueLabel = `${minLabel}% ~ ${maxLabel}%`;
                              } else {
                                const minLabel = min >= 0 ? `+${min.toFixed(1)}` : min.toFixed(1);
                                valueLabel = `${minLabel}% 이상`;
                              }
                              
                              const updatedFilter: Filter = {
                                ...filter,
                                value: `${periodLabel} ${valueLabel}`,
                                rawValue: { period, min, max },
                              };
                              setActiveFilters(activeFilters.map(f => 
                                f.id === filter.id ? updatedFilter : f
                              ));
                            }}
                            className="flex-1 h-9"
                            disabled={!changeFilterMin}
                          >
                            적용
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveFilter(filter.id)}
                            className="h-9"
                          >
                            삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                )}
                {isMaFilter && (
                  <PopoverContent className="w-auto p-4" align="start">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">돌파 방향</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              const updatedFilter: Filter = {
                                ...filter,
                                id: 'ma-golden',
                                value: `골든크로스 (5일선이 20일선을 상향돌파)`,
                                rawValue: { 
                                  type: 'ma', 
                                  crossover: 'golden',
                                  shortPeriod: 5,
                                  longPeriod: 20,
                                  timeframe: '1d',
                                },
                              };
                              setActiveFilters(activeFilters.map(f => 
                                f.id === filter.id ? updatedFilter : f
                              ));
                            }}
                            className={cn(
                              'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                              filterRawValue?.crossover === 'golden'
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-border bg-background hover:border-primary/50 hover:shadow-md'
                            )}
                          >
                            <div className="font-medium text-sm">골든크로스</div>
                            <div className="text-xs text-muted-foreground mt-1">5일선 20일선 상향돌파</div>
                          </button>
                          <button
                            onClick={() => {
                              const updatedFilter: Filter = {
                                ...filter,
                                id: 'ma-dead',
                                value: `데드크로스 (5일선이 20일선을 하향돌파)`,
                                rawValue: { 
                                  type: 'ma', 
                                  crossover: 'dead',
                                  shortPeriod: 5,
                                  longPeriod: 20,
                                  timeframe: '1d',
                                },
                              };
                              setActiveFilters(activeFilters.map(f => 
                                f.id === filter.id ? updatedFilter : f
                              ));
                            }}
                            className={cn(
                              'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                              filterRawValue?.crossover === 'dead'
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-border bg-background hover:border-primary/50 hover:shadow-md'
                            )}
                          >
                            <div className="font-medium text-sm">데드크로스</div>
                            <div className="text-xs text-muted-foreground mt-1">5일선 20일선 하향돌파</div>
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveFilter(filter.id)}
                          className="flex-1 h-9"
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                )}
                {isVolumeFilter && (
                  <PopoverContent className="w-auto p-4" align="start">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">거래량 상태</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              const updatedFilter: Filter = {
                                ...filter,
                                value: '거래량 급등 (한달 일평균 대비 1.5배 이상)',
                                rawValue: { 
                                  ...filterRawValue,
                                  type: 'volume',
                                  rvol: 1.5,
                                  direction: 'above',
                                },
                              };
                              setVolumeFilterDirection('above');
                              setVolumeFilterRvol(1.5);
                              setActiveFilters(activeFilters.map(f => 
                                f.id === filter.id ? updatedFilter : f
                              ));
                            }}
                            className={cn(
                              'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                              (filterRawValue?.direction === 'above' || (!filterRawValue?.direction && filterRawValue?.spike !== false))
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-border bg-background hover:border-primary/50 hover:shadow-md'
                            )}
                          >
                            <div className="font-medium text-sm">거래량 급등</div>
                            <div className="text-xs text-muted-foreground mt-1">한달 일평균 대비 1.5배 이상</div>
                          </button>
                          <button
                            onClick={() => {
                              const updatedFilter: Filter = {
                                ...filter,
                                value: '거래량 침체 (한달 일평균 대비 0.5배 이하)',
                                rawValue: { 
                                  ...filterRawValue,
                                  type: 'volume',
                                  rvol: 0.5,
                                  direction: 'below',
                                },
                              };
                              setVolumeFilterDirection('below');
                              setVolumeFilterRvol(0.5);
                              setActiveFilters(activeFilters.map(f => 
                                f.id === filter.id ? updatedFilter : f
                              ));
                            }}
                            className={cn(
                              'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                              (filterRawValue?.direction === 'below' || (!filterRawValue?.direction && filterRawValue?.spike === false))
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-border bg-background hover:border-primary/50 hover:shadow-md'
                            )}
                          >
                            <div className="font-medium text-sm">거래량 침체</div>
                            <div className="text-xs text-muted-foreground mt-1">한달 일평균 대비 0.5배 이하</div>
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveFilter(filter.id)}
                          className="flex-1 h-9"
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                )}
              </Popover>
            );
          })}
            </div>
          )}
        </div>

        <div className="w-full">
          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>코인을 클릭하면 상세 데이터를 확인할 수 있습니다</span>
          </div>
          <div className="relative">
            <div className="overflow-y-auto max-h-[900px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow className="border-b-0">
                    <TableHead className="text-muted-foreground font-semibold whitespace-nowrap" onClick={() => requestSort('rank')}>
                      <div className="flex items-center justify-start gap-1 cursor-pointer">
                        순위 {getSortIcon('rank')}
                      </div>
                    </TableHead>
                    <TableHead className="text-muted-foreground font-semibold whitespace-nowrap">
                      가상자산명
                    </TableHead>
                    <TableHead className="text-right text-muted-foreground font-semibold whitespace-nowrap" onClick={() => requestSort('today')}>
                        <div className="flex items-center justify-end gap-1 cursor-pointer">
                            오늘 {getSortIcon('today')}
                        </div>
                    </TableHead>
                    <TableHead className="text-right text-muted-foreground font-semibold whitespace-nowrap" onClick={() => requestSort('week')}>
                        <div className="flex items-center justify-end gap-1 cursor-pointer">
                            1주일 {getSortIcon('week')}
                        </div>
                    </TableHead>
                    <TableHead className="text-right text-muted-foreground font-semibold whitespace-nowrap" onClick={() => requestSort('month')}>
                        <div className="flex items-center justify-end gap-1 cursor-pointer">
                            1개월 {getSortIcon('month')}
                        </div>
                    </TableHead>
                    <TableHead className="text-right text-muted-foreground font-semibold whitespace-nowrap" onClick={() => requestSort('tradingVolume')}>
                        <div className="flex items-center justify-end gap-1 cursor-pointer">
                            거래량 (24H) {getSortIcon('tradingVolume')}
                        </div>
                    </TableHead>
                     <TableHead className="text-right text-muted-foreground font-semibold whitespace-nowrap" onClick={() => requestSort('netDeposit24h')}>
                      <div className="flex items-center justify-end gap-1 cursor-pointer">
                        거래소입금 (24H) {getSortIcon('netDeposit24h')}
                      </div>
                    </TableHead>
                    <TableHead className="text-right text-muted-foreground font-semibold whitespace-nowrap" onClick={() => requestSort('marketCap')}>
                      <div className="flex items-center justify-end gap-1 cursor-pointer">
                        시가총액 / 유통량 {getSortIcon('marketCap')}
                      </div>
                    </TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                  <TableBody>
                    {sortedAssets.map((asset) => {
                  return (
                  <TableRow
                    key={asset.rank}
                    className={cn(
                      'border-b cursor-pointer',
                      selectedAsset?.ticker === asset.ticker && 'bg-muted/50'
                    )}
                    onClick={() => {
                      if (selectedAsset?.ticker === asset.ticker) {
                        setSelectedAsset(null);
                      } else {
                        setSelectedAsset(asset);
                      }
                    }}
                  >
                    <TableCell className="py-4 font-mono text-center">
                      {asset.rank}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={asset.img} />
                          <AvatarFallback>{asset.ticker ? asset.ticker.charAt(0) : asset.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-bold text-foreground">{asset.name}</span>
                          <span className="text-muted-foreground ml-2 text-sm">
                            {asset.ticker}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-mono py-4',
                        asset.today > 0 ? 'text-green-500' : 'text-red-500'
                      )}
                    >
                      {formatPercentage(asset.today)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-mono py-4',
                        asset.week > 0 ? 'text-green-500' : 'text-red-500'
                      )}
                    >
                      {formatPercentage(asset.week)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-mono py-4',
                        asset.month > 0 ? 'text-green-500' : 'text-red-500'
                      )}
                    >
                      {formatPercentage(asset.month)}
                    </TableCell>
                    <TableCell className="text-right font-mono py-4">
                        {asset.deepDive.tradingVolume}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <div className={cn(
                        "font-mono",
                        asset.deepDive.netDeposit24h.startsWith('-') ? 'text-blue-500' : 'text-red-500'
                      )}>
                        {asset.deepDive.netDeposit24h}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-4 w-[200px]">
                      <div className="flex flex-col items-end">
                          <div className='text-foreground'>{asset.marketCap}</div>
                          <div className="text-muted-foreground text-sm">
                          {asset.circulatingSupply}
                          </div>
                          <Progress value={asset.supplyRatio} className="h-1 mt-2 bg-gray-200" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-md border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        거래하기
                      </Button>
                    </TableCell>
                  </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            </div>
          </div>
        </div>
      </div>
      {!hideDeepDive && (searchedAsset || selectedAsset) && (
        <>
          <div className="h-px w-full bg-border/50"></div>
          <AssetDeepDive asset={searchedAsset || selectedAsset!} />
        </>
      )}
    </div>
  );
}
