"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  UTCTimestamp,
} from "lightweight-charts";
import { MoodLog } from "@/utils/api";
import { useMoodLogs } from "@/context/MoodLogContext";

type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w";

interface ConvertedCandle {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
}

// Helper function to get interval size in seconds based on timeframe
const getIntervalSeconds = (timeframe: Timeframe): number => {
  const intervals: { [key in Timeframe]: number } = {
    "1m": 60,
    "5m": 5 * 60,
    "15m": 15 * 60,
    "1h": 60 * 60,
    "4h": 4 * 60 * 60,
    "1d": 24 * 60 * 60,
    "1w": 7 * 24 * 60 * 60,
  };
  return intervals[timeframe];
};

// Helper function to round down timestamp to interval
const roundDownToInterval = (
  timestamp: number,
  intervalSeconds: number
): number => {
  return Math.floor(timestamp / intervalSeconds) * intervalSeconds;
};

// Function to convert mood logs to candle data grouped by timeframe
// Each mood impact affects the price, creating OHLC data for each interval
const convertLogsToCandles = (
  logs: MoodLog[],
  timeframe: Timeframe
): ConvertedCandle[] => {
  if (logs.length === 0) return [];

  const intervalSeconds = getIntervalSeconds(timeframe);

  // Group logs by interval
  const logsByInterval = new Map<number, MoodLog[]>();

  for (const log of logs) {
    // Round down to the nearest interval
    const intervalKey = roundDownToInterval(log.time, intervalSeconds);

    if (!logsByInterval.has(intervalKey)) {
      logsByInterval.set(intervalKey, []);
    }
    logsByInterval.get(intervalKey)!.push(log);
  }

  // Sort the intervals chronologically
  const sortedIntervals = Array.from(logsByInterval.keys()).sort(
    (a, b) => a - b
  );

  const candlesticks: ConvertedCandle[] = [];
  let currentPrice = 0; // Starting price baseline

  for (const interval of sortedIntervals) {
    const logsInInterval = logsByInterval.get(interval)!;

    // Sort logs within the interval by time
    logsInInterval.sort((a, b) => a.time - b.time);

    const open = currentPrice;
    let high = currentPrice;
    let low = currentPrice;
    let close = currentPrice;

    // Apply each impact in chronological order within the interval
    for (const log of logsInInterval) {
      // Convert impact to price change
      const priceChange = log.impact * 0.5;
      close += priceChange;

      // Update high and low
      if (close > high) high = close;
      if (close < low) low = close;
    }

    // Ensure high >= max(open, close) and low <= min(open, close)
    high = Math.max(high, open, close);
    low = Math.min(low, open, close);

    candlesticks.push({
      time: interval as UTCTimestamp,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
    });

    // Update current price for next interval
    currentPrice = close;
  }

  return candlesticks;
};

export default function CandlestickChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>("1d");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Start with today
  const { getLogsByDate, addLog } = useMoodLogs();
  const moodLogs = getLogsByDate(selectedDate);

  // Handle adding a log with positive or negative impact
  const handleAddLog = (impact: number) => {
    addLog({ activity: "", impact });
  };

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
    if (moodLogs.length === 0) return;

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

    // Convert mood logs to candle data with the selected timeframe
    const data = convertLogsToCandles(moodLogs, timeframe);
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
  }, [timeframe, selectedDate, moodLogs]);

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
      {moodLogs.length === 0 ? (
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
              No mood logs found for {formatDate(selectedDate)}
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={chartContainerRef}
          style={{ width: "100%", height: "400px" }}
        />
      )}

      {/* Buy/Sell Buttons */}
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          gap: "12px",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => handleAddLog(-2.5)}
          style={{
            flex: 1,
            maxWidth: "200px",
            padding: "16px 24px",
            backgroundColor: "#ef5350",
            color: "#ffffff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "16px",
            transition: "all 0.2s",
            textTransform: "uppercase",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f44336";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ef5350";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Sell
        </button>
        <button
          onClick={() => handleAddLog(2.5)}
          style={{
            flex: 1,
            maxWidth: "200px",
            padding: "16px 24px",
            backgroundColor: "#26a69a",
            color: "#ffffff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "16px",
            transition: "all 0.2s",
            textTransform: "uppercase",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2bbbad";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#26a69a";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Buy
        </button>
      </div>
    </div>
  );
}
