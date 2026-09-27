import { Direction, ElevatorState } from '../models/constants';

// The response will be sent to FE
export interface ElevatorSnapshot {
    id: number;
    currentFloor: number;
    direction: Direction;
    state: ElevatorState;
    doorOpen: boolean;
    stopsQueue: number[];
}

//When calling from the hall, only going up or down is allowed
export interface HallCallPayload {
  floor: number;
  direction: Direction.UP | Direction.DOWN;
}

//Inside the elevator (Carbin)
export interface CarCallPayload {
  elevatorId: number;
  floor: number;
}