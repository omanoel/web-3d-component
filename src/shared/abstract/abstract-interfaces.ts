import { Object3D, Vector3 } from 'three';

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



