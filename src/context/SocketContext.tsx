import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import io from 'socket.io-client';

// Define the type for the context
interface SocketContextType {
  socket: SocketIOClient.Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

// Create a default context value
const defaultContextValue: SocketContextType = {
  socket: null,
  connectSocket: () => {},
  disconnectSocket: () => {},
};

// Create the context
const SocketContext = createContext<SocketContextType>(defaultContextValue);

// Define the type for the provider's props
interface SocketProviderProps {
  children: ReactNode;
}

// SocketProvider component
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  // Function to connect to the socket
  const connectSocket = () => {
    const socketConnection = io(); // You can pass options like `{ path: '/socket' }` if needed
    setSocket(socketConnection);
  };

  // Function to disconnect from the socket
  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  // Clean up the socket connection on unmount
  useEffect(() => {
    // Connect when the component mounts
    connectSocket();

    return () => {
      // Clean up when the component unmounts
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to access the socket context
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
