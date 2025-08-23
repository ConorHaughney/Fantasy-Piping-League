import React, { useState } from "react";
import { searchBands } from "./bandDataManager";

const AddBand = ({ judgeType, onBandAdded, pointsRemaining}) => {
    const [bandName, setBandName] = useState("");
    const [selectedBand, setSelectedBand] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Map frontend judge types to backend expected values
    const mapJudgeTypeToBackend = (frontendJudgeType) => {
        switch (frontendJudgeType) {
            case "Piping 1":
                return "piping1";
            case "Piping 2":
                return "piping2";
            case "Drumming":
                return "drumming";
            case "Ensemble":
                return "ensemble";
            default:
                return frontendJudgeType.toLowerCase();
        }
    };

    const handleSearch = (searchTerm) => {
        setBandName(searchTerm);

        if (searchTerm.length > 1) {
            const results = searchBands(searchTerm);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectBand = (band) => {
        setSelectedBand(band);
        setBandName("");
        setSearchResults([]);
    };

    const handleAddBand = async () => {
        if (selectedBand) {

            if (
                typeof selectedBand.pointsCost === "number" &&
                pointsRemaining - selectedBand.pointsCost < 0
            ) {
                alert(
                    `You do not have enough points to add ${selectedBand.bands}.`
                );
                return;
            }

            setIsLoading(true);
            try {
                const token = localStorage.getItem("token");

                // Map the judge type to backend format
                const backendJudgeType = mapJudgeTypeToBackend(judgeType);

                console.log('Sending request:', {
                    bandId: selectedBand.id,
                    judgeType: backendJudgeType, // Use mapped value
                    originalJudgeType: judgeType,
                    token: token ? 'Token exists' : 'No token'
                });

                const response = await fetch('http://localhost:8080/api/fantasy-teams/add-band', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        bandId: selectedBand.id,
                        judgeType: backendJudgeType // Use mapped value
                    }),
                });

                console.log('Response status:', response.status);

                if (!response.ok) {
                    let errorMessage = `HTTP error! status: ${response.status}`;
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.error || errorData.message || errorMessage;
                    } catch (parseError) {
                        const errorText = await response.text();
                        errorMessage = errorText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                const result = await response.json();
                console.log('Success result:', result);

                // Success message
                alert(`${selectedBand.bands} set as your ${judgeType} choice!`);

                // Reset form
                setBandName("");
                setSelectedBand(null);

                // Notify parent component if callback provided
                if (onBandAdded) {
                    onBandAdded();
                }

            } catch (error) {
                console.error('Error adding band:', error);
                alert(`Failed to add band: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-white">
                Add Band for {judgeType}
            </h3>

            <div className="relative mb-4">
                <input
                    type="text"
                    value={bandName}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search for a band..."
                    className="w-full px-4 py-2 rounded-lg bg-[#393939] text-white border border-gray-600 focus:border-[#FF8A00] focus:outline-none"
                    disabled={isLoading}
                />

                {searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-[#393939] border border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {searchResults.map((band) => (
                            <div
                                key={band.id}
                                onClick={() => handleSelectBand(band)}
                                className="px-4 py-2 hover:bg-[#555] cursor-pointer border-b border-gray-600 last:border-b-0"
                            >
                                <div className="text-white font-medium">{band.bands}</div>
                                <div className="text-gray-400 text-sm">Grade {band.grade || 'not specified'}</div>
                            </div>
                        ))}
                    </div>
                )}

                {searchResults.length === 0 && bandName.length > 1 && (
                    <div className="absolute z-10 w-full mt-1 bg-[#393939] border border-gray-600 rounded-lg shadow-lg p-4 text-center text-gray-400">
                        No bands found
                    </div>
                )}
            </div>

            {selectedBand && (
                <div className="mb-4 p-3 bg-[#555] rounded-lg">
                    <div className="text-white font-medium">Selected:</div>
                    <div className="text-[#FF8A00]">{selectedBand.bands}</div>
                    <div className="text-gray-400 text-sm">Grade {selectedBand.grade || 'not specified'}</div>
                </div>
            )}

            <div className="flex gap-2">
                <button
                    onClick={handleAddBand}
                    disabled={!selectedBand || isLoading}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${selectedBand && !isLoading
                        ? "bg-[#FF8A00] hover:bg-[#E52E71] text-white"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                        }`}
                >
                    {isLoading ? "Adding..." : "Add Band"}
                </button>

                <button
                    onClick={() => {
                        setBandName("");
                        setSelectedBand(null);
                        setSearchResults([]);
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition"
                    disabled={isLoading}
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default AddBand;