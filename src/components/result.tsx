"use client";

import React, { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";


interface WarriorArenaProps {
    guestId: string | undefined;
  }

const ResultPopup: React.FC<WarriorArenaProps> = ({ guestId }) => {
  const { gameResult } = useGame(); // Assuming `gameResult` is part of the context
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (gameResult) {
      console.log("game Finished");
      setShowResult(true);

      // Auto-hide the popup after 5 seconds
      const timeout = setTimeout(() => {
        setShowResult(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [gameResult]);

  if (!showResult || !gameResult) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
      <div className="text-center p-6 bg-teal-500 rounded-lg shadow-lg animate-bounce">
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          {gameResult == guestId ? "🎉 You Won! 🎉" : "💔 You Lost 💔"}
        </h1>
      </div>
    </div>
  );
};

export default ResultPopup;
