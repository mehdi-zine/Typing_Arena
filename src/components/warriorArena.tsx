"use client";

import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import Warrior from "./warrior";
import { useGame } from "@/context/GameContext";

interface WarriorArenaProps {
  roomId: string;
  player1Id: string;
  player2Id: string | null; // Initial player2Id from server
}

const WarriorArena: React.FC<WarriorArenaProps> = ({ roomId, player1Id, player2Id }) => {
  const { initPlayer1, initPlayer2, triggerAction } = useGame();
  const [currentPlayer2Id, setCurrentPlayer2Id] = useState(player2Id);
  const player1IdRef = useRef(player1Id);
  const player2IdRef = useRef(player2Id);

  useEffect(() => {
    player1IdRef.current = player1Id;
    player2IdRef.current = player2Id;
}, [player1Id, player2Id]);

    
    useEffect(() => {
    initPlayer1(player1Id);
    initPlayer2(player2Id);
    const pusher = new Pusher("45e14c6ee9972b483030", {
        cluster: "eu",
        });
        
        const channel = pusher.subscribe(`room-${roomId}`);
        
    // Listen for the "player-joined" event
    channel.bind("player-joined", (data: { playerId: string }) => {
        setCurrentPlayer2Id(data.playerId); // Update player2 when opponent joins
        initPlayer2(data.playerId);
    });

    channel.bind("player-hit", (data: { guestId: string, damageAmount: number }) => {
        console.log(data);
      if (data.guestId === player1Id) {
        triggerAction(player1Id, data.damageAmount);
        // Trigger animation for player 1 getting hit
      } else {
        triggerAction(player2Id, data.damageAmount);
      }
    });

    // Cleanup on unmount
    return () => {
      pusher.unsubscribe(`room-${roomId}`);
    };
  }, [player1Id, player2Id, roomId, triggerAction]);



  return (
    <div className="flex justify-center items-center gap-20 mt-10 relative">
      {/* Player 1 Warrior */}
      <div className="flex flex-col items-center">
        <Warrior playerId={player1Id} />
        <p className="mt-2 text-lg font-semibold text-teal-400">You</p>
      </div>

      {/* Player 2 Warrior */}
      <div className="flex flex-col items-center">
        {currentPlayer2Id ? (
          <>
            <Warrior playerId={currentPlayer2Id} flipped={true} />
            <p className="mt-2 text-lg font-semibold text-teal-400">Opponent</p>
          </>
        ) : (
          <div className="text-xl text-teal-400">Waiting for Opponent...</div>
        )}
      </div>
    </div>
  );
};

export default WarriorArena;
