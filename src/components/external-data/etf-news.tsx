
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const newsData = [
    {
      time: '14:55',
      title: "블랙록 BTC 현물 ETF, 하루 만에 2억 달러 순유입 기록",
      content: "세계 최대 자산운용사 블랙록의 비트코인 현물 ETF(IBIT)가 지난 24시간 동안 2억 1,200만 달러의 순유입을 기록하며 강한 매수세를 보였다. 이는 최근 시장의 변동성에도 불구하고 기관 투자자들의 비트코인에 대한 관심이 여전히 높다는 것을 시사한다. 피델리티의 FBTC 또한 1억 5천만 달러의 순유입을 기록하며 뒤를 이었다.",
      asset: {
        ticker: 'BTC',
        img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032',
      }
    },
    {
      time: '11:20',
      title: "이더리움 현물 ETF 승인 기대감 속, ETH 가격 5% 급등",
      content: "미국 증권거래위원회(SEC)의 이더리움 현물 ETF 승인 결정이 임박했다는 기대감이 커지면서 이더리움(ETH) 가격이 24시간 동안 5% 이상 급등했다. 블룸버그 ETF 전문 애널리스트는 승인 가능성을 75%로 상향 조정하며 시장의 낙관론에 불을 지폈다. 전문가들은 ETF가 승인될 경우, 새로운 자본 유입으로 이더리움 생태계가 크게 확장될 것으로 전망하고 있다.",
      asset: {
        ticker: 'ETH',
        img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032',
      }
    },
    {
      time: '10:10',
      title: "마이크로스트래티지, 5억 달러 규모 비트코인 추가 매수",
      content: "나스닥 상장사 마이크로스트래티지가 5억 달러 상당의 비트코인을 추가로 매수했다고 발표했다. 이로써 회사의 총 비트코인 보유량은 약 22만 BTC에 달하게 되었으며, 이는 비트코인에 대한 강력한 장기적 신뢰를 다시 한번 보여주는 사례이다.",
      asset: {
        ticker: 'BTC',
        img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032',
      }
    },
    {
      time: '09:30',
      title: "익명의 고래, 1억 달러 상당의 ETH 거래소로 입금... 매도 압력 우려",
      content: "온체인 데이터 분석 플랫폼에 따르면, 한 익명의 대규모 이더리움 보유자(고래)가 약 1억 달러에 해당하는 3만 ETH를 주요 거래소로 입금한 정황이 포착되었다. 이는 단기적인 매도 압력으로 작용할 수 있어 투자자들의 주의가 요구된다.",
      asset: {
        ticker: 'ETH',
        img: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032',
      }
    },
    {
        time: '08:45',
        title: "그레이스케일 GBTC, 대규모 유출세 둔화... 시장 안정 신호?",
        content: "지난 몇 주간 지속적인 자금 유출을 겪었던 그레이스케일의 비트코인 신탁(GBTC)에서 유출 규모가 눈에 띄게 감소했다. 이는 GBTC 매도 압력이 완화되고 있음을 시사하며, 비트코인 가격 안정에 긍정적인 신호로 해석될 수 있다. 시장 참여자들은 유출세 둔화가 새로운 매수세 유입으로 이어질지 주목하고 있다.",
        asset: {
            ticker: 'BTC',
            img: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032',
        }
    },
    {
      time: '07:50',
      title: "캐나다에서 솔라나(SOL) 현물 ETF 출시 가능성 대두",
      content: "캐나다의 주요 자산 운용사가 솔라나 현물 ETF 출시를 위한 서류를 규제 당국에 제출했다는 소식이 전해졌다. 비트코인과 이더리움 외 알트코인에 대한 기관의 관심이 높아지고 있음을 보여주는 사례로, 승인 시 솔라나 생태계에 큰 호재가 될 전망이다.",
      asset: {
        ticker: 'SOL',
        img: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=032',
      }
    },
    {
      time: '06:15',
      title: "기관 보고서, '리플(XRP) 국경간 결제 채택 증가세'",
      content: "한 유명 투자은행이 발행한 보고서에 따르면, 아시아 태평양 지역을 중심으로 리플의 국경 간 결제 솔루션 채택이 꾸준히 증가하고 있는 것으로 나타났다. 보고서는 리플의 기술이 기존 금융 시스템의 비효율성을 개선할 잠재력이 있다고 평가했다.",
      asset: {
        ticker: 'XRP',
        img: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=032',
      }
    }
]

export function EtfNews() {
  return (
    <div className='space-y-8'>
      <h1 className="text-lg font-semibold text-foreground">주요 뉴스</h1>
      {newsData.map((news, index) => (
        <div key={index} className="grid grid-cols-[auto_1fr] gap-4 items-start">
          <div className="flex flex-col items-center">
             <span className="text-sm font-semibold bg-primary/20 text-primary rounded-md px-2 py-1">
              {news.time}
            </span>
            {index < newsData.length - 1 && <div className="w-px flex-grow bg-border mt-2"></div>}
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">{news.title}</h3>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{news.content}</p>
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={news.asset.img} />
                    <AvatarFallback>{news.asset.ticker.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold">{news.asset.ticker}</span>
              </div>
              <Button variant="outline" size="sm" className="h-8 rounded-lg border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground">
                거래하기
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
