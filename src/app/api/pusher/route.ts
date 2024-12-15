import { pusherServer } from '@/lib/pusher';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  try {
    const { roomId, playerId } = await req.json();

    // Check if necessary data is provided
    if (!roomId || !playerId) {
      return NextResponse.json({ error: 'Room ID and Player ID are required' }, { status: 400 });
    }

    // Trigger the event for Pusher
    await pusherServer.trigger(`room-${roomId}`, 'player-joined', {
      playerId,
    });

    return NextResponse.json({ message: 'Player joined the room', roomId });
  } catch (error) {
    console.error('Error triggering Pusher event:', error);
    return NextResponse.json({ message: 'Failed to trigger Pusher event' }, { status: 500 });
  }
}