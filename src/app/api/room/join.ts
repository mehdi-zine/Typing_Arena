import { pusherServer } from '@/lib/pusher';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  const { roomId, playerId } = await req.json();

  // Update the database to add player to the room

  await pusherServer.trigger(`room-${roomId}`, 'player-joined', {
    playerId,
  });

  return NextResponse.json({ message: 'Player joined the room' });
}
