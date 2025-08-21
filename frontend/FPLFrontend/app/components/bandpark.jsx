import React from "react";
import "./shield.css";

const BandPark = ({ onShieldClick, fantasyTeam, isLoading }) => {
    const circleSize = 140;
    const secondCircleSize = circleSize - 10;
    const thirdCircleSize = circleSize - 45;
    const fourthCircleSize = circleSize - 55;

    // Helper function to get band name for display
    const getBandName = (band) => {
        if (!band) return null;
        return band.bands.length > 12 ? `${band.bands.substring(0, 12)}...` : band.bands;
    };

    // Helper function to check if a shield has a band assigned
    const hasAssignedBand = (judgeType) => {
        if (!fantasyTeam) return false;
        switch (judgeType) {
            case "Piping 1":
                return !!fantasyTeam.piping1Band;
            case "Piping 2":
                return !!fantasyTeam.piping2Band;
            case "Drumming":
                return !!fantasyTeam.drummingBand;
            case "Ensemble":
                return !!fantasyTeam.ensembleBand;
            default:
                return false;
        }
    };

    return (
        <div className="bg-green-500 h-100 rounded-lg shadow-md flex flex-col items-center justify-center relative">
            {/* Field lines */}
            <div
                style={{
                    width: "70%",
                    height: "8px",
                    position: "absolute",
                    top: "35px",
                    left: "50%",
                    transform: "translateX(-50%)"
                }}
                className="bg-gray-200 rounded"
            />
            <div
                style={{
                    width: "8px",
                    height: "72%",
                    position: "absolute",
                    top: "45%",
                    left: "15%",
                    transform: "translateY(-50%)"
                }}
                className="bg-gray-200 rounded"
            />
            <div
                style={{
                    width: "8px",
                    height: "72%",
                    position: "absolute",
                    top: "45%",
                    right: "15%",
                    transform: "translateY(-50%)",
                }}
                className="bg-gray-200 rounded"
            />

            {/* Piping Judge 1 Shield */}
            <div
                className={`shield ${hasAssignedBand("Piping 1") ? "assigned" : ""}`}
                style={{
                    position: "absolute",
                    top: "25%",
                    left: "70%",
                    transform: "translate(-50%, -50%)",
                    width: "80px",
                    height: "80px",
                    cursor: "pointer"
                }}
                onClick={() => onShieldClick("Piping 1")}
                title={fantasyTeam?.piping1Band ? `Assigned: ${fantasyTeam.piping1Band.bands}` : "Click to assign a band"}
            >
                {hasAssignedBand("Piping 1") ? (
                    <div className="band-name">{getBandName(fantasyTeam.piping1Band)}</div>
                ) : (
                    <div className="plus"></div>
                )}
            </div>

            {/* Piping Judge 2 Shield */}
            <div
                className={`shield ${hasAssignedBand("Piping 2") ? "assigned" : ""}`}
                style={{
                    position: "absolute",
                    top: "30%",
                    left: "31%",
                    transform: "translate(-50%, -50%)",
                    width: "80px",
                    height: "80px",
                    cursor: "pointer"
                }}
                onClick={() => onShieldClick("Piping 2")}
                title={fantasyTeam?.piping2Band ? `Assigned: ${fantasyTeam.piping2Band.bands}` : "Click to assign a band"}
            >
                {hasAssignedBand("Piping 2") ? (
                    <div className="band-name">{getBandName(fantasyTeam.piping2Band)}</div>
                ) : (
                    <div className="plus"></div>
                )}
            </div>

            {/* Drumming Judge Shield */}
            <div
                className={`shield ${hasAssignedBand("Drumming") ? "assigned" : ""}`}
                style={{
                    position: "absolute",
                    bottom: "25%",
                    left: "55%",
                    transform: "translate(-50%, -50%)",
                    width: "80px",
                    height: "80px",
                    cursor: "pointer"
                }}
                onClick={() => onShieldClick("Drumming")}
                title={fantasyTeam?.drummingBand ? `Assigned: ${fantasyTeam.drummingBand.bands}` : "Click to assign a band"}
            >
                {hasAssignedBand("Drumming") ? (
                    <div className="band-name">{getBandName(fantasyTeam.drummingBand)}</div>
                ) : (
                    <div className="plus"></div>
                )}
            </div>

            {/* Ensemble Judge Shield */}
            <div
                className={`shield ${hasAssignedBand("Ensemble") ? "assigned" : ""}`}
                style={{
                    position: "absolute",
                    bottom: "5%",
                    left: "33%",
                    transform: "translate(-50%, -50%)",
                    width: "80px",
                    height: "80px",
                    cursor: "pointer"
                }}
                onClick={() => onShieldClick("Ensemble")}
                title={fantasyTeam?.ensembleBand ? `Assigned: ${fantasyTeam.ensembleBand.bands}` : "Click to assign a band"}
            >
                {hasAssignedBand("Ensemble") ? (
                    <div className="band-name">{getBandName(fantasyTeam.ensembleBand)}</div>
                ) : (
                    <div className="plus"></div>
                )}
            </div>

            {/* Center circle */}
            <div
                style={{ width: `${circleSize}px`, height: `${circleSize}px`, marginTop: "-100px" }}
                className="bg-white rounded-full flex items-center justify-center"
            >
                <div
                    style={{ width: `${secondCircleSize}px`, height: `${secondCircleSize}px` }}
                    className="bg-green-500 rounded-full flex items-center justify-center"
                >
                    <div
                        style={{ width: `${thirdCircleSize}px`, height: `${thirdCircleSize}px` }}
                        className="bg-white rounded-full flex items-center justify-center"
                    >
                        <div
                            style={{ width: `${fourthCircleSize}px`, height: `${fourthCircleSize}px` }}
                            className="bg-green-500 rounded-full flex items-center justify-center"
                        >
                            {isLoading && (
                                <div className="text-xs text-white animate-pulse">Loading...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BandPark;