"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const MainCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [guestId, setGuestId] = useState("");
  const router = useRouter();

  useEffect(() => {
    let storedGuestId = getCookie("guestId");

    if (!storedGuestId) {
      storedGuestId = uuidv4(); // Generate a new guestId if not found
      document.cookie = `guestId=${storedGuestId}; path=/; max-age=31536000`; // Store in cookie for 1 year
    }

    setGuestId(storedGuestId);
  }, []);

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  const handlePlayNow = async () => {
    if (isLoading) return; // Prevent additional clicks while loading
    setIsLoading(true);

    try {
      const response = await fetch("/api/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerId: guestId }), // Send the playerId (guestId) to the server
      });

      if (response.ok) {
        const { roomId } = await response.json();
        await router.push(`/game/${roomId}`); // Wait for navigation to complete
      } else {
        console.error("Failed to join room");
        setIsLoading(false); // Reset only if there's an error
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false); // Reset in case of an exception
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-teal-800 mb-4 text-center">
        Welcome to Typing Arena!
      </h2>
      <p className="text-lg text-gray-600 mb-6 text-center">
        Get ready to join the arena. Click below to start playing!
      </p>
      <div className="flex justify-center">
        <button
          onClick={isLoading ? undefined : handlePlayNow}
          disabled={isLoading}
          className={`font-semibold py-2 px-6 rounded-lg transition duration-200 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-secondary text-white hover:bg-[#FF9472]"
          }`}
        >
          {isLoading ? "Loading..." : "Play Now"}
        </button>
      </div>
    </div>
  );
};

export default MainCard;
