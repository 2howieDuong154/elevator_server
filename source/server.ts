import express, { Express } from 'express';
import cors from 'cors';
import { createServer } from 'http';

import { SimulationLoop } from './services/simulationLoop';
import { SocketService } from './services/socketService';
import { createElevatorRoutes } from './routes/elevatorRoutes';
import { TOTAL_ELEVATORS } from './models/constants';
import { NearestElevatorStrategy } from './strategies/nearestElevatorStrategy';
import { Building } from './controllers/buiding';

const PORT =  9999;
function initial(): void {
  // Init Express app ----
  const app: Express = express();
  app.use(cors());
  app.use(express.json());


  const httpServer = createServer(app);

  const strategy = new NearestElevatorStrategy();
  const building = new Building(TOTAL_ELEVATORS, strategy);

  // create Socket.IO
  const socketService = new SocketService(httpServer);

  const simulationLoop = new SimulationLoop(building, (snapshots) => {
    socketService.broadcastSnapshot(snapshots);
  });

  app.use('/api', createElevatorRoutes(building));

  // Health check 
  app.get('/', (_req, res) => {
    res.json({ status: 'ok', message: 'Elevator Simulator API is running' });
  });

  // Start server + start simulation ----
  httpServer.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    simulationLoop.start();
    console.log('✅ Simulation loop started');
  });

  //  shutdown ----
  process.on('SIGINT', () => {
    console.log('\nShutting down...');
    simulationLoop.stop();
    httpServer.close(() => process.exit(0));
  });
}

initial();