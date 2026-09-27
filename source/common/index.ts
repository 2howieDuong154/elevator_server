import { Direction } from "../models/constants";

function isValidFloor(floor: unknown): floor is number {
  return typeof floor === 'number' && Number.isInteger(floor);
}

function isValidDirection(direction: unknown): direction is Direction.UP | Direction.DOWN {
  return direction === Direction.UP || direction === Direction.DOWN;
}

export { isValidFloor, isValidDirection };