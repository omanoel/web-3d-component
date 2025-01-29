import { Box3, Object3D, Vector3 } from 'three';

export class SharedBoundingBoxUtil {
  public static computeFromObj(obj: Object3D): Vector3[] {
    const bbox = new Box3().setFromObject(obj);
    return [bbox.min, bbox.max];
  }
  public static computeFromObjects(objs: Object3D[]): Vector3[] {
    const bbox = new Box3();
    objs.forEach((obj) => {
      bbox.union(new Box3().setFromObject(obj));
    });
    return [bbox.min, bbox.max];
  }
}
