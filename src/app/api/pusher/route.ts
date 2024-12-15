import { pusherServer } from '@/lib/pusher';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  try {
    const { roomId, guestId, damageAmount } = await req.json();

    // Validate required fields
    if (!roomId || !guestId || damageAmount === undefined) {
      return NextResponse.json({ error: 'Room ID, Player ID, and Damage Amount are required' }, { status: 400 });
    }

    // Trigger the hit event for Pusher
    await pusherServer.trigger(`room-${roomId}`, 'player-hit', {
      guestId,   // The player who dealt the damage
      damageAmount, // The amount of damage dealt
    });

    return NextResponse.json({ 
      message: 'Player hit event triggered successfully',
      roomId,
      guestId,
      damageAmount,
    });
  } catch (error) {
    console.error('Error triggering player-hit event:', error);
    return NextResponse.json({ 
      message: 'Failed to trigger player-hit event', 
      
    }, { status: 500 });
  }
}