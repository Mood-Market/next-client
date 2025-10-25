"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  UTCTimestamp,
} from "lightweight-charts";

type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w";

// Base candle data (hourly intervals within a single day)
// Using Unix timestamps for intraday data
const CANDLE_DATA = [
  {
    time: 1704067200 as UTCTimestamp,
    open: 100,
    high: 110,
    low: 95,
    close: 105,
  }, // 2024-01-01 00:00
  {
    time: 1704070800 as UTCTimestamp,
    open: 105,
    high: 115,
    low: 100,
    close: 112,
  }, // 2024-01-01 01:00
  {
    time: 1704074400 as UTCTimestamp,
    open: 112,
    high: 118,
    low: 108,
    close: 110,
  }, // 2024-01-01 02:00
  {
    time: 1704078000 as UTCTimestamp,
    open: 110,
    high: 112,
    low: 102,
    close: 104,
  }, // 2024-01-01 03:00
  {
    time: 1704081600 as UTCTimestamp,
    open: 104,
    high: 109,
    low: 98,
    close: 107,
  }, // 2024-01-01 04:00
  {
    time: 1704085200 as UTCTimestamp,
    open: 107,
    high: 120,
    low: 105,
    close: 118,
  }, // 2024-01-01 05:00
  {
    time: 1704088800 as UTCTimestamp,
    open: 118,
    high: 125,
    low: 115,
    close: 122,
  }, // 2024-01-01 06:00
  {
    time: 1704092400 as UTCTimestamp,
    open: 122,
    high: 128,
    low: 119,
    close: 120,
  }, // 2024-01-01 07:00
  {
    time: 1704096000 as UTCTimestamp,
    open: 120,
    high: 124,
    low: 112,
    close: 115,
  }, // 2024-01-01 08:00
  {
    time: 1704099600 as UTCTimestamp,
    open: 115,
    high: 121,
    low: 113,
    close: 119,
  }, // 2024-01-01 09:00
  {
    time: 1704103200 as UTCTimestamp,
    open: 119,
    high: 126,
    low: 117,
    close: 124,
  }, // 2024-01-01 10:00
  {
    time: 1704106800 as UTCTimestamp,
    open: 124,
    high: 130,
    low: 122,
    close: 128,
  }, // 2024-01-01 11:00
  {
    time: 1704110400 as UTCTimestamp,
    open: 128,
    high: 132,
    low: 125,
    close: 126,
  }, // 2024-01-01 12:00
  {
    time: 1704114000 as UTCTimestamp,
    open: 126,
    high: 129,
    low: 120,
    close: 122,
  }, // 2024-01-01 13:00
  {
    time: 1704117600 as UTCTimestamp,
    open: 122,
    high: 127,
    low: 118,
    close: 125,
  }, // 2024-01-01 14:00
];

// Function to aggregate candles based on timeframe
const getAggregatedData = (timeframe: Timeframe) => {
  if (timeframe === "1h") {
    return CANDLE_DATA;
  }

  // For smaller timeframes (1m, 5m, 15m), split each hourly candle into multiple candles
  if (["1m", "5m", "15m"].includes(timeframe)) {
    const candlesPerHour: { [key in Timeframe]?: number } = {
      "1m": 60,
      "5m": 12,
      "15m": 4,
    };

    const count = candlesPerHour[timeframe] || 1;
    const result = [];

    for (const hourlyCandle of CANDLE_DATA) {
      const priceRange = hourlyCandle.high - hourlyCandle.low;
      let currentPrice = hourlyCandle.open;

      for (let i = 0; i < count; i++) {
        let secondsOffset = 0;

        if (timeframe === "1m") {
          secondsOffset = i * 60;
        } else if (timeframe === "5m") {
          secondsOffset = i * 5 * 60;
        } else if (timeframe === "15m") {
          secondsOffset = i * 15 * 60;
        }

        const targetPrice =
          hourlyCandle.open +
          ((hourlyCandle.close - hourlyCandle.open) * (i + 1)) / count;
        const open = currentPrice;
        const close = targetPrice;
        const volatility = priceRange / count;
        const high = Math.max(open, close) + volatility * 0.3;
        const low = Math.min(open, close) - volatility * 0.3;

        const timestamp = (hourlyCandle.time + secondsOffset) as UTCTimestamp;

        result.push({
          time: timestamp,
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          close: parseFloat(close.toFixed(2)),
        });

        currentPrice = close;
      }
    }

    return result;
  }

  // For 4h timeframe, aggregate 4 hourly candles
  if (timeframe === "4h") {
    const result = [];
    for (let i = 0; i < CANDLE_DATA.length; i += 4) {
      const fourHourCandles = CANDLE_DATA.slice(i, i + 4);
      if (fourHourCandles.length === 0) continue;

      const open = fourHourCandles[0].open;
      const close = fourHourCandles[fourHourCandles.length - 1].close;
      const high = Math.max(...fourHourCandles.map((c) => c.high));
      const low = Math.min(...fourHourCandles.map((c) => c.low));
      const time = fourHourCandles[0].time;

      result.push({ time, open, high, low, close });
    }
    return result;
  }

  // For 1d timeframe, aggregate all hourly candles into one daily candle
  if (timeframe === "1d") {
    const open = CANDLE_DATA[0].open;
    const close = CANDLE_DATA[CANDLE_DATA.length - 1].close;
    const high = Math.max(...CANDLE_DATA.map((c) => c.high));
    const low = Math.min(...CANDLE_DATA.map((c) => c.low));
    const time = CANDLE_DATA[0].time;

    return [{ time, open, high, low, close }];
  }

  // For 1w timeframe, same as 1d since we only have one day of data
  if (timeframe === "1w") {
    const open = CANDLE_DATA[0].open;
    const close = CANDLE_DATA[CANDLE_DATA.length - 1].close;
    const high = Math.max(...CANDLE_DATA.map((c) => c.high));
    const low = Math.min(...CANDLE_DATA.map((c) => c.low));
    const time = CANDLE_DATA[0].time;

    return [{ time, open, high, low, close }];
  }

  return CANDLE_DATA;
};

export default function CandlestickChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>("1d");

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: "#ffffff" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#e1e1e1" },
        horzLines: { color: "#e1e1e1" },
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    const data = getAggregatedData(timeframe);
    candlestickSeries.setData(data);

    // Fit content to chart
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [timeframe]);

  const timeframes: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1d", "1w"];

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            style={{
              padding: "8px 16px",
              border: "1px solid #e1e1e1",
              borderRadius: "4px",
              backgroundColor: timeframe === tf ? "#26a69a" : "#ffffff",
              color: timeframe === tf ? "#ffffff" : "#333",
              cursor: "pointer",
              fontWeight: timeframe === tf ? "600" : "400",
              transition: "all 0.2s",
            }}
          >
            {tf.toUpperCase()}
          </button>
        ))}
      </div>
      <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />
    </div>
  );
}
