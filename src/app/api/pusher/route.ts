import { pusherServer } from '@/lib/pusher';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { eventName, r, g, d } = await req.json();

    console.log(eventName, r, g, d);

    // Validate required fields
    if (!eventName || !r) {
      return NextResponse.json({ error: 'Event eventName and Room ID are required' }, { status: 400 });
    }

    if (eventName === 'player-hit') {
      // Validate player-hit specific fields
      if (!g || d === undefined) {
        return NextResponse.json({ error: 'Player ID and Damage Amount are required for player-hit' }, { status: 400 });
      }

      // Trigger the hit event for Pusher
      await pusherServer.trigger(`room-${r}`, 'player-hit', {
        g, // The player who dealt the damage
        d, // The amount of damage dealt
      });

      return NextResponse.json({
        message: 'Player hit event triggered successfully',
        eventName,
        r,
        g,
        d,
      });
    }

    // Handle start-game event
    else if (eventName === 'start-game') {
      // Only trigger start game event
      const startTimestamp = Date.now();

      // Trigger the start game event for Pusher
      await pusherServer.trigger(`room-${r}`, 'start-game', {
        startTimestamp,
      });

      return NextResponse.json({
        message: 'Start game event triggered successfully',
        eventName,
        r,
        startTimestamp,
      });
    }

    // Handle invalid eventName
    return NextResponse.json({ error: 'Invalid event eventName' }, { status: 400 });

  } catch (error) {
    console.error('Error handling Pusher event:', error);
    return NextResponse.json({
      message: 'Failed to handle Pusher event',
    }, { status: 500 });
  }
}
