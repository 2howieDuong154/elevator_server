import { Router, Request as ExpressRequest, Response } from 'express';
import { Building } from '../controllers/buiding';
import { HallCallPayload, CarCallPayload } from '../common/elevatorCommon';
import { isValidDirection, isValidFloor } from '../common';


export function createElevatorRoutes(building: Building): Router {
  const router = Router();

  /**
   * POST /api/hall-call
   * Body: { floor: number, direction: 'UP' | 'DOWN' }
   */
  router.post('/hall-call', (req: ExpressRequest, res: Response) => {
    const { floor, direction } = req.body as HallCallPayload;

    if (!isValidFloor(floor) || !isValidDirection(direction)) {
      return res.status(400).json({ error: 'Invalid floor or direction' });
    }

    const assignedElevatorId = building.handleHallCall(floor, direction);
    return res.status(200).json({ assignedElevatorId });
  });

  /**
   * POST /api/car-call
   * Body: { elevatorId: number, floor: number }
   */
  router.post('/car-call', (req: ExpressRequest, res: Response) => {
    const { elevatorId, floor } = req.body as CarCallPayload;

    if (!isValidFloor(floor) || typeof elevatorId !== 'number') {
      return res.status(400).json({ error: 'Invalid elevatorId or floor' });
    }

    try {
      building.handleCarCall(elevatorId, floor);
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(404).json({ error: (err as Error).message });
    }
  });

  /**
   * POST /api/door/:elevatorId/hold
   * (keep  ◀▶).
   */
  router.post('/door/:elevatorId/hold', (req: ExpressRequest, res: Response) => {
    const elevatorId = Number(req.params.elevatorId);

    try {
      building.handleDoorHold(elevatorId);
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(404).json({ error: (err as Error).message });
    }
  });

  /**
   * POST /api/door/:elevatorId/close
   * Press( ▶◀) immediately.
   */
  router.post('/door/:elevatorId/close', (req: ExpressRequest, res: Response) => {
    const elevatorId = Number(req.params.elevatorId);

    try {
      building.handleDoorClose(elevatorId);
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(404).json({ error: (err as Error).message });
    }
  });

  /**
   * GET /api/elevators
   * Get init info of all elevators.
   */
  router.get('/elevators', (_req: ExpressRequest, res: Response) => {
    return res.status(200).json(building.getSnapshot());
  });

  return router;
}
