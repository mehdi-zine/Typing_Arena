'use client'

import React, { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { useGame } from "../context/GameContext";

interface WarriorProps {
    playerId: number // Define possible animations
    flipped?: boolean; // Optional prop to flip the sprite horizontally
}

const Warrior: React.FC<WarriorProps> = ({ playerId, flipped = false }) => {
    const [framePos, setFramePos] = useState<number>(0);
    const [row, setRow] = useState<number>(0); // Row selector (0: first row, 1: second row, 2: third row)
    const { player1Health, player2Health, lastHitPlayer } = useGame();
    const health = playerId === 1 ? player1Health : player2Health;
    const [count, setCount] = useState<number>(0);
    const [isHitting, setIsHitting] = useState(false);
    const [animation, setAnimation] = useState<"idle" | "hitting">("idle");

    const handleSpriteChange = useCallback(() => {
        // Increment by 36px for each frame
        const newPos = framePos + 36
        setFramePos(newPos === 108 ? 0 : newPos)
    }, [framePos])

    useEffect(() => {
        // Set animation based on the context's `lastHitPlayer`
        if (lastHitPlayer === playerId) {
            setAnimation("hitting");
            setIsHitting(true);
        }
    }, [lastHitPlayer, playerId]);

    useEffect(() => {
        let animationRow = 0;
        if (animation === 'idle') animationRow = 0;
        else if (isHitting) animationRow = 2;
        else animationRow = 0;
    
        setRow(animationRow);
    
        const frameInterval = setInterval(() => {
          handleSpriteChange();
          if(isHitting) {
            setCount(count + 1); 
            console.log("hello");
        }
          
        }, 150); // Frame update interval
    
        // When the hitting animation finishes, return to idle
        if (count == 3) {
            setAnimation('idle'); // Reset to idle after hitting animation
            setIsHitting(false);
            //console.log("hello") 
            setCount(0); // Reset the hitting flag
    
          return () => {
            clearInterval(frameInterval); // Cleanup interval
          };
        }
    
        // Cleanup interval when the animation is idle
        return () => clearInterval(frameInterval);
      }, [animation, handleSpriteChange, isHitting]);

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
                    style={{ width: `${health}%` }} >
                    </div>
                </div>
            </div>
        </>
    )
}

export default Warrior

const style = {
    width: "35px", // Each frame width (35px)
    height: "35px", // Each frame height (35px)
    overflow: "hidden",
    display: "inline-block",
}
