// src/app/context/GameContext.tsx
'use client'
import React, { createContext, useContext, useState } from "react";

interface GameState {
  player1Health: number;
  player2Health: number;
  lastHitPlayer: number | null;
  triggerAction: (playerId: number, damage: number) => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [player1Health, setPlayer1Health] = useState(100);
  const [player2Health, setPlayer2Health] = useState(100);
  const [lastHitPlayer, setLastHitPlayer] = useState<number | null>(null);

  const triggerAction = (playerId: number, damage: number) => {
    if (playerId === 1) {
      setPlayer2Health((prev) => Math.max(0, prev - damage));
      setLastHitPlayer(1);
      setTimeout(() => {
        setLastHitPlayer(null); // Reset to null after animation duration
      }, 200); // Reset after 500ms
    } else if (playerId === 2) {
      setPlayer1Health((prev) => Math.max(0, prev - damage));
      setLastHitPlayer(2);
      setLastHitPlayer(null);
      setTimeout(() => {
        setLastHitPlayer(null); // Reset to null after animation duration
      }, 200);
    }
  };

  return (
    <GameContext.Provider
      value={{ player1Health, player2Health, lastHitPlayer, triggerAction }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
