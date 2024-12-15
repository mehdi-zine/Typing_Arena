"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import Warrior from "./warrior";

interface WarriorArenaProps {
  roomId: string;
  player1Id: string;
  player2Id: string | null; // Initial player2Id from server
}

const WarriorArena: React.FC<WarriorArenaProps> = ({ roomId, player1Id, player2Id }) => {
  const [currentPlayer2Id, setCurrentPlayer2Id] = useState(player2Id);

  useEffect(() => {
    // Initialize Pusher client
    const pusher = new Pusher("45e14c6ee9972b483030", {
      cluster: "eu",
    });

    // Subscribe to the room-specific channel
    const channel = pusher.subscribe(`room-${roomId}`);

    // Listen for the "player-joined" event
    channel.bind("player-joined", (data: { playerId: string }) => {
      setCurrentPlayer2Id(data.playerId); // Update player2 when opponent joins
    });

    // Cleanup on unmount
    return () => {
      pusher.unsubscribe(`room-${roomId}`);
    };
  }, [roomId]);

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
