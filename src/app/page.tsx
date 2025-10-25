import CandlestickChart from "@/components/tradingview/CandlestickChart";

export default function Home() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#09090b",
      }}
    >
      <CandlestickChart />
    </div>
  );
}
