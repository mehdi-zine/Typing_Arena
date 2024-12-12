'use client'

import React, { useCallback, useEffect, useState } from "react"
import Image from "next/image"

interface WarriorProps {
    animation: "idle" | "walking" | "hitting"; // Define possible animations
    flipped?: boolean; // Optional prop to flip the sprite horizontally
}

const Warrior: React.FC<WarriorProps> = ({ animation, flipped = false }) => {
    const [framePos, setFramePos] = useState<number>(0);
    const [row, setRow] = useState<number>(0); // Row selector (0: first row, 1: second row, 2: third row)


    const handleSpriteChange = useCallback(() => {
        // Increment by 36px for each frame
        const newPos = framePos + 36
        console.log(`Updating frame position: ${newPos}`)
        setFramePos(newPos === 108 ? 0 : newPos)
    }, [framePos])

    useEffect(() => {
        let animationRow = 0;
        if (animation === "idle") animationRow = 0;
        else if (animation === "walking") animationRow = 1;
        else if (animation === "hitting") animationRow = 2;

        setRow(animationRow);
        const interval = setInterval(() => {
            handleSpriteChange()
        }, 150) // Update the frame every 100ms (you can adjust this speed)
        return () => clearInterval(interval)
    }, [handleSpriteChange])

    return (
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
    )
}

export default Warrior

const style = {
    width: "35px", // Each frame width (36px)
    height: "35px", // Each frame height (36px)
    overflow: "hidden",
    display: "inline-block",
}
