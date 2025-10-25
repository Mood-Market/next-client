import CandlestickChart from "@/components/tradingview/CandlestickChart";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8">
      <main className="flex w-full max-w-6xl flex-col gap-8">
        <div>
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 mb-2">
            Mood Tracker
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Track how daily activities impact your mood level
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
          <CandlestickChart />
        </div>
      </main>
    </div>
  );
}
