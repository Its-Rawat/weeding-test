import React, { useEffect, useState } from "react";

interface Petal {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: number;
  rotation: string;
  type: "pink" | "yellow" | "white";
  drift: number;
}

const FloatingPetals: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const petalCount = 20;
    const types: ("pink" | "yellow" | "white")[] = [
      "pink",
      "yellow",
      "white",
      "pink",
      "yellow",
      "pink",
      "white",
      "yellow",
      "pink",
      "white",
    ];

    const newPetals = Array.from({ length: petalCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 98}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${9 + Math.random() * 8}s`,
      size: 14 + Math.random() * 16,
      rotation: `${Math.random() * 360}deg`,
      type: types[i % types.length],
      drift: (Math.random() - 0.5) * 80,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      {petals.map((p) => {
        // Color mapping for Pink, Yellow, White wedding theme
        const colorClass =
          p.type === "pink"
            ? "from-[#F472B6]/60 via-[#EC4899]/70 to-[#DB2777]/60 shadow-[0_2px_8px_rgba(236,72,153,0.3)]"
            : p.type === "yellow"
            ? "from-[#FDE047]/70 via-[#F59E0B]/75 to-[#D97706]/70 shadow-[0_2px_8px_rgba(245,158,11,0.3)]"
            : "from-[#FFFFFF]/85 via-[#FFFBEB]/90 to-[#FEF08A]/70 shadow-[0_2px_8px_rgba(255,255,255,0.4)]";

        return (
          <div
            key={p.id}
            className="absolute top-[-40px] will-change-transform"
            style={{
              left: p.left,
              animation: `fallPetal ${p.duration} linear infinite`,
              animationDelay: p.delay,
              transform: `rotate(${p.rotation})`,
            }}
          >
            {/* Organic Asymmetrical Rose/Marigold Petal Shape */}
            <div
              className={`bg-gradient-to-br ${colorClass} rounded-[100%_0%_100%_20%]`}
              style={{
                width: `${p.size}px`,
                height: `${p.size * 1.3}px`,
                animation: "swayPetal 3.5s ease-in-out infinite alternate",
              }}
            />
          </div>
        );
      })}

      <style>{`
        @keyframes fallPetal {
          0% {
            transform: translateY(-8vh) rotate(0deg) scale(0.85);
            opacity: 0;
          }
          10% {
            opacity: 0.85;
          }
          85% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(108vh) rotate(540deg) scale(1.05);
            opacity: 0;
          }
        }

        @keyframes swayPetal {
          0% {
            transform: rotate(-18deg) scaleX(1);
          }
          50% {
            transform: rotate(0deg) scaleX(0.7);
          }
          100% {
            transform: rotate(18deg) scaleX(1);
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingPetals;
