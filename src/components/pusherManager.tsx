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
  const { initPlayer1, initPlayer2, triggerAttack, player2Id, initGuest, initRoom, player1Id, isCountdownActive, initCountdown, sendPusherEvent, gameStarted, initGame, finishGame, gameResult } = useGame();
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
      setIsSubscribed(true); // Mark channel as ready
    });

    
    channel.bind('start-game', (data: {g: string}) => {
      console.log(data);
      if (!player2) initPlayer2(data.g); // Update player2 in context
      if(!gameStarted){
        initCountdown(true);
        initGame(true);
      }
    });

    channel.bind('finish-game', (data: {g: string}) => {
      if(gameResult == "")
        finishGame(data.g);
    });
    
    channel.bind('player-hit', (data: { g: string; d: number }) => {
      if(data.g == guestId){
        return;
      }
      triggerAttack(data.g , data.d);
    });
    
    // Cleanup
    return () => {
      pusher.unsubscribe(`room-${roomId}`);
      pusherInstance.current = null;
    };
  }, [player1Id, player2Id, roomId, guestId, isCountdownActive, gameStarted, gameResult]);

  useEffect(() => {
    if (isSubscribed && player2Id !="" && !gameStarted) {
      setIsSubscribed(false);
      sendPusherEvent('start-game');
    }
  }, [isSubscribed, player2Id, gameStarted, sendPusherEvent]);

  

  return null; // No UI for this component
};

export default PusherManager;
