import { Group } from "three";
import { ICleanable } from "./abstract-interfaces";

export abstract class AbstractCleanableGroup<
  A extends ICleanable
> extends Group {
  constructor(actionable?: Partial<A>) {
    super();
    this.userData.cleanable = true;
    if (actionable !== undefined) {
      if (actionable.onClean !== undefined) {
        this.userData.onClean = actionable.onClean;
      }
    }
  }
}