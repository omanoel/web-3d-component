import { Group } from "three";
import { IOnlyClickable } from "./abstract-interfaces";

export abstract class AbstractOnlyClickableGroup<
  A extends IOnlyClickable
> extends Group {
  constructor(actionable?: Partial<A>) {
    super();
    this.userData.clickable = true;
    if (actionable !== undefined) {
      if (actionable.onMouseOut !== undefined) {
        this.userData.onMouseOut = actionable.onMouseOut;
      }
      if (actionable.onMouseOver !== undefined) {
        this.userData.onMouseOver = actionable.onMouseOver;
      }
      if (actionable.onMouseDblClick !== undefined) {
        this.userData.onMouseDblClick = actionable.onMouseDblClick;
      }
    }
  }
}
