import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, { autoConnect: false, transports: ['websocket', 'polling'], reconnection: true, reconnectionAttempts: 10 });
  }
  return socket;
};

export const connectSocket = (token: string): Socket => {
  const s = getSocket();
  s.auth = { token };
  if (!s.connected) s.connect();
  return s;
};

export const disconnectSocket = (): void => {
  if (socket?.connected) socket.disconnect();
};

export const SOCKET_EVENTS = {
  CONNECT: 'connect', DISCONNECT: 'disconnect', CONNECT_ERROR: 'connect_error',
  REQUEST_RIDE: 'ride:request', CANCEL_RIDE: 'ride:cancel',
  ACCEPT_OFFER: 'offer:accept', REJECT_OFFER: 'offer:reject',
  DRIVER_ONLINE: 'driver:online', DRIVER_OFFLINE: 'driver:offline',
  DRIVER_LOCATION: 'driver:location', SUBMIT_OFFER: 'offer:submit',
  OFFER_RECEIVED: 'offer:received', OFFER_UPDATED: 'offer:updated', OFFER_EXPIRED: 'offer:expired',
  TRIP_UPDATED: 'trip:updated', DRIVER_ARRIVED: 'driver:arrived',
  TRIP_STARTED: 'trip:started', TRIP_COMPLETED: 'trip:completed', TRIP_CANCELLED: 'trip:cancelled',
  LOCATION_UPDATE: 'location:update', NOTIFICATION: 'notification',
} as const;

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];