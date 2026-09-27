  export enum Direction {
    UP = 'UP',
    DOWN = 'DOWN',
    IDLE = 'IDLE',
  }

  export enum ElevatorState {
    MOVING = 'MOVING',
    STOPPED = 'STOPPED',
    DOOR_OPEN = 'DOOR_OPEN',
  }

  export const TOTAL_FLOORS = 10;
  export const TOTAL_ELEVATORS = 3;
  export const FLOOR_TRAVEL_TIME_MS = 2500;
  export const DOOR_OPEN_TIME_MS = 5000;   