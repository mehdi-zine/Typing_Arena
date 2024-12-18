"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";


const MainCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [guestId, setGuestId] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if guestId exists, otherwise generate one and save it
    let storedGuestId = getCookie('guestId');

    if (!storedGuestId) {
      storedGuestId = uuidv4(); // Generate a new guestId if not found
      document.cookie = `guestId=${storedGuestId}; path=/; max-age=31536000`; // Store in cookie for 1 year
    }

    setGuestId(storedGuestId);

  }, []);

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };
  const handlePlayNow = async () => {
    // Ensure that the socket is connected and the playerId (socket.id) is available

    setIsLoading(true);

    try {

      const response = await fetch('/api/room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId: guestId }), // Send the playerId (guestId) to the server
      });

      if (response.ok)  {
        // Room was successfully created or joined
        const { roomId } = await response.json();
        router.push(`/game/${roomId}`);
      } else {
        console.error("Failed to join room");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Card Title */}
      <h2 className="text-2xl font-bold text-teal-800 mb-4 text-center">Welcome to Typing Arena!</h2>

      {/* Card Content */}
      <p className="text-lg text-gray-600 mb-6 text-center">
        {guestId}
        Get ready to join the arena. Click below to start playing!
      </p>

      {/* Button Section */}
      <div className="flex justify-center">
        <button
          onClick={handlePlayNow}
          className="bg-secondary text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#FF9472] transition duration-200"
        >
          {isLoading ? "Loading..." : "Play Now"}
        </button>
      </div>
    </div>
  );
};
  
  export default MainCard;