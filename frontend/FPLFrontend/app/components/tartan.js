import React from "react";

// Static tartan by Paulina Hetman changed under MIT License
// https://css-tricks.com/how-we-created-a-static-site-that-generates-tartan-patterns-in-svg/

const tartan = [
  { fill: "#888DA7", size: 40 },
  { fill: "#0a2472", size: 10 },
  { fill: "#FFFFFF", size: 10 },
  { fill: "#0a2472", size: 70 },
  { fill: "#ffb4a2", size: 20 },
  { fill: "#0a2472", size: 70 },
  { fill: "#FFFFFF", size: 10 },
  { fill: "#0a2472", size: 10 },
  { fill: "#888DA7", size: 40 },
];

const SvgDefs = () => (
  <defs>
    <pattern
      id="diagonalStripes"
      x="0"
      y="0"
      width="8"
      height="8"
      patternUnits="userSpaceOnUse"
    >
      <polygon points="0,4 0,8 8,0 4,0" fill="#ffffff" />
      <polygon points="4,8 8,8 8,4" fill="#ffffff" />
    </pattern>
    <mask id="grating" x="0" y="0" width="1" height="1">
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="url(#diagonalStripes)"
      />
    </mask>
  </defs>
);

const SvgTile = ({ tartan }) => {
  const cumulativeSizes = tartan
    .map(el => el.size)
    .reduce(function (r, a) {
      if (r.length > 0) a += r[r.length - 1];
      r.push(a);
      return r;
    }, []);

  const size = cumulativeSizes[cumulativeSizes.length - 1];
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      x="0"
      y="0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <SvgDefs />
      <g id="horizStripes">
        {tartan.map((el, index) => (
          <rect
            key={`h-${index}`}
            fill={el.fill}
            height={el.size}
            width="100%"
            x="0"
            y={cumulativeSizes[index - 1] || 0}
          />
        ))}
      </g>
      <g id="vertStripes" mask="url(#grating)">
        {tartan.map((el, index) => (
          <rect
            key={`v-${index}`}
            fill={el.fill}
            height="100%"
            width={el.size}
            x={cumulativeSizes[index - 1] || 0}
            y="0"
          />
        ))}
      </g>
    </svg>
  );
};
const TartanBg = ({ tartan }) => {
  const cumulativeSizes = tartan
    .map(el => el.size)
    .reduce(function (r, a) {
      if (r.length > 0) a += r[r.length - 1];
      r.push(a);
      return r;
    }, []);
  const size = cumulativeSizes[cumulativeSizes.length - 1];

  const svgString =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
    `<defs>` +
    `<pattern id="diagonalStripes" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">` +
    `<polygon points="0,4 0,8 8,0 4,0" fill="#ffffff" />` +
    `<polygon points="4,8 8,8 8,4" fill="#ffffff" />` +
    `</pattern>` +
    `<mask id="grating" x="0" y="0" width="1" height="1">` +
    `<rect x="0" y="0" width="100%" height="100%" fill="url(#diagonalStripes)" />` +
    `</mask>` +
    `</defs>` +
    `<g id="horizStripes">` +
    tartan
      .map(
        (el, index) =>
          `<rect fill="${el.fill}" height="${el.size}" width="100%" x="0" y="${
            cumulativeSizes[index - 1] || 0
          }"/>`
      )
      .join("") +
    `</g>` +
    `<g id="vertStripes" mask="url(#grating)">` +
    tartan
      .map(
        (el, index) =>
          `<rect fill="${el.fill}" height="100%" width="${el.size}" x="${
            cumulativeSizes[index - 1] || 0
          }" y="0"/>`
      )
      .join("") +
    `</g>` +
    `</svg>`;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(svgString)}')`,
        backgroundRepeat: "repeat",
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
};

export { tartan, SvgTile, TartanBg };