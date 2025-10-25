import { UTCTimestamp } from "lightweight-charts";

export interface CandleData {
    time: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface MoodLog {
    time: UTCTimestamp;
    activity: string;
    impact: number; // Positive or negative impact on mood
}
