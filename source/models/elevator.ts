import { Direction, ElevatorState, FLOOR_TRAVEL_TIME_MS, DOOR_OPEN_TIME_MS } from './constants';
import { ElevatorSnapshot } from '../common/elevatorCommon';
import { log } from 'console';

export class Elevator {
  public readonly id: number;
  private currentFloor: number;
  private direction: Direction;
  private state: ElevatorState;
  private doorOpen: boolean;

  private upStops: Set<number> = new Set();
  private downStops: Set<number> = new Set();

  private doorTimer: ReturnType<typeof setTimeout> | null = null;
  private doorHeld: boolean = false; // true if someone is holding the door open
  private readonly minFloor: number;
  private readonly maxFloor: number;

  constructor(id: number, minFloor: number = 1, maxFloor: number = 10) {
    this.id = id;
    this.minFloor = minFloor;
    this.maxFloor = maxFloor;
    this.currentFloor = minFloor;
    this.direction = Direction.IDLE;
    this.state = ElevatorState.STOPPED;
    this.doorOpen = false;
  }


  public getCurrentFloor(): number {
    return this.currentFloor;
  }

  public getDirection(): Direction {
    return this.direction;
  }

  public getState(): ElevatorState {
    return this.state;
  }

  public isDoorOpen(): boolean {
    return this.doorOpen;
  }


  public addCarCall(floor: number): void {
    if (floor === this.currentFloor) return;

    if (floor > this.currentFloor) {
      this.upStops.add(floor);
    } else {
      this.downStops.add(floor);
    }

    this.updateDirectionIfIdle();
  }

  public addHallCall(floor: number, direction: Direction.UP | Direction.DOWN): void {
    if (floor === this.currentFloor && this.state !== ElevatorState.MOVING) {
      // If the elevator is at the requested floor and not moving, open the door immediately
      this.openDoor();
      return;
    }

    if (floor > this.currentFloor) {
      this.upStops.add(floor);
    } else if (floor < this.currentFloor) {
      this.downStops.add(floor);
    } else {
      return;
    }

    this.updateDirectionIfIdle();
  }

  /**
  * If the elevator is idle, determine its state based on the list uptops or downstops.
  */
  private updateDirectionIfIdle(): void {
    if (this.direction !== Direction.IDLE) return;

    if (this.upStops.size > 0) {
      this.direction = Direction.UP;
      this.state = ElevatorState.MOVING;
    } else if (this.downStops.size > 0) {
      this.direction = Direction.DOWN;
      this.state = ElevatorState.MOVING;
    }
  }

  public step(): void {

    if (this.state === ElevatorState.DOOR_OPEN || this.doorHeld) {
      return;
    }

    if (this.direction === Direction.IDLE) {
      return;
    }

    if (this.direction === Direction.UP) {
      // Example: if currentFloor is 10 and maxFloor is 10, it will stay at 10
      this.currentFloor = Math.min(this.currentFloor + 1, this.maxFloor);
    } else if (this.direction === Direction.DOWN) {
      //It is similar to the above, if currentFloor is 1 and minFloor is 1, it will stay at 1
      this.currentFloor = Math.max(this.currentFloor - 1, this.minFloor);
    }

    this.checkShouldStopAtCurrentFloor();
  }

  private checkShouldStopAtCurrentFloor(): void {
    const floor = this.currentFloor;

    const shouldStopGoingUp = this.direction === Direction.UP && this.upStops.has(floor);
    const shouldStopGoingDown = this.direction === Direction.DOWN && this.downStops.has(floor);

    if (shouldStopGoingUp || shouldStopGoingDown) {
      this.arriveAndStop(floor);
      return;
    }

    this.updateDirectionBasedOnPendingStops();
  }

  /**
  * Stopping when arriving at a floor means removing that floor from the stops queue, changing the state to STOPPED, and opening the door.
  */
  private arriveAndStop(floor: number): void {
    this.upStops.delete(floor);
    this.downStops.delete(floor);
    this.state = ElevatorState.STOPPED;
    this.openDoor();
  }

  private updateDirectionBasedOnPendingStops(): void {

    if (this.currentFloor >= this.maxFloor && this.direction === Direction.UP) {
      if (this.downStops.size > 0) {
        this.direction = Direction.DOWN;
        return;
      }
      this.direction = Direction.IDLE;
      this.state = ElevatorState.STOPPED;
      return;
    }

    if (this.currentFloor <= this.minFloor && this.direction === Direction.DOWN) {
      if (this.upStops.size > 0) {
        this.direction = Direction.UP;
        return;
      }
      this.direction = Direction.IDLE;
      this.state = ElevatorState.STOPPED;
      return;
    }

    const hasMoreInCurrentDirection =
      this.direction === Direction.UP
        ? [...this.upStops].some(floor => floor > this.currentFloor)
        : [...this.downStops].some(floor => floor < this.currentFloor);

    if (hasMoreInCurrentDirection) return;

    // Check if there remain requests 
    if (this.direction === Direction.UP && this.downStops.size > 0) {
      this.direction = Direction.DOWN;
    } else if (this.direction === Direction.DOWN && this.upStops.size > 0) {
      this.direction = Direction.UP;
    } else {
      this.direction = Direction.IDLE;
      this.state = ElevatorState.STOPPED;
    }
  }


  // Operations door=========================

  public openDoor(): void {
    this.doorOpen = true;
    this.state = ElevatorState.DOOR_OPEN;
    this.resetDoorTimer();
  }

  /**
   * The user hold (◀▶) button 
   */
  public holdDoor(): void {
    log(`Elevator ${this.id} hold door button pressed.`);
    if (this.doorOpen) return;
    // this.doorHeld = true;
    // if (this.doorTimer) clearTimeout(this.doorTimer);
    this.openDoor();
  }

  /**
   * The user presses the close door button (▶◀).
   */
  public closeDoorImmediately(): void {
    log(`Elevator ${this.id} close door button pressed.`);
    console.log("1.", this.doorTimer);
    if (this.doorTimer) clearTimeout(this.doorTimer);
    console.log("2.", this.doorTimer);
    this.finishClosingDoor();
  }

  private resetDoorTimer(): void {
    if (this.doorTimer) clearTimeout(this.doorTimer);
    this.doorTimer = setTimeout(() => {
      if (!this.doorHeld) {
        this.finishClosingDoor();
      }
    }, DOOR_OPEN_TIME_MS);
  }

  private finishClosingDoor(): void {
    this.doorOpen = false;
    this.doorHeld = false;
    this.updateDirectionBasedOnPendingStops();
    if (this.direction !== Direction.IDLE) {
      this.state = ElevatorState.MOVING;
    }
    console.log("3.", "Door closed.");
  }

  public getSnapshot(): ElevatorSnapshot {
    return {
      id: this.id,
      currentFloor: this.currentFloor,
      direction: this.direction,
      state: this.state,
      doorOpen: this.doorOpen,
      stopsQueue: [...this.upStops, ...this.downStops].sort((a, b) => a - b),
    };
  }
}