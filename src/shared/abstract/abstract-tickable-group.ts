import { Vector3 } from "three";
import { AbstractClickableGroup } from "./abstract-clickable-group";
import { ITickable } from "./abstract-interfaces";

export abstract class AbstractTickableGroup<
  A extends ITickable
> extends AbstractClickableGroup<A> {
  private _tickPos: Vector3;

  constructor(actionable?: Partial<A>) {
    super(actionable);
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