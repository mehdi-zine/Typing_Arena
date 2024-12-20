'use client'
import React, { createContext, useContext, useState } from "react";

interface GameState {
  player1Health: number;
  player2Health: number;
  player1Id: string;
  player2Id: string | null;
  lastHitPlayer: string | undefined;
  room: string;
  guest: string | undefined;
  ready: boolean;
  gameStarted: boolean;
  isCountdownActive: boolean;
  initCountdown: (active: boolean) => void;
  initRoom: (roomId: string) => void;
  triggerAttack: (playerId: string | undefined, damage: number, update?: boolean, roomId?: string) => void;
  initPlayer1: (playerId: string) => void;
  initGuest: (guest: string | undefined) => void;
  initPlayer2: (playerId: string | null) => void;
  initGame: (game: boolean) => void;
  sendPusherEvent: <T extends keyof EventPayloads>(
    eventName: T,
    payload?: EventPayloads[T] // Payload type inferred based on the event name
  ) => void;}

const GameContext = createContext<GameState | undefined>(undefined);

type PlayerHitPayload = {
  damage: number;
};

type StartGamePayload = {}; // Empty object for start-game

type EventPayloads = {
  "player-hit": PlayerHitPayload;
  "start-game": StartGamePayload;
  // Add more event types here if necessary
};


export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [room , setRoom] = useState("");
  const [player1Health, setPlayer1Health] = useState(100);
  const [player2Health, setPlayer2Health] = useState(100);
  const [player1Id, setPlayer1Id] = useState("");
  const [player2Id, setPlayer2Id] = useState<string | null>(null);
  const [guest, setGuest] = useState<string | undefined>(undefined);
  const [lastHitPlayer, setLastHitPlayer] = useState<string | undefined>(undefined);// Changed to string


  const initCountdown = (active: boolean) =>{
    setIsCountdownActive(active);
  } 

  const initGame = (game: boolean) => {
    setGameStarted(game);
  }

  const initRoom = (room: string) =>{
    setRoom(room); 
   }

  const initGuest = (guest: string | undefined) =>{
     setGuest(guest); 
  }
  const initPlayer1 = (playerId: string) => {
    setPlayer1Id(playerId);
    checkReady();
  };
  
  const initPlayer2 = (playerId: string | null) => {
    setPlayer2Id(playerId);
    checkReady();
  };

  const checkReady = () => {
    if (player1Id && player2Id !== null && room) {
      setReady(true);
    }
  };

  const triggerAttack = (playerId: string | undefined, damage: number) => {
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

  
  const sendPusherEvent = async <T extends keyof EventPayloads>(
    eventName: T,
    payload: EventPayloads[T] = {} as EventPayloads[T] // Default to an empty object if no payload is provided
  ) => {
    try {
      // Assuming `room` and `guest` are available in the context state
      const commonPayload = { r: room }; // Room ID is always required
  
      let specificPayload = {};
  
      if (eventName === "player-hit") {
        const { damage } = payload as PlayerHitPayload; // Type casting to specific payload type
        if (!guest || damage === undefined) {
          throw new Error("Missing required fields for player-hit event");
        }
        specificPayload = { d: damage, g: guest }; // Include damage and guest ID
      } else if (eventName === "start-game") {
        // No additional fields needed for start-game
      } else {
        throw new Error("Invalid event name");
      }
  
      const body = JSON.stringify({ eventName, ...commonPayload, ...specificPayload });
  
      const response = await fetch("/api/pusher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
  
      if (!response.ok) {
        console.error("Error:", await response.json());
      } else {
        console.log("Success:", await response.json());
      }
    } catch (error) {
      console.error("Error during sendPusherEvent:", error);
    }
  };
  
  
  

  return (
    <GameContext.Provider
      value={{ player1Health, player2Health, player1Id, player2Id, lastHitPlayer, triggerAttack, initPlayer1, initPlayer2, guest, initGuest, ready, sendPusherEvent, initRoom, initCountdown, isCountdownActive, room, initGame, gameStarted }}
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
