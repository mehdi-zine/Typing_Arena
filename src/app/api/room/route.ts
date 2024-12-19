// app/api/room/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { pusherServer } from '@/lib/pusher';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { playerId } = await req.json();

  // Check if playerId is provided
  if (!playerId) {
    return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
  }

  // Try to find an available room (room where player2 is null and game hasn't started)
  const availableRoom = await prisma.room.findFirst({
    where: {
      player2Id: null,
      isActive: true,
    },
  });

  let roomId;

  if (availableRoom) {
    // Join the room if available
    roomId = availableRoom.id;

    
    try {
    } catch (pusherError) {
      // Log any errors that occur when triggering the Pusher event
      console.error('Error triggering Pusher event:', pusherError);
      return NextResponse.json({ error: 'Failed to trigger Pusher event' }, { status: 500 });
    }
    
    const updatedRoom = await prisma.room.update({
      where: { id: availableRoom.id },
      data: { player2Id: playerId },
    });
    
    await pusherServer.trigger(`room-${roomId}`, 'player-joined', {
      playerId,
    });

    // Emit 'playerJoined' event using socket.io
    // Ensure that you emit to the correct room ID on the socket server
    // You need to emit this on the server-side (explained later)


    return NextResponse.json({
      message: 'Joined room successfully!',
      roomId: updatedRoom.id,
    });
  }

  // If no room is available, create a new room
  const newRoom = await prisma.room.create({
    data: {
      player1Id: playerId,
    },
  });

  roomId = newRoom.id;

  
  return NextResponse.json({
    message: 'Created and joined new room!',
    roomId: roomId,
  });
}

export async function DELETE(req: Request) {
  const { playerId, roomId } = await req.json();

  // Find the room and mark it as inactive if player leaves
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  if (room.player1Id === playerId) {
    // If the player is player1, make the room inactive
    await prisma.room.update({
      where: { id: roomId },
      data: { isActive: false },
    });
  } else if (room.player2Id === playerId) {
    // If the player is player2, mark player2 as null
    await prisma.room.update({
      where: { id: roomId },
      data: { player2Id: null },
    });
  }

  // Emit 'playerLeft' event to inform others
  return NextResponse.json({ message: 'Player left the room' });
}