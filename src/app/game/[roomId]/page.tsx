import { GameProvider } from "../../../context/GameContext";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import GamePage from "../../../components/game";


// Initialize Prisma Client
const prisma = new PrismaClient();

// Function to fetch room data based on roomId
const fetchRoomData = async (roomId: string) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });
  return room;
};

// RoomPage component
export default async function RoomPage({ params }: { params: { roomId: string } }) {
  // Fetch the roomId from params (params are automatically awaited in the App Router)
  const { roomId } = await params;

  // Fetch room data based on roomId
  const room = await fetchRoomData(roomId);

  if (!room) {
    return notFound(); // Handle cases where the room doesn't exist
  }

  return (
    <GameProvider>
      <GamePage room={room} />
    </GameProvider>
  );
}
