"use client"; 

import { useEffect, useState } from "react";
import io from "socket.io-client";
import Warrior from "./warrior";

interface PlayerStatusProps {
  roomId: string;
  player1Id: string;
  player2Id: string | null;
}

const PlayerStatus: React.FC<PlayerStatusProps> = ({ roomId, player1Id, player2Id }) => {
  const [currentPlayer2, setCurrentPlayer2] = useState(player2Id);
  const socket = io("http://localhost:3001"); // Connect to your socket server

  useEffect(() => {
    socket.emit("joinRoom", roomId); // Emit to join the room when component mounts

    // Listen for room updates when Player 2 joins
    socket.on("roomUpdate", (data: { message: string, player2Id: string | null }) => {
      setCurrentPlayer2(data.player2Id); // Update Player 2 status
    });

    // Clean up socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  return (
    <div className="flex justify-center items-center gap-20 mt-10 relative">
      {/* Player 1 */}
      <div className="flex flex-col items-center">
        <Warrior playerId={player1Id} />
        <div className="mt-2 flex flex-col items-center">
          <p className="text-lg font-semibold text-teal-400">You</p>
        </div>
      </div>

      {/* Player 2 or Waiting */}
      <div className="flex flex-col items-center">
        {currentPlayer2 ? (
          <>
            <Warrior playerId={currentPlayer2} flipped={true} />
            <div className="mt-2 flex flex-col items-center">
              <p className="text-lg font-semibold text-teal-400">Guest</p>
            </div>
          </>
        ) : (
          <div className="text-xl text-teal-400">Waiting for Opponent...</div>
        )}
      </div>
    </div>
  );
};

export default PlayerStatus;
