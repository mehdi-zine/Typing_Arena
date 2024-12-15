'use client'
import React, { createContext, useContext, useState } from "react";

interface GameState {
  player1Health: number;
  player2Health: number;
  player1Id: string;
  player2Id: string | null;
  lastHitPlayer: string | null;
  triggerAction: (playerId: string | null, damage: number, update?: boolean, roomId?: string) => void;
  initPlayer1: (playerId: string) => void;
  initPlayer2: (playerId: string | null) => void;
  updateHealth1: (health: number) => void;
  updateHealth2: (health: number) => void;
}

const GameContext = createContext<GameState | undefined>(undefined);
async function triggerPlayerHit(roomId: string, guestId: string | null, damageAmount: number) {
  try {
    const response = await fetch('/api/pusher', { // Your actual API route path
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomId,
        guestId,
        damageAmount
      }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log('Success:', result);
    } else {
      console.error('Error:', result.message, result.error);
    }
  } catch (error) {
    console.error('Error during fetch:', error);
  }
}


export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [player1Health, setPlayer1Health] = useState(100);
  const [player2Health, setPlayer2Health] = useState(100);
  const [player1Id, setPlayer1Id] = useState("");
  const [player2Id, setPlayer2Id] = useState<string | null>("");
  const [lastHitPlayer, setLastHitPlayer] = useState<string | null>(null); // Changed to string

  const initPlayer1 = (playerId: string) => setPlayer1Id(playerId);
  const updateHealth1 = (health: number) => setPlayer1Health(health);
  const updateHealth2 = (health: number) => setPlayer2Health(player2Health - health);

  const initPlayer2 = (playerId: string | null) => setPlayer2Id(playerId);

  const triggerAction = (playerId: string | null, damage: number, update: boolean = false, roomId: string = "") => {
    //console.log(player1Health, player2Health);
    // console.log("TriggerAction Called:");
    // console.log("Player ID:", playerId);
    // console.log("Damage:", damage);
    // console.log("Update Flag:", update);
    // console.log("Room ID:", roomId);
    // console.log("Current Health: ", { player1Health, player2Health });
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
      value={{ player1Health, player2Health, player1Id, player2Id, lastHitPlayer, triggerAction, initPlayer1, initPlayer2, updateHealth1, updateHealth2 }}
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
