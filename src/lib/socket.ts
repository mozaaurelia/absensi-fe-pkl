import { io, type Socket } from "socket.io-client";

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"
).replace(/\/api\/v1\/?$/, "");

let socket: Socket | null = null;

export function connectMessagesSocket(token: string): Socket {
  if (socket) {
    socket.auth = { token };
    if (!socket.connected) socket.connect();
    return socket;
  }

  socket = io(API_ORIGIN, {
    auth: { token },
    transports: ["websocket"],
    autoConnect: true,
  });

  return socket;
}

export function getMessagesSocket(): Socket | null {
  return socket;
}

export function disconnectMessagesSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
