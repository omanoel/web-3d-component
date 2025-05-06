import { Group, Object3D, Object3DEventMap, Vector3 } from "three";
import { SharedPositionOptions } from "../options/common-options";

/**
 * MainGroup contains all objects in scene
 * 
 * Position of MainGroup is set to (0, 0, 0), but this is the reference of world origin
 * 
 * So, all other objects are positioned relatively to world origin
 * 
 */
export class MainGroup extends Group {
  constructor(worldOrigin: SharedPositionOptions) {
    super();
    this.userData.options = {
      position: worldOrigin
    };
  }

  public override add(...objects: Object3D<Object3DEventMap>[]): this {
    objects.forEach(object => {
      if (object.userData.options === undefined) {
        object.userData.options = {
          position: this.userData.options.position
        }
      } else if (object.userData.options.position === undefined) {
        object.userData.options.position = this.userData.options.position;
      }
      const worldPos = new Vector3()
        .copy(object.userData.options.position)
        .sub(this.userData.options.position);
      object.position.set(worldPos.x, worldPos.y, worldPos.z);
    });
    super.add(...objects);
    return this;
  }
}