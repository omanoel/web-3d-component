import { Group, Vector3 } from "three";
import { IOnlyTickable } from "./abstract-interfaces";

export abstract class AbstractOnlyTickableGroup<
  A extends IOnlyTickable
> extends Group {
  private _tickPos: Vector3;

  constructor(actionable?: Partial<A>) {
    super();
    this.userData.tickable = true;
    this._tickPos = this.position;
    if (actionable !== undefined) {
      if (actionable.onTick !== undefined) {
        this.userData.onTick = actionable.onTick;
      }
    }
    this.userData.computeDistanceToCamera = (cameraPos: Vector3) => this._tickPos.distanceTo(cameraPos);
  }
}