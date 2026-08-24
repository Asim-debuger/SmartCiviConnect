import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import SocketContext from "./SocketContextValue";
import { useAuthContext } from "./AuthContext";

const socketUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/api\/?$/, "") || "http://localhost:5000";

export function SocketProvider({ children }) {
  const { token } = useAuthContext();
  const [socket] = useState(() => io(socketUrl, { autoConnect: false }));

  useEffect(() => {
    if (token) {
      socket.auth = { token };
      socket.connect();
    } else {
      socket.disconnect();
    }
    return () => socket.disconnect();
  }, [socket, token]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
