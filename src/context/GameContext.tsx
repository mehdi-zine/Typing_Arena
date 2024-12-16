'use client'
import React, { createContext, useContext, useState } from "react";

interface GameState {
  player1Health: number;
  player2Health: number;
  player1Id: string;
  player2Id: string | null;
  lastHitPlayer: string | null;
  guest: string | null;
  ready: boolean;
  triggerAction: (playerId: string | null, damage: number, update?: boolean, roomId?: string) => void;
  initPlayer1: (playerId: string) => void;
  initGuest: (guest: string | null) => void;
  initPlayer2: (playerId: string | null) => void;
}

const GameContext = createContext<GameState | undefined>(undefined);


export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [ready, setReady] = useState(false);
  const [player1Health, setPlayer1Health] = useState(100);
  const [player2Health, setPlayer2Health] = useState(100);
  const [player1Id, setPlayer1Id] = useState("defaultPlayer1");
  const [player2Id, setPlayer2Id] = useState<string | null>("defaultPlayer2");
  const [guest, setGuest] = useState<string | null>("");
  const [lastHitPlayer, setLastHitPlayer] = useState<string | null>(null);// Changed to string


  const initGuest = (guest: string | null) => setGuest(guest);
  const initPlayer1 = (playerId: string) => {
    setPlayer1Id(playerId);
    checkReady();
  };
  
  const initPlayer2 = (playerId: string | null) => {
    setPlayer2Id(playerId);
    checkReady();
  };

  const checkReady = () => {
    if (player1Id && player2Id !== null) {
      setReady(true);
    }
  };

  const triggerAction = (playerId: string | null, damage: number, update: boolean = false, roomId: string = "") => {
    if (!player1Id || !player2Id) {
      console.error(
        "Player IDs not initialized! Cannot process action:",
        { player1Id, player2Id }
      );
      return;
    }
  
    console.log(`Triggering action for playerId: ${playerId}`);
    if (playerId === player1Id) { // Player 1
      setPlayer2Health((prev) => Math.max(0, prev - damage));
      setLastHitPlayer(playerId);
      setTimeout(() => {
        setLastHitPlayer(null); // Reset to null after animation duration
      }, 200); // Reset after 200ms
    } else{ // Player 2
      setPlayer1Health((prev) => Math.max(0, prev - damage));
      setLastHitPlayer(playerId);
      setTimeout(() => {
        setLastHitPlayer(null); // Reset to null after animation duration
      }, 200); // Reset after 200ms
    }
  };

  return (
    <GameContext.Provider
      value={{ player1Health, player2Health, player1Id, player2Id, lastHitPlayer, triggerAction, initPlayer1, initPlayer2, guest, initGuest, ready }}
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
