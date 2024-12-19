'use client'
import React, { createContext, useContext, useState } from "react";

interface GameState {
  player1Health: number;
  player2Health: number;
  player1Id: string;
  player2Id: string | null;
  lastHitPlayer: string | undefined;
  guest: string | undefined;
  ready: boolean;
  initRoom: (roomId: string) => void;
  triggerAttack: (playerId: string | undefined, damage: number, update?: boolean, roomId?: string) => void;
  initPlayer1: (playerId: string) => void;
  initGuest: (guest: string | undefined) => void;
  initPlayer2: (playerId: string | null) => void;
  sendPusherEvent: (eventName: string, damage: number) => void;
}

const GameContext = createContext<GameState | undefined>(undefined);


export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [ready, setReady] = useState(false);
  const [room , setRoom] = useState("");
  const [player1Health, setPlayer1Health] = useState(100);
  const [player2Health, setPlayer2Health] = useState(100);
  const [player1Id, setPlayer1Id] = useState("");
  const [player2Id, setPlayer2Id] = useState<string | null>(null);
  const [guest, setGuest] = useState<string | undefined>(undefined);
  const [lastHitPlayer, setLastHitPlayer] = useState<string | undefined>(undefined);// Changed to string


  const initRoom = (room: string) =>{
    setRoom(room); 
   }

  const initGuest = (guest: string | undefined) =>{
     setGuest(guest); 
     console.log(guest);
  }
  const initPlayer1 = (playerId: string) => {
    setPlayer1Id(playerId);
    console.log("player 1")
    checkReady();
  };
  
  const initPlayer2 = (playerId: string | null) => {
    setPlayer2Id(playerId);
    console.log("player 2");
    checkReady();
  };

  const checkReady = () => {
    if (player1Id && player2Id !== null) {
      setReady(true);
    }
  };

  const triggerAttack = (playerId: string | undefined, damage: number, update: boolean = false, roomId: string = "") => {
    if (!player1Id || !player2Id) {
      console.error(
        "Player IDs not initialized! Cannot process action:",
        { player1Id, player2Id }
      );
      return;
    }
  
    if (playerId === player1Id) { // Player 1
      setPlayer2Health((prev) => Math.max(0, prev - damage));
      setLastHitPlayer(playerId);
      setTimeout(() => {
        setLastHitPlayer(undefined); // Reset to null after animation duration
      }, 200); // Reset after 200ms
    } else{ // Player 2
      setPlayer1Health((prev) => Math.max(0, prev - damage));
      setLastHitPlayer(playerId);
      setTimeout(() => {
        setLastHitPlayer(undefined); // Reset to null after animation duration
      }, 200); // Reset after 200ms
    }


  };

   const sendPusherEvent = async (eventName: string, damage: number) => {
    try {
      // Assuming `room` and `guest` are available in the context state
      const response = await fetch("/api/pusher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName,
          d: damage, // Send damage as 'd'
          r: room,   // Add room ID from context state
          g: guest,  // Add guest ID from context state
        }),
      });
  
      if (!response.ok) {
        console.error("Error:", await response.json());
      } else {
        console.log("Success:", await response.json());
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };
  
  

  return (
    <GameContext.Provider
      value={{ player1Health, player2Health, player1Id, player2Id, lastHitPlayer, triggerAttack, initPlayer1, initPlayer2, guest, initGuest, ready, sendPusherEvent, initRoom }}
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
