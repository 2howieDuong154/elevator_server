import { Direction } from "../models/constants";
import { Elevator } from "../models/elevator";

export interface SchedulingStrategy {
  selectElevator(
    elevators: Elevator[],
    requestFloor: number,
    requestDirection: Direction.UP | Direction.DOWN
  ): Elevator;
}