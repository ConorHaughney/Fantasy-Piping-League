import React from "react";
import "./shield.css";

const getShieldClass = (band, assigned) => {
    if (!band) return "shield";
    const name = band.bands.toLowerCase();
    let custom = "";

    switch (true) {
        case name.includes("inveraray"):
            custom = "shield-idpb";
            break;
        case name.includes("field marshal"):
            custom = "shield-fmm";
            break;
        case name.includes("shotts"):
            custom = "shield-shotts";
            break;
        case name.includes("police scotland fife"):
            custom = "shield-psf";
            break;
        case name.includes("st laurence"):
            custom = "shield-slot";
            break;
        case name.includes("boghall"):
            custom = "shield-boghall";
            break;
        case name.includes("power"):
            custom = "shield-power";
            break;
        case name.includes("ravara"):
            custom = "shield-ravara";
            break;
        case name.includes("closkelt"):
            custom = "shield-closkelt";
            break;
        case name.includes("johnstone"):
            custom = "shield-johnstone";
            break;
        case name.includes("78th fraser"):
            custom = "shield-78fh";
            break;
        case name.includes("thomas alumni"):
            custom = "shield-thomas";
            break;
        case name.includes("simon fraser"):
            custom = "shield-sfu";
            break;
        case name.includes("manawatu"):
            custom = "shield-manawatu";
            break;
        default:
            custom = "";
    }
    return `shield${assigned ? " assigned" : ""} ${custom}`;
};

// Helper: assign a custom logo style for each band
const getLogoStyle = (band) => {
    if (!band) return { width: "90%", height: "90%", objectFit: "contain", transform: "translateY(-5px)" };
    const name = band.bands.toLowerCase();

    switch (true) {
        case name.includes("inveraray"):
            return { width: "80%", height: "80%", objectFit: "contain", transform: "translateY(-10px)" };
        case name.includes("field marshal"):
            return { width: "85%", height: "85%", objectFit: "contain", transform: "translateY(-8px)" };
        case name.includes("shotts"):
            return { width: "88%", height: "88%", objectFit: "contain", transform: "translateY(-7px)" };
        case name.includes("police scotland fife"):
            return { width: "75%", height: "75%", objectFit: "contain", transform: "translateY(-6px)" };
        case name.includes("st laurence"):
            return { width: "80%", height: "80%", objectFit: "contain", transform: "translateY(-8px)" };
        case name.includes("boghall"):
            return { width: "85%", height: "85%", objectFit: "contain", transform: "translateY(-9px)" };
        case name.includes("power"):
            return { width: "80%", height: "80%", objectFit: "contain", transform: "translateY(-7px)" };
        case name.includes("ravara"):
            return { width: "90%", height: "90%", objectFit: "contain", transform: "translateY(-5px)" };
        case name.includes("closkelt"):
            return { width: "85%", height: "85%", objectFit: "contain", transform: "translateY(-6px)" };
        case name.includes("johnstone"):
            return { width: "80%", height: "80%", objectFit: "contain", transform: "translateY(-10px)" };
        case name.includes("78th fraser"):
            return { width: "85%", height: "85%", objectFit: "contain", transform: "translateY(-8px)" };
        case name.includes("thomas alumni"):
            return { width: "80%", height: "80%", objectFit: "contain", transform: "translateY(-7px)" };
        case name.includes("simon fraser"):
            return { width: "85%", height: "85%", objectFit: "contain", transform: "translateY(-9px)" };
        case name.includes("manawatu"):
            return { width: "80%", height: "80%", objectFit: "contain", transform: "translateY(-8px)" };
        default:
            return { width: "90%", height: "90%", objectFit: "contain", transform: "translateY(-5px)" };
    }
};

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
                className={getShieldClass(fantasyTeam?.piping1Band, hasAssignedBand("Piping 1"))}
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
                    fantasyTeam.piping1Band.logoUrl ? (
                        <img
                            src={fantasyTeam.piping1Band.logoUrl}
                            alt={fantasyTeam.piping1Band.bands}
                            style={getLogoStyle(fantasyTeam.piping1Band)}
                        />
                    ) : (
                        <div className="band-name">{getBandName(fantasyTeam.piping1Band)}</div>
                    )
                ) : (
                    <div className="plus"></div>
                )}
            </div>

            {/* Piping Judge 2 Shield */}
            <div
                className={getShieldClass(fantasyTeam?.piping2Band, hasAssignedBand("Piping 2"))}
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
                    fantasyTeam.piping2Band.logoUrl ? (
                        <img
                            src={fantasyTeam.piping2Band.logoUrl}
                            alt={fantasyTeam.piping2Band.bands}
                            style={getLogoStyle(fantasyTeam.piping2Band)}
                        />
                    ) : (
                        <div className="band-name">{getBandName(fantasyTeam.piping2Band)}</div>
                    )
                ) : (
                    <div className="plus"></div>
                )}
            </div>

            {/* Drumming Judge Shield */}
            <div
                className={getShieldClass(fantasyTeam?.drummingBand, hasAssignedBand("Drumming"))}
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
                    fantasyTeam.drummingBand.logoUrl ? (
                        <img
                            src={fantasyTeam.drummingBand.logoUrl}
                            alt={fantasyTeam.drummingBand.bands}
                            style={getLogoStyle(fantasyTeam.drummingBand)}
                        />
                    ) : (
                        <div className="band-name">{getBandName(fantasyTeam.drummingBand)}</div>
                    )
                ) : (
                    <div className="plus"></div>
                )}
            </div>

            {/* Ensemble Judge Shield */}
            <div
                className={getShieldClass(fantasyTeam?.ensembleBand, hasAssignedBand("Ensemble"))}
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
                    fantasyTeam.ensembleBand.logoUrl ? (
                        <img
                            src={fantasyTeam.ensembleBand.logoUrl}
                            alt={fantasyTeam.ensembleBand.bands}
                            style={getLogoStyle(fantasyTeam.ensembleBand)}
                        />
                    ) : (
                        <div className="band-name">{getBandName(fantasyTeam.ensembleBand)}</div>
                    )
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