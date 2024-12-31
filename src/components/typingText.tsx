'use client';

import React, { useEffect, useRef, useState } from "react";
import { useGame } from "../context/GameContext";

interface TypingTextProps {
  text: string;
}

const TypingText: React.FC<TypingTextProps> = ({ text = "" }) => {
  const [inputValue, setInputValue] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { triggerAttack, sendPusherEvent, guest, gameStarted } = useGame();

  const words = text.split(" ");
  const totalWords = words.length;
  const damagePerWord = 100 / totalWords;

  // Handle input change and trigger attack for each correctly typed word
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

      // Trigger attack without worrying about throttling or accumulation
      triggerAttack(guest, damagePerWord);
      sendPusherEvent("player-hit", {damage: damagePerWord});

      // Mark as completed if all words are typed
      if (currentWordIndex + 1 === totalWords) {
        setIsCompleted(true);
        sendPusherEvent("finish-game", { guest });
      }
    }
  };

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
        disabled={!gameStarted || isCompleted} // Disable input when text is completed
      />
    </div>
  );
};

export default TypingText;
