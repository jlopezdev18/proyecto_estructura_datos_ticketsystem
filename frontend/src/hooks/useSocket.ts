import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";




export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
    setSocket(socket);
  }, []);

  return socket;
}