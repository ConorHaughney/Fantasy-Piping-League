"use client";

import BandPark from "../components/bandpark";
import AddBand from "../components/addBand";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define the interfaces
interface Band {
  id: number;
  bands: string;
  grade?: number;
  pointsCost?: number;
}

interface FantasyTeam {
  id: number;
  teamName: string;
  piping1Band?: Band;
  piping2Band?: Band;
  drummingBand?: Band;
  ensembleBand?: Band;
  createdAt?: string;
  updatedAt?: string;
}

export default function Page() {
  const [selectedShield, setSelectedShield] = useState<string | null>(null);
  const [fantasyTeam, setFantasyTeam] = useState<FantasyTeam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      setIsAuthenticated(true);
    };

    checkAuth();
  }, []);

  const fetchMyTeam = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const response = await fetch(
        "http://localhost:8080/api/fantasy-teams/my-team",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        // Token is invalid or expired
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setFantasyTeam(data);
        console.log("Fetched team:", data);
      } else {
        console.error("Failed to fetch team");
        setFantasyTeam(null);
      }
    } catch (error) {
      console.error("Error fetching team:", error);
      setFantasyTeam(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyTeam();
    }
  }, [isAuthenticated]);

  const handleShieldClick = (shieldType: string) => {
    setSelectedShield(shieldType);
  };

  const handleClosePanel = () => {
    setSelectedShield(null);
  };

  const handleBandAdded = () => {
    // Refresh team data when a band is added
    fetchMyTeam();
    setSelectedShield(null); // Close the panel
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  // Show login prompt if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <div className="bg-[#393939] rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Login Required
          </h2>
          <div className="mb-6">
            <p className="text-white mb-4">
              You need to be logged in to view your fantasy team.
            </p>
            <p className="text-gray-300 text-sm">
              Create your account to start building your fantasy piping team!
            </p>
          </div>
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full bg-[#FF8A00] text-white font-bold py-3 px-6 rounded hover:bg-[#E52E71] transition"
            >
              Login
            </button>
            <button
              onClick={handleSignUp}
              className="w-full bg-gray-600 text-white font-bold py-3 px-6 rounded hover:bg-gray-500 transition"
            >
              Sign Up
            </button>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-600">
            <p className="text-gray-400 text-xs">
              Fantasy Piping League - Build your dream pipe band team
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading spinner while checking authentication
  if (isAuthenticated === null || (isAuthenticated && isLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <div className="bg-[#393939] rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-white text-lg">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // Main authenticated content
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] pt-1">
      {selectedShield && (
        <div className="bg-[#393939] rounded-lg shadow-lg p-8 max-w-md w-full mr-4 relative">
          <button
            onClick={handleClosePanel}
            className="absolute top-2 right-2 text-white hover:text-red-500 transition-colors duration-300 text-xl font-bold w-8 h-8 rounded-full hover:bg-red-500/20 flex items-center justify-center leading-none"
          >
            &times;
          </button>

          <h2 className="text-2xl text-center font-bold mb-4 text-white">
            {selectedShield}
          </h2>
          <div className="bg-[#222] rounded p-4 text-white text-center">
            <AddBand judgeType={selectedShield} onBandAdded={handleBandAdded} />
          </div>
        </div>
      )}

      <div className="bg-[#393939] rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl text-center font-bold mb-4 text-white">
          My Band
        </h2>
        <div className="flex flex-col space-y-4">
          <div className="bg-[#222] rounded p-4 text-white text-center">
            <BandPark
              onShieldClick={handleShieldClick}
              fantasyTeam={fantasyTeam}
              isLoading={false}
            />
          </div>

          {fantasyTeam && (
            <div className="bg-[#222] rounded p-4 text-white">
              <h3 className="text-lg font-semibold mb-2 text-center">
                Team: {fantasyTeam.teamName}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Piping 1:</span>
                  <span className="text-[#FF8A00]">
                    {fantasyTeam.piping1Band?.bands || "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Piping 2:</span>
                  <span className="text-[#FF8A00]">
                    {fantasyTeam.piping2Band?.bands || "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Drumming:</span>
                  <span className="text-[#FF8A00]">
                    {fantasyTeam.drummingBand?.bands || "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Ensemble:</span>
                  <span className="text-[#FF8A00]">
                    {fantasyTeam.ensembleBand?.bands || "Not selected"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {!fantasyTeam && (
            <div className="bg-[#222] rounded p-4 text-white text-center">
              <p className="mb-2">No fantasy team found.</p>
              <p className="text-sm text-gray-400">Create your team by selecting bands above!</p>
            </div>
          )}

          <a
            href="/how-to-play"
            className="bg-[#FF8A00] text-white font-bold py-2 px-6 rounded hover:bg-[#E52E71] transition w-40 text-center mx-auto block"
          >
            How to Play
          </a>
        </div>
      </div>
    </div>
  );
}