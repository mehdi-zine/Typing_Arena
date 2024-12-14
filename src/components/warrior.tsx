"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useGame } from "../context/GameContext";

interface WarriorProps {
  playerId: string; // Updated to string to match your schema
  flipped?: boolean; // Optional prop to flip the sprite horizontally
}

const Warrior: React.FC<WarriorProps> = ({ playerId, flipped = false }) => {
  const [framePos, setFramePos] = useState<number>(0);
  const [row, setRow] = useState<number>(0); // Row selector (0: idle, 2: hitting)
  const { player1Health, player2Health, lastHitPlayer } = useGame();
  const health = playerId === "1" ? player1Health : player2Health; // Use "1" or "2" as player IDs
  const [count, setCount] = useState<number>(0);
  const [isHitting, setIsHitting] = useState(false);
  const [animation, setAnimation] = useState<"idle" | "hitting">("idle");

  // Handle sprite frame position
  const handleSpriteChange = useCallback(() => {
    setFramePos((prevPos) => (prevPos + 36) % 108); // Cycle through frames
  }, []);

  // Update animation state based on last hit player
  useEffect(() => {
    if (lastHitPlayer === playerId) {
      setAnimation("hitting");
      setIsHitting(true);
    }
  }, [lastHitPlayer, playerId]);

  // Sprite animation and row control
  useEffect(() => {
    // Determine row for the animation
    const animationRow = animation === "hitting" && isHitting ? 2 : 0;
    setRow(animationRow);

    const frameInterval = setInterval(() => {
      handleSpriteChange();

      if (isHitting) {
        setCount((prevCount) => prevCount + 1);
      }
    }, 150); // Update frames every 150ms

    // Reset to idle animation after 3 "hitting" frames
    if (isHitting && count === 3) {
      setAnimation("idle");
      setIsHitting(false);
      setCount(0);
    }

    return () => clearInterval(frameInterval); // Cleanup interval on unmount or animation change
  }, [animation, handleSpriteChange, isHitting, count]);

  return (
    <>
      <div style={{ ...style, transform: flipped ? "scaleX(-1)" : "scaleX(1)" }}>
        <Image
          src="/assets/Warrior.png" // Path to your sprite sheet
          alt="Warrior"
          width={216}
          height={108}
          style={{
            objectFit: "none",
            objectPosition: `${-framePos}px ${-row * 36}px`, // Ensure frame alignment
            maxWidth: "none", // Override global styles
          }}
        />
      </div>
      <div className="mt-2 flex flex-col items-center">
        <div className="w-32 h-4 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="bg-green-500 h-full"
            style={{ width: `${health}%` }} // Dynamically adjust health bar
          ></div>
        </div>
      </div>
    </>
  );
};

export default Warrior;

const style = {
  width: "35px", // Each frame width (35px)
  height: "35px", // Each frame height (35px)
  overflow: "hidden",
  display: "inline-block",
};
