import React, { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props) => {
  const socket = useMemo(
    () =>
      io("ws://localhost:8000", {
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 3000, // Retry every 3 seconds
        transports: ["websocket", "polling"], // Ensure WebSocket is used
      }),
    []
  );

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
