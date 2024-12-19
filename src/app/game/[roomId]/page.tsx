import { GameProvider } from "../../../context/GameContext";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import GamePage from "../../../components/game";
import PusherManager from "@/components/pusherManager";
import { cookies } from "next/headers";


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
  const { roomId } =  params;

  // Fetch room data based on roomId
  const cookieStore = await cookies();
  const guestId = cookieStore.get('guestId')?.value;
  const room = await fetchRoomData(roomId);

  if (!room) {
    return notFound(); // Handle cases where the room doesn't exist
  }

  if (!guestId) return notFound();

  const roomWithGuestId = {
    ...room,
    guestId, // Add the guestId property to the room object
  };


  return (
    <GameProvider>
      <PusherManager roomId={room.id} player1={room.player1Id} guestId={guestId}/>
      <GamePage room={roomWithGuestId} />
    </GameProvider>
  );
}
