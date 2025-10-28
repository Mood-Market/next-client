import CandlestickChart from "@/components/tradingview/CandlestickChart";
import ProtectedLayout from "@/components/ProtectedLayout";

export default function Home() {
  return (
    <ProtectedLayout>
      <div
        style={{
          width: "100%",
          height: "100dvh", // dvh accounts for dynamic viewport on mobile browsers
          overflow: "hidden",
          backgroundColor: "#09090b",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <CandlestickChart />
      </div>
    </ProtectedLayout>
  );
}
