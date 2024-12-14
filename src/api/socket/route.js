import { Server } from "socket.io";

// Disable body parser for Socket.IO to work
export const config = {
  api: {
    bodyParser: false, // Disables Next.js body parsing so that the socket can handle the request directly
    externalResolver: true,
  },
};

// Define the handler
const handler = (req, res) => {
  if (req.method === 'GET') {
    // Initialize Socket.IO with the appropriate options
    const io = new Server(res.socket.server, {
      path: '/api/socket', // Set the path to match the client's connection attempts
      transports: ['polling', 'websocket'], // Enable both polling and WebSocket transports
    });

    // Handle new client connections
    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      // Add event listeners for your game logic, messaging, etc.
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    // Attach the Socket.IO server to the Node.js server
    res.socket.server.io = io;
    res.end();
  } else {
    res.status(405).end(); // Method Not Allowed for non-GET requests
  }
};

export default handler;
