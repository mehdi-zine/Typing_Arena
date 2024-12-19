'use client';

import { useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { useGame } from '../context/GameContext';

interface PusherManagerProps {
  roomId: string;
  player1: string;
  guestId: string|undefined;
}

const PusherManager: React.FC<PusherManagerProps> = ({ roomId, player1, guestId }) => {
  const { initPlayer1, initPlayer2, triggerAttack, player2Id, initGuest, initRoom, player1Id } = useGame();
  const pusherInstance = useRef<Pusher | null>(null);


  useEffect(() => {
    initRoom(roomId);
    initGuest(guestId);
    initPlayer1(player1);
    // Initialize Pusher
    const pusher = new Pusher('45e14c6ee9972b483030', {
      cluster: 'eu',
    });
    const channel = pusher.subscribe(`room-${roomId}`);
    pusherInstance.current = pusher;

    // Listen to events and update the context
    channel.bind('player-joined', (data: { playerId: string }) => {
      if(player2Id == null) initPlayer2(data.playerId); // Update player2 in context
    });

    channel.bind('player-hit', (data: { g: string; d: number }) => {
        if(data.g == guestId){
            console.log("Ignoring event: This browser initiated the attack.");
            return;
        }
        triggerAttack(data.g , data.d);
    });

    // Cleanup
    return () => {
      pusher.unsubscribe(`room-${roomId}`);
      pusher.disconnect();
    };
  }, [player1Id, player2Id]);

  return null; // No UI for this component
};

export default PusherManager;
