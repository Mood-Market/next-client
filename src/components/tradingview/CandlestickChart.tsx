"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  UTCTimestamp,
} from "lightweight-charts";
import { fetchCandleData, CandleData } from "@/utils/api";

type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w";

// Function to aggregate candles based on timeframe
const getAggregatedData = (candleData: CandleData[], timeframe: Timeframe) => {
  if (timeframe === "1h") {
    return candleData;
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

    for (const hourlyCandle of candleData) {
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
    for (let i = 0; i < candleData.length; i += 4) {
      const fourHourCandles = candleData.slice(i, i + 4);
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
    const open = candleData[0].open;
    const close = candleData[candleData.length - 1].close;
    const high = Math.max(...candleData.map((c) => c.high));
    const low = Math.min(...candleData.map((c) => c.low));
    const time = candleData[0].time;

    return [{ time, open, high, low, close }];
  }

  // For 1w timeframe, same as 1d since we only have one day of data
  if (timeframe === "1w") {
    const open = candleData[0].open;
    const close = candleData[candleData.length - 1].close;
    const high = Math.max(...candleData.map((c) => c.high));
    const low = Math.min(...candleData.map((c) => c.low));
    const time = candleData[0].time;

    return [{ time, open, high, low, close }];
  }

  return candleData;
};

export default function CandlestickChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>("1d");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2024, 0, 1)); // Start with Jan 1, 2024
  const [candleData, setCandleData] = useState<CandleData[]>([]);

  // Fetch candle data when date changes
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCandleData(selectedDate);
        setCandleData(data);
      } catch (error) {
        console.error("Error fetching candle data:", error);
      }
    };

    loadData();
  }, [selectedDate]);

  // Handle date change
  const changeDate = (days: number) => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clear previous chart if exists
    chartContainerRef.current.innerHTML = "";

    // If no data, don't create chart
    if (candleData.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: "#1a1a1a" },
        textColor: "#d1d5db",
      },
      grid: {
        vertLines: { color: "#2a2a2a" },
        horzLines: { color: "#2a2a2a" },
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    const data = getAggregatedData(candleData, timeframe);
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
  }, [timeframe, candleData]);

  const timeframes: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1d", "1w"];

  return (
    <div style={{ width: "100%" }}>
      {/* Date Selector */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <button
          onClick={() => changeDate(-1)}
          style={{
            padding: "8px 12px",
            border: "1px solid #3a3a3a",
            borderRadius: "4px",
            backgroundColor: "#2a2a2a",
            color: "#d1d5db",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#3a3a3a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#2a2a2a";
          }}
        >
          ←
        </button>
        <div
          style={{
            padding: "8px 16px",
            border: "1px solid #3a3a3a",
            borderRadius: "4px",
            backgroundColor: "#1a1a1a",
            color: "#d1d5db",
            fontSize: "14px",
            fontWeight: "500",
            minWidth: "140px",
            textAlign: "center",
          }}
        >
          {formatDate(selectedDate)}
        </div>
        <button
          onClick={() => changeDate(1)}
          style={{
            padding: "8px 12px",
            border: "1px solid #3a3a3a",
            borderRadius: "4px",
            backgroundColor: "#2a2a2a",
            color: "#d1d5db",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#3a3a3a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#2a2a2a";
          }}
        >
          →
        </button>
      </div>

      {/* Timeframe Selector */}
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
              border: "1px solid #3a3a3a",
              borderRadius: "4px",
              backgroundColor: timeframe === tf ? "#26a69a" : "#2a2a2a",
              color: timeframe === tf ? "#ffffff" : "#d1d5db",
              cursor: "pointer",
              fontWeight: timeframe === tf ? "600" : "400",
              transition: "all 0.2s",
            }}
          >
            {tf.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Chart Container or Empty State */}
      {candleData.length === 0 ? (
        <div
          style={{
            width: "100%",
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #3a3a3a",
            borderRadius: "4px",
            backgroundColor: "#1a1a1a",
          }}
        >
          <div style={{ textAlign: "center", color: "#9ca3af" }}>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              No Data Available
            </div>
            <div style={{ fontSize: "14px" }}>
              No candle data found for {formatDate(selectedDate)}
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={chartContainerRef}
          style={{ width: "100%", height: "400px" }}
        />
      )}
    </div>
  );
}
