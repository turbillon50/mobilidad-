'use client';
import { useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { connectSocket, getSocket, SOCKET_EVENTS } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';

export const useSocket = ({ autoConnect = true } = {}): { socket: Socket | null } => {
  const socketRef = useRef<Socket | null>(null);
  const { tokens, isAuthenticated } = useAuthStore();
  useEffect(() => {
    if (!isAuthenticated || !tokens?.accessToken || !autoConnect) return;
    const socket = connectSocket(tokens.accessToken);
    socketRef.current = socket;
    socket.on(SOCKET_EVENTS.CONNECT, () => console.log('[Socket] Connected:', socket.id));
    socket.on(SOCKET_EVENTS.DISCONNECT, (reason: string) => console.log('[Socket] Disconnected:', reason));
    return () => { socket.off(SOCKET_EVENTS.CONNECT); socket.off(SOCKET_EVENTS.DISCONNECT); };
  }, [isAuthenticated, tokens?.accessToken, autoConnect]);
  return { socket: socketRef.current };
};

export const useSocketEvent = <T>({ event, handler, enabled = true }: { event: string; handler: (data: T) => void; enabled?: boolean }): void => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  useEffect(() => {
    if (!enabled) return;
    const socket = getSocket();
    const wrapped = (data: T) => handlerRef.current(data);
    socket.on(event, wrapped);
    return () => { socket.off(event, wrapped); };
  }, [event, enabled]);
};

export const useSocketEmit = () => {
  const emit = useCallback(<T>(event: string, data?: T) => {
    const socket = getSocket();
    if (socket.connected) socket.emit(event, data);
    else console.warn('[Socket] Cannot emit – not connected:', event);
  }, []);
  return { emit };
};