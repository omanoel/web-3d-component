import { Vector3 } from 'three';
import { SharedPositionOptions } from '../options/common-options';

export class GetOptionValueUtil {
  private constructor() {
    // Private constructor
  }

  public static getIfDefined<T>(
    originValue: T,
    ...newValues: (T | undefined)[]
  ): T {
    newValues.reverse();
    const newValue = newValues.find((value) => value !== undefined);
    return newValue !== undefined ? newValue : originValue;
  }

  public static getFixedValue(value: number): string {
    return value.toFixed(2).replace('.00', '');
  }

  public static getVector3(pos: SharedPositionOptions): Vector3 {
    return new Vector3(pos.x, pos.y, pos.z);
  }

  public static getWorldVector3(
    vec: Vector3,
    pos: SharedPositionOptions
  ): Vector3 {
    return new Vector3(pos.x, pos.y, pos.z).add(vec);
  }
}
