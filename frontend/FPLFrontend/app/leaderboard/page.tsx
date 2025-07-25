"use client";
import { useState } from "react";

export default function Page() {
  // Placeholder for top ten players, to be replaced with API data later
  const [topPlayers, setTopPlayers] = useState([
    "Player 1",
    "Player 2",
    "Player 3",
    "Player 4",
    "Player 5",
    "Player 6",
    "Player 7",
    "Player 8",
    "Player 9",
    "Player 10",
  ]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="bg-[#393939] rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl text-center font-bold mb-4">Leaderboard</h2>
        <div className="bg-[#222] rounded p-4">
          <ul>
            {topPlayers.map((player, idx) => (
              <li key={idx} className="text-white py-1 border-b border-gray-700 last:border-b-0">
                {idx + 1}. {player}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}