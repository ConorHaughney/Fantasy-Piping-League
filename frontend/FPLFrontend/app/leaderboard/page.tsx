"use client";
import { useState, useEffect } from "react";

interface LeaderboardEntry {
  id: number;
  username: string;
  teamName: string;
  totalScore: number;
  weeklyScore?: number;
  position: number;
  positionChange?: number; // +1 for up, -1 for down, 0 for no change
}

interface LeaderboardData {
  entries: LeaderboardEntry[];
  lastUpdated: string;
  weekNumber: number;
}

interface CachedLeaderboardData extends LeaderboardData {
  cachedAt: string;
}

export default function Page() {
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  // Cache configuration
  const CACHE_KEY = "leaderboard_data";
  const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

  // Check if cached data is still valid
  const isCacheValid = (cachedData: CachedLeaderboardData): boolean => {
    const now = new Date().getTime();
    const cachedTime = new Date(cachedData.cachedAt).getTime();
    return now - cachedTime < CACHE_DURATION;
  };

  // Get data from cache
  const getFromCache = (): LeaderboardData | null => {
    try {
      if (typeof window === "undefined") return null;

      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const cachedData: CachedLeaderboardData = JSON.parse(cached);

      if (isCacheValid(cachedData)) {
        console.log("Loading leaderboard from cache");
        setIsFromCache(true);
        return {
          entries: cachedData.entries,
          lastUpdated: cachedData.lastUpdated,
          weekNumber: cachedData.weekNumber,
        };
      } else {
        // Cache expired, remove it
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
    } catch (error) {
      console.error("Error reading from cache:", error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  };

  // Save data to cache
  const saveToCache = (data: LeaderboardData): void => {
    try {
      if (typeof window === "undefined") return;

      const cachedData: CachedLeaderboardData = {
        ...data,
        cachedAt: new Date().toISOString(),
      };

      localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
      console.log("Leaderboard data cached");
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
  };

  const fetchLeaderboard = async (forceRefresh: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to load from cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedData = getFromCache();
        if (cachedData) {
          setLeaderboardData(cachedData);
          setIsLoading(false);
          return;
        }
      }

      // Fetch fresh data from API
      console.log("Fetching fresh leaderboard data from API...");
      setIsFromCache(false);

      const response = await fetch("http://localhost:8080/api/leaderboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data: LeaderboardData = await response.json();
        setLeaderboardData(data);
        saveToCache(data); // Cache the fresh data
        console.log("Fresh leaderboard data loaded from API:", data);
      } else {
        throw new Error(`Failed to fetch leaderboard: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load leaderboard"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Clear cache manually
  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
    console.log("Leaderboard cache cleared");
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getPositionChangeIcon = (change?: number) => {
    if (!change || change === 0)
      return <span className="text-gray-400">—</span>;
    if (change > 0) return <span className="text-green-400">↑{change}</span>;
    return <span className="text-red-400">↓{Math.abs(change)}</span>;
  };

  const getPositionClass = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500";
      case 2:
        return "bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-400";
      case 3:
        return "bg-gradient-to-r from-orange-600/20 to-orange-700/20 border-orange-600";
      default:
        return "bg-[#2a2a2a] border-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <div className="bg-[#393939] rounded-lg shadow-lg p-8 max-w-4xl w-full">
          <div className="text-center text-white text-lg">
            {isFromCache ? "Loading cached data..." : "Loading leaderboard..."}
          </div>
        </div>
      </div>
    );
  }

  if (error && !leaderboardData) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <div className="bg-[#393939] rounded-lg shadow-lg p-8 max-w-4xl w-full text-center">
          <div className="text-red-400 text-lg mb-4">
            Error loading leaderboard
          </div>
          <p className="text-gray-300 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => fetchLeaderboard(true)}
              className="bg-[#FF8A00] text-white px-6 py-2 rounded hover:bg-[#E52E71] transition mr-2"
            >
              Try Again
            </button>
            <button
              onClick={clearCache}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
            >
              Clear Cache
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] p-4">
      <div className="bg-[#393939] rounded-lg shadow-lg p-8 max-w-4xl w-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2 text-white">🏆 Leaderboard</h2>
        </div>

        <div className="bg-[#222] rounded-lg p-6">
          {leaderboardData && leaderboardData.entries.length > 0 ? (
            <div className="space-y-3">
              {leaderboardData.entries.map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-lg ${getPositionClass(
                    entry.position
                  )}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`text-2xl font-bold w-8 text-center ${
                          entry.position === 1
                            ? "text-yellow-400"
                            : entry.position === 2
                            ? "text-gray-300"
                            : entry.position === 3
                            ? "text-orange-400"
                            : "text-white"
                        }`}
                      >
                        {entry.position === 1
                          ? "🥇"
                          : entry.position === 2
                          ? "🥈"
                          : entry.position === 3
                          ? "🥉"
                          : entry.position}
                      </div>
                      <div className="text-xs">
                        {getPositionChangeIcon(entry.positionChange)}
                      </div>
                    </div>

                    <div>
                      <div className="text-white font-semibold text-lg">
                        {entry.username}
                      </div>
                      <div className="text-gray-300 text-sm">
                        {entry.teamName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[#FF8A00] font-bold text-xl">
                      {entry.totalScore.toLocaleString()}
                    </div>
                    {entry.weeklyScore !== undefined && (
                      <div className="text-gray-400 text-sm">
                        +{entry.weeklyScore} this week
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <p>No leaderboard data available</p>
              <p className="text-sm mt-2">
                Check back after the first competition results are in!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
