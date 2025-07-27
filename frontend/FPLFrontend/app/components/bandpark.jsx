import React from "react";
import "./shield.css";

const BandPark = () => {
    const circleSize = 140;

    const secondCircleSize = circleSize - 10;
    const thirdCircleSize = circleSize - 45;
    const fourthCircleSize = circleSize - 55;

    return (
        <div className="bg-green-500 h-100 rounded-lg shadow-md flex flex-col items-center justify-center relative">
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

            <div
                // Piping Judge 1
                className="shield"
                style={{
                    position: "absolute",
                    top: "25%",
                    left: "70%",
                    transform: "translate(-50%, -50%)",
                    width: "80px",
                    height: "80px",
                }}
            >
                <div className="plus" ></div>
            </div>

            <div
                // Piping Judge 2
                className="shield"
                style={{
                    position: "absolute",
                    top: "30%",
                    left: "31%",
                    transform: "translate(-50%, -50%)",
                    width: "80px",
                    height: "80px",
                }}
            >
                <div className="plus" ></div>
            </div>

            <div
                // Drumming Judge
                className="shield"
                style={{
                    position: "absolute",
                    bottom: "25%",
                    left: "55%",
                    transform: "translate(-50%, -50%)",
                    width: "80px",
                    height: "80px",
                }}
            >
                <div className="plus" ></div>
            </div>

            <div
                // Ensamble Judge
                className="shield"
                style={{
                    position: "absolute",
                    bottom: "5%",
                    left: "33%",
                    transform: "translate(-50%, -50%)",
                    width: "80px",
                    height: "80px",
                }}
            >
                <div className="plus" ></div>
            </div>

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
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BandPark;