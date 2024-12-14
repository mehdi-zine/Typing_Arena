'use client'
import React, { createContext, useContext, useState } from "react";

interface GameState {
  player1Health: number;
  player2Health: number;
  lastHitPlayer: string | null;
  triggerAction: (playerId: string, damage: number) => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [player1Health, setPlayer1Health] = useState(100);
  const [player2Health, setPlayer2Health] = useState(100);
  const [lastHitPlayer, setLastHitPlayer] = useState<string | null>(null); // Changed to string

  const triggerAction = (playerId: string, damage: number) => {
    if (playerId === "1") { // Player 1
      setPlayer2Health((prev) => Math.max(0, prev - damage));
      setLastHitPlayer("1");
      setTimeout(() => {
        setLastHitPlayer(null); // Reset to null after animation duration
      }, 200); // Reset after 200ms
    } else if (playerId === "2") { // Player 2
      setPlayer1Health((prev) => Math.max(0, prev - damage));
      setLastHitPlayer("2");
      setTimeout(() => {
        setLastHitPlayer(null); // Reset to null after animation duration
      }, 200); // Reset after 200ms
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
