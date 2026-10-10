import React from "react";

interface EtchingCornerProps {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color?: string;
  size?: number;
}

export const EtchingCorner: React.FC<EtchingCornerProps> = ({
  className = "",
  position = "top-left",
  color = "#374454",
  size = 32,
}) => {
  const getTransform = () => {
    switch (position) {
      case "top-right":
        return "scale(-1, 1)";
      case "bottom-left":
        return "scale(1, -1)";
      case "bottom-right":
        return "scale(-1, -1)";
      default:
        return "none";
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-2 left-2";
      case "top-right":
        return "top-2 right-2";
      case "bottom-left":
        return "bottom-2 left-2";
      case "bottom-right":
        return "bottom-2 right-2";
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none absolute z-10 transition-opacity duration-300 ${getPositionClasses()} ${className}`}
      style={{ transform: getTransform() }}
    >
      {/* Antique architectural etching corner ornament */}
      <path
        d="M2 2 H 24 M2 2 V 24"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M6 6 H 18 M6 6 V 18"
        stroke={color}
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
      <path
        d="M2 14 C 6 14, 14 6, 14 2"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      <circle cx="10" cy="10" r="1.5" fill={color} />
      <path
        d="M8 2 C 8 8, 18 12, 24 10 C 18 16, 14 24, 14 28"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        strokeOpacity="0.7"
      />
      <path
        d="M2 8 C 8 8, 12 18, 10 24 C 16 18, 24 14, 28 14"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        strokeOpacity="0.7"
      />
      <circle cx="2" cy="2" r="1.5" fill={color} />
    </svg>
  );
};

export const EtchingFrameCorners: React.FC<{
  color?: string;
  size?: number;
  className?: string;
}> = ({ color = "#374454", size = 28, className = "opacity-40" }) => (
  <>
    <EtchingCorner position="top-left" color={color} size={size} className={className} />
    <EtchingCorner position="top-right" color={color} size={size} className={className} />
    <EtchingCorner position="bottom-left" color={color} size={size} className={className} />
    <EtchingCorner position="bottom-right" color={color} size={size} className={className} />
  </>
);
