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

// Mock mood logs for multiple days - in a real app, this would come from a backend
// Key format: "YYYY-MM-DD"
const MOCK_MOOD_LOGS_BY_DATE: Record<string, MoodLog[]> = {
    // 2024-01-01 - Good day with exercise and social activities
    "2024-01-01": [
        { time: 1704067066 as UTCTimestamp, activity: "Workout at gym", impact: 10 },
        { time: 1704067067 as UTCTimestamp, activity: "Workout at gym", impact: 10 },
        { time: 1704067068 as UTCTimestamp, activity: "Workout at gym", impact: 10 },
        { time: 1704067069 as UTCTimestamp, activity: "Workout at gym", impact: 10 },
        { time: 1704067076 as UTCTimestamp, activity: "Workout at gym", impact: -10 },
        { time: 1704067077 as UTCTimestamp, activity: "Workout at gym", impact: -10 },
        { time: 1704067088 as UTCTimestamp, activity: "Workout at gym", impact: -10 },
        { time: 1704067099 as UTCTimestamp, activity: "Workout at gym", impact: -10 },
        { time: 1704067100 as UTCTimestamp, activity: "Workout at gym", impact: 10 },
        { time: 1704067200 as UTCTimestamp, activity: "Morning meditation", impact: 5 },
        { time: 1704070800 as UTCTimestamp, activity: "Workout at gym", impact: 10 },
        { time: 1704074400 as UTCTimestamp, activity: "Healthy breakfast", impact: 3 },
        { time: 1704078000 as UTCTimestamp, activity: "Stressful meeting", impact: -8 },
        { time: 1704081600 as UTCTimestamp, activity: "Coffee break with friend", impact: 7 },
        { time: 1704085200 as UTCTimestamp, activity: "Productive work session", impact: 12 },
        { time: 1704088800 as UTCTimestamp, activity: "Lunch outdoors", impact: 6 },
        { time: 1704092400 as UTCTimestamp, activity: "Email overload", impact: -3 },
        { time: 1704096000 as UTCTimestamp, activity: "Short walk", impact: 4 },
        { time: 1704099600 as UTCTimestamp, activity: "Completed project milestone", impact: 8 },
        { time: 1704103200 as UTCTimestamp, activity: "Called parents", impact: 7 },
        { time: 1704106800 as UTCTimestamp, activity: "Evening yoga", impact: 6 },
        { time: 1704110400 as UTCTimestamp, activity: "Cooked healthy dinner", impact: 5 },
        { time: 1704114000 as UTCTimestamp, activity: "Watched favorite show", impact: 4 },
        { time: 1704117600 as UTCTimestamp, activity: "Read before bed", impact: 3 },
    ],

    // 2024-01-02 - Mixed day with ups and downs
    "2024-01-02": [
        { time: 1704153600 as UTCTimestamp, activity: "Good night's sleep", impact: 8 },
        { time: 1704157200 as UTCTimestamp, activity: "Morning run", impact: 12 },
        { time: 1704160800 as UTCTimestamp, activity: "Spilled coffee on shirt", impact: -5 },
        { time: 1704164400 as UTCTimestamp, activity: "Difficult client call", impact: -10 },
        { time: 1704168000 as UTCTimestamp, activity: "Skipped lunch (busy)", impact: -6 },
        { time: 1704171600 as UTCTimestamp, activity: "Argument with colleague", impact: -8 },
        { time: 1704175200 as UTCTimestamp, activity: "Felt overwhelmed", impact: -5 },
        { time: 1704178800 as UTCTimestamp, activity: "Deep breathing exercises", impact: 4 },
        { time: 1704182400 as UTCTimestamp, activity: "Listened to music", impact: 5 },
        { time: 1704186000 as UTCTimestamp, activity: "Friend texted support", impact: 6 },
        { time: 1704189600 as UTCTimestamp, activity: "Organized workspace", impact: 4 },
        { time: 1704193200 as UTCTimestamp, activity: "Light stretching", impact: 3 },
        { time: 1704196800 as UTCTimestamp, activity: "Gratitude journaling", impact: 7 },
        { time: 1704200400 as UTCTimestamp, activity: "Bath and relaxation", impact: 8 },
        { time: 1704204000 as UTCTimestamp, activity: "Early bedtime", impact: 5 },
    ],

    // 2024-01-03 - Challenging day with stress
    "2024-01-03": [
        { time: 1704240000 as UTCTimestamp, activity: "Slept poorly", impact: -6 },
        { time: 1704243600 as UTCTimestamp, activity: "Skipped breakfast", impact: -4 },
        { time: 1704247200 as UTCTimestamp, activity: "Missed workout", impact: -5 },
        { time: 1704250800 as UTCTimestamp, activity: "Bad news from project", impact: -12 },
        { time: 1704254400 as UTCTimestamp, activity: "Deadline pressure", impact: -8 },
        { time: 1704258000 as UTCTimestamp, activity: "Ate junk food", impact: -3 },
        { time: 1704261600 as UTCTimestamp, activity: "Too much caffeine", impact: -4 },
        { time: 1704265200 as UTCTimestamp, activity: "Feeling anxious", impact: -7 },
        { time: 1704268800 as UTCTimestamp, activity: "Social media doom scrolling", impact: -6 },
        { time: 1704272400 as UTCTimestamp, activity: "Isolation", impact: -5 },
        { time: 1704276000 as UTCTimestamp, activity: "Procrastination", impact: -4 },
        { time: 1704279600 as UTCTimestamp, activity: "Negative self-talk", impact: -5 },
        { time: 1704283200 as UTCTimestamp, activity: "Skipped dinner", impact: -3 },
        { time: 1704286800 as UTCTimestamp, activity: "Stayed up too late", impact: -4 },
        { time: 1704290400 as UTCTimestamp, activity: "Insomnia", impact: -6 },
    ],

    // 2024-01-04 - Recovery and self-care
    "2024-01-04": [
        { time: 1704326400 as UTCTimestamp, activity: "Decided to reset", impact: 5 },
        { time: 1704330000 as UTCTimestamp, activity: "Morning affirmations", impact: 6 },
        { time: 1704333600 as UTCTimestamp, activity: "Nutritious breakfast", impact: 4 },
        { time: 1704337200 as UTCTimestamp, activity: "10-minute meditation", impact: 5 },
        { time: 1704340800 as UTCTimestamp, activity: "Organized to-do list", impact: 4 },
        { time: 1704344400 as UTCTimestamp, activity: "Completed small task", impact: 3 },
        { time: 1704348000 as UTCTimestamp, activity: "Drank water regularly", impact: 2 },
        { time: 1704351600 as UTCTimestamp, activity: "Brief walk outside", impact: 5 },
        { time: 1704355200 as UTCTimestamp, activity: "Healthy lunch", impact: 3 },
        { time: 1704358800 as UTCTimestamp, activity: "Set boundaries at work", impact: 6 },
        { time: 1704362400 as UTCTimestamp, activity: "Talked to therapist", impact: 8 },
        { time: 1704366000 as UTCTimestamp, activity: "Gentle yoga", impact: 5 },
        { time: 1704369600 as UTCTimestamp, activity: "Cooked comfort food", impact: 4 },
        { time: 1704373200 as UTCTimestamp, activity: "Video call with family", impact: 7 },
        { time: 1704376800 as UTCTimestamp, activity: "Consistent sleep schedule", impact: 5 },
    ],

    // 2024-01-05 - Great day with momentum
    "2024-01-05": [
        { time: 1704412800 as UTCTimestamp, activity: "Woke up energized", impact: 8 },
        { time: 1704416400 as UTCTimestamp, activity: "Intense workout", impact: 15 },
        { time: 1704420000 as UTCTimestamp, activity: "Power breakfast", impact: 6 },
        { time: 1704423600 as UTCTimestamp, activity: "Flow state at work", impact: 12 },
        { time: 1704427200 as UTCTimestamp, activity: "Received praise", impact: 10 },
        { time: 1704430800 as UTCTimestamp, activity: "Lunch with best friend", impact: 14 },
        { time: 1704434400 as UTCTimestamp, activity: "Creative breakthrough", impact: 13 },
        { time: 1704438000 as UTCTimestamp, activity: "Helped a colleague", impact: 7 },
        { time: 1704441600 as UTCTimestamp, activity: "Completed major goal", impact: 16 },
        { time: 1704445200 as UTCTimestamp, activity: "Practiced gratitude", impact: 8 },
        { time: 1704448800 as UTCTimestamp, activity: "Spent time in nature", impact: 11 },
        { time: 1704452400 as UTCTimestamp, activity: "Engaged in hobby", impact: 9 },
        { time: 1704456000 as UTCTimestamp, activity: "Meaningful conversation", impact: 10 },
        { time: 1704459600 as UTCTimestamp, activity: "Celebrated small wins", impact: 8 },
        { time: 1704463200 as UTCTimestamp, activity: "Peaceful evening routine", impact: 7 },
    ],
};

/**
 * Fetch mood logs for a specific date
 * @param date - The date to fetch mood logs for
 * @returns Promise resolving to an array of mood logs (empty array if no data available)
 */
export async function fetchMoodLogs(date: Date): Promise<MoodLog[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // In a real application, you would make an API call here:
    // const response = await fetch(`/api/mood-logs?date=${date.toISOString()}`);
    // return await response.json();

    // Format the date as "YYYY-MM-DD" to look up in our mock data
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    // Return the data for this date, or empty array if not available
    return MOCK_MOOD_LOGS_BY_DATE[dateKey] || [];
}
