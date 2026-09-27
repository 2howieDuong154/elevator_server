import { Direction, ElevatorState } from './constants';

let requestIdCounter = 0;
export abstract class Request {

    public readonly id: number;
    public readonly floor: number;
    public readonly createdAt: number;

    constructor(floor: number) {
        this.id = ++requestIdCounter;
        this.floor = floor;
        this.createdAt = Date.now();
    }

      abstract describe(): string;
}

export class HallCallRequest extends Request {
    public readonly direction: Direction.UP | Direction.DOWN;

    constructor(floor: number, direction: Direction.UP | Direction.DOWN) {
        super(floor);
        this.direction = direction;
    }
    describe(): string {
      return `HallCall#${this.id} at floor ${this.floor} going ${this.direction}`;
    }
    
}

export class CarCall extends Request {
  public readonly elevatorId: number;

  constructor(floor: number, elevatorId: number) {
    super(floor);
    this.elevatorId = elevatorId;
  }

  describe(): string {
    return `CarCall#${this.id} to floor ${this.floor} inside elevator ${this.elevatorId}`;
  }
}