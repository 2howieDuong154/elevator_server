import { ElevatorSnapshot } from '../common/elevatorCommon';
import { Building } from '../controllers/buiding';
import { FLOOR_TRAVEL_TIME_MS } from '../models/constants';


export class SimulationLoop {
  private readonly building: Building;
  private readonly onTick: (snapshots: ElevatorSnapshot[]) => void;
  private intervalHandle: ReturnType<typeof setInterval> | null = null;

  /**
   * @param building  
   * @param onTick
   */
  constructor(building: Building, onTick: (snapshots: ElevatorSnapshot[]) => void) {
    this.building = building;
    this.onTick = onTick;
  }

  public start(): void {
    if (this.intervalHandle) return; 
    this.intervalHandle = setInterval(() => {
      this.building.step();
      const snapshots = this.building.getSnapshot();
      this.onTick(snapshots);
    }, FLOOR_TRAVEL_TIME_MS);
  }

  public stop(): void {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }
}