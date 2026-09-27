import { Direction } from '../models/constants';
import { Elevator } from '../models/elevator';
import { SchedulingStrategy } from './schedulingStrategy';


export class NearestElevatorStrategy implements SchedulingStrategy {
  private readonly PENALTY_WRONG_DIRECTION = 1000;

  public selectElevator(
    elevators: Elevator[],
    requestFloor: number,
    requestDirection: Direction.UP | Direction.DOWN
  ): Elevator {
    let bestElevator = elevators[0] as Elevator;
    let bestCost = this.calculateCost(bestElevator, requestFloor, requestDirection);

    for (let i = 1; i < elevators.length; i++) {
      const cost = this.calculateCost(elevators[i] as Elevator, requestFloor, requestDirection);
      if (cost < bestCost) {
        bestCost = cost;
        bestElevator = elevators[i] as Elevator;
      }
    }

    return bestElevator;
  }

  private calculateCost(
    elevator: Elevator,
    requestFloor: number,
    requestDirection: Direction.UP | Direction.DOWN
  ): number {
    const currentFloor = elevator.getCurrentFloor();
    const direction = elevator.getDirection();
    const distance = Math.abs(currentFloor - requestFloor);

    // Case 1: Elevator is idle, prioritize it
    if (direction === Direction.IDLE) {
      return distance;
    }

    const isSameDirection = direction === requestDirection; //Compareing the direction of the elevator and the request direction

    if (isSameDirection) {
      const isAheadOnPath =
        direction === Direction.UP ? requestFloor >= currentFloor : requestFloor <= currentFloor;

      // Case 2: Same direction and on the way -> high priority
      if (isAheadOnPath) {
        return distance;
      }
    }

    // Case 3: Opposite direction or already passed 
    return this.PENALTY_WRONG_DIRECTION + distance;
  }
}