'use client';

import React, { useEffect, useRef, useState } from "react";
import { useGame } from "../context/GameContext";

interface TypingTextProps {
  text: string;
  roomId: string;
}

const TypingText: React.FC<TypingTextProps> = ({ text = '', roomId = '' }) => {
  const [guestId, setGuestId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const { triggerAction, guest } = useGame();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const words = text.split(" ");
  const totalWords = words.length;
  const damagePerWord = 100 / totalWords;

  const processedWords = useRef<number[]>([]); // Tracks processed words
  const accumulatedDamage = useRef<number>(0); // Tracks accumulated damage
  const lastActionTime = useRef<number>(Date.now()); // Tracks last action time
  const idleTimeout = useRef<NodeJS.Timeout | null>(null); // Tracks idle timeout
  const API_THROTTLE_INTERVAL = 800; // Interval between API requests (in milliseconds)
  const IDLE_DELAY = 500; // Time to wait before flushing after user stops typing (in milliseconds)

  // Function to send accumulated damage in one request
  const triggerPlayerHit = async (damageAmount: number) => {
    try {
      const response = await fetch('/api/pusher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          r: roomId,
          g: guestId,
          d: damageAmount,
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

  // Process and send accumulated damage after a delay or on idle
  const processAndSendDamage = async () => {
  const currentTime = Date.now();
  const timeDifference = currentTime - lastActionTime.current;

  if (timeDifference >= API_THROTTLE_INTERVAL && accumulatedDamage.current > 0) {
    // Send the accumulated damage to the server
    await triggerPlayerHit(accumulatedDamage.current);

    // Reset accumulated damage after sending
    accumulatedDamage.current = 0;

    // Update the last action time to prevent immediate resending
    lastActionTime.current = currentTime;
  }
};


  // Force flush remaining damage when idle
  const flushOnIdle = async () => {
    if (accumulatedDamage.current > 0) {
      await triggerPlayerHit(accumulatedDamage.current);
      accumulatedDamage.current = 0;
    }
  };

  // Handle input change and immediate damage application
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const typedValue = e.target.value;
    setInputValue(typedValue);

    const currentWordWithSpace =
      currentWordIndex < words.length - 1
        ? words[currentWordIndex] + " "
        : words[currentWordIndex];

    // Check if the word is correctly typed
    if (typedValue === currentWordWithSpace) {
      setInputValue(""); // Clear the input field
      setCurrentWordIndex((prevIndex) => prevIndex + 1);

      if (!processedWords.current.includes(currentWordIndex)) {
        processedWords.current.push(currentWordIndex); // Mark the word as processed

        // Apply damage immediately for the correct word, without over-decreasing health
        triggerAction(guestId, damagePerWord);

        // Accumulate damage for requests
        accumulatedDamage.current += damagePerWord;

        // Process and send accumulated damage after a delay
        processAndSendDamage();
      }

      // Reset the idle timer
      if (idleTimeout.current) {
        clearTimeout(idleTimeout.current);
      }
      idleTimeout.current = setTimeout(() => {
        flushOnIdle();
      }, IDLE_DELAY);
    }
  };

  useEffect(() => {
    if (currentWordIndex === totalWords) {
      setIsCompleted(true); // Mark the text as completed

      // Flush any remaining damage on completion
      flushOnIdle();
    }
  }, [currentWordIndex, totalWords]);

  useEffect(() => {
    const handleFocusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    // Focus input when clicking elsewhere on the screen
    window.addEventListener("click", handleFocusInput);

    return () => {
      window.removeEventListener("click", handleFocusInput);
    };
  }, []);

  useEffect(() => {
    const storedGuestId = localStorage.getItem("guestId");
    if (storedGuestId) {
      setGuestId(storedGuestId); // Store the guestId in state
    }
  }, []);

  return (
    <div className="max-w-full">
      <p
        className="text-lg md:text-xl font-mono mt-4"
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
      >
        {words.map((word, index) => (
          <span
            key={index}
            className="mr-2"
            style={{
              display: "inline-block",
              marginRight: "0.5rem",
            }}
          >
            {word.split("").map((letter, letterIndex) => {
              const isCurrentWord = index === currentWordIndex;
              const isTyped = inputValue[letterIndex] === letter;
              const isMistake =
                inputValue[letterIndex] &&
                inputValue[letterIndex] !== letter;

              return (
                <span
                  key={letterIndex}
                  style={{
                    color: isCurrentWord
                      ? isTyped
                        ? "green"
                        : isMistake
                        ? "red"
                        : "white"
                      : "white",
                    textDecoration:
                      isCurrentWord && letterIndex === inputValue.length
                        ? "underline"
                        : "none",
                  }}
                >
                  {letter}
                </span>
              );
            })}
            {/* Add a space visually for words except the last */}
            {index < words.length - 1 && (
              <span
                style={{
                  color:
                    currentWordIndex === index && inputValue.endsWith(" ")
                      ? "green"
                      : "white",
                }}
              >
                {" "}
              </span>
            )}
          </span>
        ))}
      </p>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={isCompleted ? "Finished!" : "Type here..."}
        className={`w-full p-4 rounded-lg text-gray-800 text-lg border-2 ${
          isCompleted
            ? "bg-gray-200 cursor-not-allowed"
            : "border-teal-400 focus:border-teal-600"
        } shadow-lg mt-4 focus:outline-none`}
        autoFocus // Automatically focus on input
        disabled={isCompleted} // Disable input when text is completed
      />
    </div>
  );
};

export default TypingText;

