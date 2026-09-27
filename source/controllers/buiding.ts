import { ElevatorSnapshot } from "../common/elevatorCommon";
import { Direction } from "../models/constants";
import { Elevator } from "../models/elevator";
import { SchedulingStrategy } from "../strategies/schedulingStrategy";

export class Building {
  private readonly elevators: Elevator[];
  private readonly strategy: SchedulingStrategy;

  constructor(totalElevators: number, strategy: SchedulingStrategy) {
    this.elevators = Array.from(
      { length: totalElevators },
      (_, index) => new Elevator(index + 1)
    );
    this.strategy = strategy;
  }

  /**
   * When user presses the call button on the floor.
   * return elevator id
   */
  public handleHallCall(floor: number, direction: Direction.UP | Direction.DOWN): number {
    const chosenElevator = this.strategy.selectElevator(this.elevators, floor, direction);
    chosenElevator.addHallCall(floor, direction);
    return chosenElevator.id;
  }

  /**
   * When user presses the call button inside the elevator.
   */
  public handleCarCall(elevatorId: number, floor: number): void {
    const elevator = this.findElevatorById(elevatorId);
    elevator.addCarCall(floor);
  }

  /**
   * When user presses the hold door button inside the elevator.
   */
  public handleDoorHold(elevatorId: number): void {
    const elevator = this.findElevatorById(elevatorId);
    console.log(elevator);
    elevator.holdDoor();
  }

  /**
   * When user presses the close door button inside the elevator.
   */
  public handleDoorClose(elevatorId: number): void {
    const elevator = this.findElevatorById(elevatorId);
    elevator.closeDoorImmediately();
  }

  /**
   * Run one step of the simulation, moving elevators and processing requests.
   */
  public step(): void {
    for (const elevator of this.elevators) {
      elevator.step();
    }
  }

  /**
   * Get information of all elevators.
   */
  public getSnapshot(): ElevatorSnapshot[] {
    return this.elevators.map((elevator) => elevator.getSnapshot());
  }

  private findElevatorById(elevatorId: number): Elevator {
    const elevator = this.elevators.find((el) => el.id === elevatorId);
    if (!elevator) {
      throw new Error(`Elevator with id ${elevatorId} not found`);
    }
    return elevator;
  }

}