'use client';

import React, { useEffect, useRef, memo } from 'react';

interface SymbolInfo {
  proName: string;
  title: string;
}

interface TradingViewTickerTapeProps {
  symbols: SymbolInfo[];
}

function TradingViewTickerTape({ symbols }: TradingViewTickerTapeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptAppended = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !symbols || symbols.length === 0) return;

    // Clear previous widget
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: symbols.length > 0 ? symbols : [
        // Default symbols if none are selected
        { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
        { "proName": "BITSTAMP:ETHUSD", "title": "Ethereum" },
      ],
      "showSymbolLogo": true,
      "colorTheme": "light",
      "isTransparent": true,
      "displayMode": "adaptive",
      "locale": "kr"
    });
    
    container.appendChild(script);

    // No need for scriptAppended.current flag as we re-create on symbols change
    
    return () => {
      // Clean up the script when the component unmounts or symbols change
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [symbols]);

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export { TradingViewTickerTape };
export const MemoizedTradingViewTickerTape = memo(TradingViewTickerTape);
