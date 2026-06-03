import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { verifyAccessToken } from '../services/auth.service';
import { query } from '../config/database';
import { getRedisClient } from '../config/redis';
import { logger } from '../utils/logger';
import { env } from '../config/env';

let io: SocketServer;

export function getIo(): SocketServer {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

export function initializeSocketServer(server: HttpServer): void {
  io = new SocketServer(server, {
    cors: { origin: env.CORS_ORIGINS.split(',').map(o => o.trim()), credentials: true },
    pingInterval: 25000,
    pingTimeout: 10000,
  });

  io.on('connection', (socket: Socket) => {
    logger.debug(`Socket connected: ${socket.id}`);

    socket.on('authenticate', async ({ token }: { token: string }) => {
      try {
        const payload = verifyAccessToken(token);
        const userId = payload.sub as string;
        const role = payload.role as string;
        (socket as Socket & { userId?: string }).userId = userId;
        (socket as Socket & { role?: string }).role = role;
        if (role === 'driver') {
          const { rows: [driver] } = await query(`SELECT id FROM drivers WHERE user_id=$1`, [userId]);
          if (driver) {
            (socket as Socket & { driverId?: string }).driverId = driver.id;
            socket.join(`driver:${driver.id}`);
            await getRedisClient().set(`socket:driver:${driver.id}`, socket.id, 'EX', 3600);
          }
        } else {
          socket.join(`passenger:${userId}`);
          await getRedisClient().set(`socket:passenger:${userId}`, socket.id, 'EX', 3600);
        }
        socket.emit('authenticated', { userId, role });
      } catch { socket.emit('auth_error', { message: 'Invalid token' }); socket.disconnect(true); }
    });

    socket.on('ride:join', ({ rideId }: { rideId: string }) => socket.join(`ride:${rideId}`));

    socket.on('driver:update_location', async ({ latitude, longitude, heading }: { latitude: number; longitude: number; heading?: number }) => {
      const s = socket as Socket & { driverId?: string };
      if (!s.driverId) return;
      try {
        await query(`UPDATE drivers SET current_latitude=$1, current_longitude=$2, location_geom=ST_SetSRID(ST_MakePoint($2,$1),4326)::geography, current_location_updated_at=NOW() WHERE id=$3`, [latitude, longitude, s.driverId]);
        await getRedisClient().geoadd('online_drivers', longitude, latitude, s.driverId);
        const { rows: [activeRide] } = await query(`SELECT passenger_id FROM rides WHERE driver_id=$1 AND status IN ('driver_en_route','arrived','in_progress') LIMIT 1`, [s.driverId]);
        if (activeRide) io.to(`passenger:${activeRide.passenger_id}`).emit('driver:location_updated', { driverId: s.driverId, latitude, longitude, heading, timestamp: new Date().toISOString() });
      } catch (err) { logger.error('driver:update_location error', err); }
    });

    socket.on('disconnect', async () => {
      const s = socket as Socket & { driverId?: string; userId?: string };
      if (s.driverId) await getRedisClient().del(`socket:driver:${s.driverId}`).catch(() => {});
      if (s.userId) await getRedisClient().del(`socket:passenger:${s.userId}`).catch(() => {});
    });
  });

  logger.info('Socket.io server initialized');
}