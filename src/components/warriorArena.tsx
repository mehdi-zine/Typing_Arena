"use client";

import { useEffect } from "react";
import Warrior from "./warrior";
import { useGame } from "@/context/GameContext";

interface WarriorArenaProps {
  player1: string;
  player2: string | null;
  guestId: string | undefined;
}

const WarriorArena: React.FC<WarriorArenaProps> = ({ player1, player2, guestId }) => {
  const { player2Id, initPlayer2 } = useGame();

  useEffect(() => {
    if(player2 != null) initPlayer2(player2);
  },[player1, player2, initPlayer2])

  return (
    <div className="flex justify-center items-center gap-20 mt-10 relative">
      {/* Player 1 Warrior */}
      <div className="flex flex-col items-center">
        <Warrior playerId={player1} />
        <p className="mt-2 text-lg font-semibold text-teal-400">{player1 == guestId ? "You" : "Opponent"}</p>
      </div>

      {/* Player 2 Warrior */}
      <div className="flex flex-col items-center">
        {player2Id || player2 ? (
          <>
            <Warrior playerId={player2Id || player2} flipped={true} />
            <p className="mt-2 text-lg font-semibold text-teal-400">{player1 == guestId ? "Opponent" : "You"}</p>
          </>
        ) : (
          <div className="text-xl text-teal-400">Waiting for Opponent...</div>
        )}
      </div>
    </div>
  );
};

export default WarriorArena;
