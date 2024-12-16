import { pusherServer } from '@/lib/pusher';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  try {
    const { r, g, d } = await req.json();

    // Validate required fields
    if (!r || !g || d === undefined) {
      return NextResponse.json({ error: 'Room ID, Player ID, and Damage Amount are required' }, { status: 400 });
    }

    // Trigger the hit event for Pusher
    await pusherServer.trigger(`room-${r}`, 'player-hit', {
      g,   // The player who dealt the damage
      d, // The amount of damage dealt
    });

    return NextResponse.json({ 
      message: 'Player hit event triggered successfully',
      r,
      g,
      d,
    });
  } catch (error) {
    console.error('Error triggering player-hit event:', error);
    return NextResponse.json({ 
      message: 'Failed to trigger player-hit event', 
      
    }, { status: 500 });
  }
}