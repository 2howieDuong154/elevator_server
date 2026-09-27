import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { ElevatorSnapshot } from '../common/elevatorCommon';


const ELEVATOR_UPDATE_EVENT = 'elevator:update';

export class SocketService {
  private readonly io: SocketIOServer;

  constructor(httpServer: HttpServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`[Socket] Client connected: ${socket.id}`);

      socket.on('disconnect', () => {
        console.log(`[Socket] Client disconnected: ${socket.id}`);
      });
    });
  }

  /**
   * Get snapshot of all elevators on each tick and broadcast to all connected clients.
   */
  public broadcastSnapshot(snapshots: ElevatorSnapshot[]): void {
    this.io.emit(ELEVATOR_UPDATE_EVENT, snapshots);
  }
}