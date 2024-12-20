'use client';

import { useEffect, useRef, useState } from 'react';
import Pusher from 'pusher-js';
import { useGame } from '../context/GameContext';

interface PusherManagerProps {
  roomId: string;
  player1: string;
  player2: string | null;
  guestId: string|undefined;
}

const PusherManager: React.FC<PusherManagerProps> = ({ roomId, player1, player2, guestId }) => {
  const { initPlayer1, initPlayer2, triggerAttack, player2Id, initGuest, initRoom, player1Id, isCountdownActive, initCountdown, sendPusherEvent, gameStarted, initGame } = useGame();
  const pusherInstance = useRef<Pusher | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false); // Track subscription status


  useEffect(() => {
    initRoom(roomId);
    initGuest(guestId);
    initPlayer1(player1);
    
  },[guestId, player1Id, initRoom, initGuest, initPlayer1, player1, roomId])



  useEffect(() => {
    // Initialize Pusher
      const pusher = new Pusher('45e14c6ee9972b483030', {
        cluster: 'eu',
      });
      const channel = pusher.subscribe(`room-${roomId}`);
      pusherInstance.current = pusher;
      
      channel.bind('pusher:subscription_succeeded', () => {
      console.log('Subscription succeeded');
      setIsSubscribed(true); // Mark channel as ready
    });

    // Listen to events and update the context
    channel.bind('player-joined', (data: { playerId: string }) => {
      console.log("player-joined");
      if(player2Id == null) initPlayer2(data.playerId); // Update player2 in context
    });
    
    channel.bind('start-game', (data: any) => {
      if(!gameStarted){
        console.log("Countdown Started1");
        initCountdown(true);
        initGame(true);
      }
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
      pusherInstance.current = null;
    };
  }, [player1Id, player2Id, roomId, guestId, isCountdownActive, gameStarted]);

  useEffect(() => {
    if (isSubscribed && player2 && !gameStarted) {
      console.log('Triggering start-game event');
      setIsSubscribed(false);
      sendPusherEvent('start-game');
    }
  }, [isSubscribed, player2, gameStarted, sendPusherEvent]);

  

  return null; // No UI for this component
};

export default PusherManager;
