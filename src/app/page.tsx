import CandlestickChart from "@/components/tradingview/CandlestickChart";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <CandlestickChart />
    </div>
  );
}
