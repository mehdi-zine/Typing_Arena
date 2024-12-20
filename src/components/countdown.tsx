'use client'
import React, { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext"; // Import your existing GameContext

const CountdownPopup: React.FC = () => {
  const { isCountdownActive, initCountdown } = useGame();
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (isCountdownActive) {
      setCountdown(5);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev !== null && prev > 1) {
            return prev - 1;
          }
          clearInterval(interval);
          setCountdown(null);
           // Reset countdown state in GameContext
          return null;
        });
      }, 1000);

      return () => {
        clearInterval(interval);
        initCountdown(false);
    }

    }
  }, [isCountdownActive]);

  if (!isCountdownActive || countdown === null) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
      <div className="text-6xl font-bold text-teal-400 animate-pulse">
        {countdown > 0 ? countdown : "Go!"}
      </div>
    </div>
  );
};

export default CountdownPopup;
