import { AbstractCleanableGroup } from "./abstract-cleanable-group";
import { IClickable } from "./abstract-interfaces";

export abstract class AbstractClickableGroup<
  A extends IClickable
> extends AbstractCleanableGroup<A> {
  constructor(actionable?: Partial<A>) {
    super(actionable);
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