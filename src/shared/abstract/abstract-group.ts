import { Group, Object3D, Vector3 } from 'three';

export interface ITickParams {
  distance: number;
  cameraPos: Vector3;
  worldOrigin: Vector3;
  targetPos: Vector3;
}

export interface IConfigurable<OPT> {
  updateWithOptions(options: Partial<OPT>): void;
}

export interface IOnlyTickable {
  onTick?(deltaTime: number, params?: ITickParams): void;
}

export interface IOnlyClickable {
  onMouseOver?(event: Event, object: Object3D): void;
  onMouseOut?(event: Event, object: Object3D): void;
  onMouseDblClick?(event: Event, object: Object3D): void;
}

export interface ICleanable {
  onClean?(event: Event, object: Object3D): void;
}

export interface IClickable extends IOnlyClickable, ICleanable {
  //
}

export interface ITickable extends IOnlyTickable, IClickable {
  //
}


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
    this.userData.computeDistanceToCamera = (cameraPos: Vector3) => {
      return this._tickPos.distanceTo(cameraPos);
    };
  }
}

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
    this.userData.computeDistanceToCamera = (cameraPos: Vector3) => {
      return this._tickPos.distanceTo(cameraPos);
    };
  }
}

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
