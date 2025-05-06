import { PerspectiveCamera, Vector3 } from 'three';
import { DEFAULT_CAMERA_OPTIONS, Web3dComponentCameraOptions } from '../options/camera-options';
import { IConfigurable } from '../abstract/abstract-interfaces';
import { SharedPositionOptions } from '../options/common-options';
import { GetOptionValueUtil } from '../utils/get-option-value-util';

/**
 * Class to manage perspective camera
 *
 * - up set on z axis (used for orbit controls)
 */
export class Web3dComponentCamera extends PerspectiveCamera implements IConfigurable<Web3dComponentCameraOptions> {

  constructor(
    worldOrigin: SharedPositionOptions,
    initOptions?: Partial<Web3dComponentCameraOptions>
  ) {
    super();
    const options = {
      ...DEFAULT_CAMERA_OPTIONS,
      ...initOptions
    };
    this.fov = options.fov;
    this.aspect = options.aspect;
    this.near = options.near;
    this.far = options.far;
    const localPosition = new Vector3(
      options.position.x,
      options.position.y,
      options.position.z
    ).sub(GetOptionValueUtil.getVector3(worldOrigin));
    this.position.set(localPosition.x, localPosition.y, localPosition.z);
  }

  updateWithOptions(options: Partial<Web3dComponentCameraOptions>): void {
    this.fov = GetOptionValueUtil.getIfDefined(this.fov, options.fov);
    this.aspect = GetOptionValueUtil.getIfDefined(this.aspect, options.aspect);
    this.near = GetOptionValueUtil.getIfDefined(this.near, options.near);
    this.far = GetOptionValueUtil.getIfDefined(this.far, options.far);
    /*
    if (options.position !== undefined) {
      this.position.set(
        GetOptionValueUtil.getIfDefined(this.position.x, options.position.x),
        GetOptionValueUtil.getIfDefined(this.position.y, options.position.y),
        GetOptionValueUtil.getIfDefined(this.position.z, options.position.z)
      );
    }

    if (options.lookAt !== undefined) {
      this.lookAt(
        new Vector3(
          GetOptionValueUtil.getIfDefined(
            DEFAULT_CAMERA_OPTIONS.lookAt.x,
            options.lookAt.x
          ),
          GetOptionValueUtil.getIfDefined(
            DEFAULT_CAMERA_OPTIONS.lookAt.y,
            options.lookAt.y
          ),
          GetOptionValueUtil.getIfDefined(
            DEFAULT_CAMERA_OPTIONS.lookAt.z,
            options.lookAt.z
          )
        )
      );
    } */
  }
}
