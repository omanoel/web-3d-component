import { SharedPositionOptions } from "./common-options";

/**
 * Represents the options available to alter the properties
 * of the Camera object rendered by the library
 */
export interface Web3dComponentCameraOptions {
  /**
   * Camera frustum vertical field of view, from bottom to top of view, in degrees.
   *
   * @defaultValue 50
   */
  fov: number;
  /**
   * Aspect ratio
   *
   * @defaultValue 1
   */
  aspect: number;
  /**
   * Camera frustum near plane.
   *
   * @defaultValue 0.1
   */
  near: number;
  /**
   * Camera frustum far plane.
   *
   * @defaultValue 2000
   */
  far: number;
  /**
   * Representing the object's local position.
   *
   * @defaultValue (25, 25, 25)
   */
  position: SharedPositionOptions;
  /**
   * Representing the camera's initial target point.
   *
   * @efaultValue (0, 0, 0)
   */
  lookAt: SharedPositionOptions;
}

export const DEFAULT_CAMERA_OPTIONS: Web3dComponentCameraOptions = {
  fov: 50,
  aspect: 1,
  near: 0.1,
  far: 2000,
  position: {
    x: 175,
    y: 25,
    z: 25
  },
  lookAt: {
    x: 0,
    y: 0,
    z: 0
  }
};
