import React from "react";

export default function PointsBox({ pointsRemaining }) {
    return (
        <div className="bg-[#222] rounded p-4 text-white text-center mb-4">
            <span className="font-bold text-lg">
                Points Remaining: <span className="text-[#FF8A00]">{pointsRemaining}</span>
            </span>
        </div>
    );
}