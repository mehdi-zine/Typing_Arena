// server/socket.ts (Socket.IO setup)
import { Server } from 'socket.io';
import { createServer } from 'http';
import { getRoomData } from './lib/prisma';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', async (roomId) => {
    socket.join(roomId);
    console.log(`Player joined room: ${roomId}`);

    // Fetch room data from Prisma
    const room = await getRoomData(roomId);

    if (!room) {
      return; // Handle case where the room doesn't exist
    }

    // Emit the room update to the connected players
    io.to(roomId).emit('roomUpdate', {
      player2Id: room.player2Id,
    });
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected');
  });
});

httpServer.listen(3001, () => {
  console.log('Socket server running on port 3001');
});
