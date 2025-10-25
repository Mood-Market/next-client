"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { MoodLog } from "@/utils/api";

interface MoodLogContextType {
  logs: MoodLog[];
  addLog: (log: Omit<MoodLog, "time">) => void;
  deleteLog: (time: number) => void;
  updateLog: (time: number, updates: Partial<Omit<MoodLog, "time">>) => void;
  getLogsByDate: (date: Date) => MoodLog[];
  clearAllLogs: () => void;
}

const MoodLogContext = createContext<MoodLogContextType | undefined>(undefined);

const STORAGE_KEY = "moody_logs";

// Helper function to format date as "YYYY-MM-DD"
const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to get date from UTC timestamp
const getDateFromTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return formatDateKey(date);
};

export function MoodLogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load logs from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedLogs = localStorage.getItem(STORAGE_KEY);
        if (storedLogs) {
          setLogs(JSON.parse(storedLogs));
        }
      } catch (error) {
        console.error("Error loading logs from localStorage:", error);
      } finally {
        setIsInitialized(true);
      }
    }
  }, []);

  // Save logs to localStorage whenever they change
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      } catch (error) {
        console.error("Error saving logs to localStorage:", error);
      }
    }
  }, [logs, isInitialized]);

  const addLog = (log: Omit<MoodLog, "time">) => {
    const newLog: MoodLog = {
      ...log,
      time: Math.floor(Date.now() / 1000) as unknown as MoodLog["time"], // Current UTC timestamp
    };
    setLogs((prevLogs) =>
      [...prevLogs, newLog].sort((a, b) => a.time - b.time)
    );
  };

  const deleteLog = (time: number) => {
    setLogs((prevLogs) => prevLogs.filter((log) => log.time !== time));
  };

  const updateLog = (time: number, updates: Partial<Omit<MoodLog, "time">>) => {
    setLogs((prevLogs) =>
      prevLogs.map((log) => (log.time === time ? { ...log, ...updates } : log))
    );
  };

  const getLogsByDate = (date: Date): MoodLog[] => {
    const dateKey = formatDateKey(date);
    return logs.filter((log) => {
      const logDateKey = getDateFromTimestamp(log.time);
      return logDateKey === dateKey;
    });
  };

  const clearAllLogs = () => {
    setLogs([]);
  };

  return (
    <MoodLogContext.Provider
      value={{
        logs,
        addLog,
        deleteLog,
        updateLog,
        getLogsByDate,
        clearAllLogs,
      }}
    >
      {children}
    </MoodLogContext.Provider>
  );
}

export function useMoodLogs() {
  const context = useContext(MoodLogContext);
  if (context === undefined) {
    throw new Error("useMoodLogs must be used within a MoodLogProvider");
  }
  return context;
}
