'use client';

import React, { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";

interface TypingTextProps {
  text: string;
}

const TypingText: React.FC<TypingTextProps> = ({ text }) => {
  const [inputValue, setInputValue] = useState("");
  const { triggerAction } = useGame();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const words = text.split(" ");
  const totalWords = words.length;
  const damagePerWord = 100 / totalWords;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const typedValue = e.target.value;
    setInputValue(typedValue);

    // Compare typed value with the current word including spaces
    const currentWordWithSpace = currentWordIndex < words.length - 1
      ? words[currentWordIndex] + " "
      : words[currentWordIndex]; // Include space for all but the last word

    if (typedValue === currentWordWithSpace) {
      // Move to the next word when current word is correctly typed
      setInputValue(""); // Clear the input field
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      triggerAction(1, damagePerWord);
    }
  };

  useEffect(() => {
    if (currentWordIndex === totalWords) {
      setIsCompleted(true); // Mark the text as completed when all words are typed
    }
  }, [currentWordIndex, totalWords]);

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
                  color: currentWordIndex === index && inputValue.endsWith(" ")
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
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={isCompleted ? "Finished!" : "Type here..."}
        className={`w-full p-4 rounded-lg text-gray-800 text-lg border-2 ${
          isCompleted ? "bg-gray-200 cursor-not-allowed" : "border-teal-400 focus:border-teal-600"
        } shadow-lg mt-4 focus:outline-none`}
        autoFocus // Automatically focus on input
        disabled={isCompleted} // Disable input when text is completed
        style={{
          pointerEvents: "none", // Prevent all mouse interactions
        }}
      />
    </div>
  );
};

export default TypingText;
