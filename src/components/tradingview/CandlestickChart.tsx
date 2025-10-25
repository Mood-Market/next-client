"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, CandlestickSeries } from "lightweight-charts";

export default function CandlestickChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);

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

    // Mock candlestick data (10 candles)
    const data = [
      { time: "2024-01-01", open: 100, high: 110, low: 95, close: 105 },
      { time: "2024-01-02", open: 105, high: 115, low: 100, close: 112 },
      { time: "2024-01-03", open: 112, high: 118, low: 108, close: 110 },
      { time: "2024-01-04", open: 110, high: 112, low: 102, close: 104 },
      { time: "2024-01-05", open: 104, high: 109, low: 98, close: 107 },
      { time: "2024-01-06", open: 107, high: 120, low: 105, close: 118 },
      { time: "2024-01-07", open: 118, high: 125, low: 115, close: 122 },
      { time: "2024-01-08", open: 122, high: 128, low: 119, close: 120 },
      { time: "2024-01-09", open: 120, high: 124, low: 112, close: 115 },
      { time: "2024-01-10", open: 115, high: 121, low: 113, close: 119 },
    ];

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
  }, []);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />
  );
}
