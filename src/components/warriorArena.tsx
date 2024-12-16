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
  const { initPlayer1, initPlayer2, triggerAction, ready } = useGame();
  const [currentPlayer2Id, setCurrentPlayer2Id] = useState(player2Id);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const currentPlayerRef = useRef<string | null>(null);

  const player1IdRef = useRef(player1Id);
  const player2IdRef = useRef(player2Id);

  useEffect(() => {
      const storedGuestId = localStorage.getItem("guestId");
      if (storedGuestId) {
        setCurrentPlayer(storedGuestId)
        currentPlayerRef.current = storedGuestId; 
      }
    }, []);

    
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
        player2IdRef.current = data.playerId;
        initPlayer2(data.playerId);
    });

    channel.bind("player-hit", (data: { g: string, d: number }) => {
      console.log(player1Id, player2Id, "IN THE CONTEXT");
      if(data.g == currentPlayerRef.current){
        console.log("Ignoring event: This browser initiated the attack.");
        return;
      }

      if (!player1IdRef.current || !player2IdRef.current) {
        console.error("Player IDs not initialized! Cannot process action:", data);
        return;
      }

      triggerAction(data.g === player1IdRef.current ? player1IdRef.current : player2IdRef.current, data.d);
      
    });

    // Cleanup on unmount
    return () => {
      pusher.unsubscribe(`room-${roomId}`);
    };
  }, [ready]);



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
