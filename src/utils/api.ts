import { UTCTimestamp } from "lightweight-charts";

export interface CandleData {
    time: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
}

// Mock candle data for multiple days - in a real app, this would come from a backend
// Key format: "YYYY-MM-DD"
const MOCK_CANDLE_DATA_BY_DATE: Record<string, CandleData[]> = {
    // 2024-01-01 - Bullish trend
    "2024-01-01": [
        { time: 1704067200 as UTCTimestamp, open: 100, high: 110, low: 95, close: 105 },
        { time: 1704070800 as UTCTimestamp, open: 105, high: 115, low: 100, close: 112 },
        { time: 1704074400 as UTCTimestamp, open: 112, high: 118, low: 108, close: 110 },
        { time: 1704078000 as UTCTimestamp, open: 110, high: 112, low: 102, close: 104 },
        { time: 1704081600 as UTCTimestamp, open: 104, high: 109, low: 98, close: 107 },
        { time: 1704085200 as UTCTimestamp, open: 107, high: 120, low: 105, close: 118 },
        { time: 1704088800 as UTCTimestamp, open: 118, high: 125, low: 115, close: 122 },
        { time: 1704092400 as UTCTimestamp, open: 122, high: 128, low: 119, close: 120 },
        { time: 1704096000 as UTCTimestamp, open: 120, high: 124, low: 112, close: 115 },
        { time: 1704099600 as UTCTimestamp, open: 115, high: 121, low: 113, close: 119 },
        { time: 1704103200 as UTCTimestamp, open: 119, high: 126, low: 117, close: 124 },
        { time: 1704106800 as UTCTimestamp, open: 124, high: 130, low: 122, close: 128 },
        { time: 1704110400 as UTCTimestamp, open: 128, high: 132, low: 125, close: 126 },
        { time: 1704114000 as UTCTimestamp, open: 126, high: 129, low: 120, close: 122 },
        { time: 1704117600 as UTCTimestamp, open: 122, high: 127, low: 118, close: 125 },
    ],

    // 2024-01-02 - Volatile day with reversal
    "2024-01-02": [
        { time: 1704153600 as UTCTimestamp, open: 125, high: 130, low: 123, close: 128 },
        { time: 1704157200 as UTCTimestamp, open: 128, high: 135, low: 126, close: 133 },
        { time: 1704160800 as UTCTimestamp, open: 133, high: 138, low: 131, close: 132 },
        { time: 1704164400 as UTCTimestamp, open: 132, high: 134, low: 125, close: 127 },
        { time: 1704168000 as UTCTimestamp, open: 127, high: 129, low: 120, close: 122 },
        { time: 1704171600 as UTCTimestamp, open: 122, high: 125, low: 118, close: 120 },
        { time: 1704175200 as UTCTimestamp, open: 120, high: 123, low: 115, close: 117 },
        { time: 1704178800 as UTCTimestamp, open: 117, high: 119, low: 112, close: 115 },
        { time: 1704182400 as UTCTimestamp, open: 115, high: 118, low: 110, close: 113 },
        { time: 1704186000 as UTCTimestamp, open: 113, high: 116, low: 108, close: 111 },
        { time: 1704189600 as UTCTimestamp, open: 111, high: 115, low: 109, close: 114 },
        { time: 1704193200 as UTCTimestamp, open: 114, high: 118, low: 113, close: 116 },
        { time: 1704196800 as UTCTimestamp, open: 116, high: 120, low: 115, close: 118 },
        { time: 1704200400 as UTCTimestamp, open: 118, high: 122, low: 117, close: 121 },
        { time: 1704204000 as UTCTimestamp, open: 121, high: 125, low: 120, close: 123 },
    ],

    // 2024-01-03 - Bearish trend
    "2024-01-03": [
        { time: 1704240000 as UTCTimestamp, open: 123, high: 125, low: 118, close: 120 },
        { time: 1704243600 as UTCTimestamp, open: 120, high: 122, low: 115, close: 116 },
        { time: 1704247200 as UTCTimestamp, open: 116, high: 118, low: 110, close: 112 },
        { time: 1704250800 as UTCTimestamp, open: 112, high: 114, low: 106, close: 108 },
        { time: 1704254400 as UTCTimestamp, open: 108, high: 110, low: 102, close: 105 },
        { time: 1704258000 as UTCTimestamp, open: 105, high: 107, low: 98, close: 100 },
        { time: 1704261600 as UTCTimestamp, open: 100, high: 103, low: 95, close: 97 },
        { time: 1704265200 as UTCTimestamp, open: 97, high: 100, low: 92, close: 95 },
        { time: 1704268800 as UTCTimestamp, open: 95, high: 98, low: 90, close: 93 },
        { time: 1704272400 as UTCTimestamp, open: 93, high: 96, low: 88, close: 91 },
        { time: 1704276000 as UTCTimestamp, open: 91, high: 94, low: 87, close: 90 },
        { time: 1704279600 as UTCTimestamp, open: 90, high: 93, low: 86, close: 89 },
        { time: 1704283200 as UTCTimestamp, open: 89, high: 92, low: 85, close: 88 },
        { time: 1704286800 as UTCTimestamp, open: 88, high: 91, low: 84, close: 87 },
        { time: 1704290400 as UTCTimestamp, open: 87, high: 90, low: 83, close: 85 },
    ],

    // 2024-01-04 - Recovery and consolidation
    "2024-01-04": [
        { time: 1704326400 as UTCTimestamp, open: 85, high: 90, low: 83, close: 88 },
        { time: 1704330000 as UTCTimestamp, open: 88, high: 93, low: 86, close: 91 },
        { time: 1704333600 as UTCTimestamp, open: 91, high: 95, low: 89, close: 93 },
        { time: 1704337200 as UTCTimestamp, open: 93, high: 96, low: 91, close: 94 },
        { time: 1704340800 as UTCTimestamp, open: 94, high: 97, low: 92, close: 95 },
        { time: 1704344400 as UTCTimestamp, open: 95, high: 98, low: 93, close: 96 },
        { time: 1704348000 as UTCTimestamp, open: 96, high: 99, low: 94, close: 97 },
        { time: 1704351600 as UTCTimestamp, open: 97, high: 100, low: 95, close: 98 },
        { time: 1704355200 as UTCTimestamp, open: 98, high: 101, low: 96, close: 99 },
        { time: 1704358800 as UTCTimestamp, open: 99, high: 102, low: 97, close: 100 },
        { time: 1704362400 as UTCTimestamp, open: 100, high: 103, low: 98, close: 101 },
        { time: 1704366000 as UTCTimestamp, open: 101, high: 104, low: 99, close: 102 },
        { time: 1704369600 as UTCTimestamp, open: 102, high: 105, low: 100, close: 103 },
        { time: 1704373200 as UTCTimestamp, open: 103, high: 106, low: 101, close: 104 },
        { time: 1704376800 as UTCTimestamp, open: 104, high: 107, low: 102, close: 105 },
    ],

    // 2024-01-05 - Strong bullish momentum
    "2024-01-05": [
        { time: 1704412800 as UTCTimestamp, open: 105, high: 112, low: 103, close: 110 },
        { time: 1704416400 as UTCTimestamp, open: 110, high: 118, low: 108, close: 115 },
        { time: 1704420000 as UTCTimestamp, open: 115, high: 122, low: 113, close: 120 },
        { time: 1704423600 as UTCTimestamp, open: 120, high: 127, low: 118, close: 125 },
        { time: 1704427200 as UTCTimestamp, open: 125, high: 132, low: 123, close: 130 },
        { time: 1704430800 as UTCTimestamp, open: 130, high: 137, low: 128, close: 135 },
        { time: 1704434400 as UTCTimestamp, open: 135, high: 142, low: 133, close: 140 },
        { time: 1704438000 as UTCTimestamp, open: 140, high: 145, low: 138, close: 143 },
        { time: 1704441600 as UTCTimestamp, open: 143, high: 148, low: 141, close: 146 },
        { time: 1704445200 as UTCTimestamp, open: 146, high: 150, low: 144, close: 148 },
        { time: 1704448800 as UTCTimestamp, open: 148, high: 152, low: 146, close: 150 },
        { time: 1704452400 as UTCTimestamp, open: 150, high: 154, low: 148, close: 152 },
        { time: 1704456000 as UTCTimestamp, open: 152, high: 156, low: 150, close: 154 },
        { time: 1704459600 as UTCTimestamp, open: 154, high: 158, low: 152, close: 156 },
        { time: 1704463200 as UTCTimestamp, open: 156, high: 160, low: 154, close: 158 },
    ],
};

/**
 * Fetch candle data for a specific date
 * @param date - The date to fetch candle data for
 * @returns Promise resolving to an array of candle data (empty array if no data available)
 */
export async function fetchCandleData(date: Date): Promise<CandleData[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // In a real application, you would make an API call here:
    // const response = await fetch(`/api/candles?date=${date.toISOString()}`);
    // return await response.json();

    // Format the date as "YYYY-MM-DD" to look up in our mock data
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    // Return the data for this date, or empty array if not available
    return MOCK_CANDLE_DATA_BY_DATE[dateKey] || [];
}
