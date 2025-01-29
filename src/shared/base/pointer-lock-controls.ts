import { PerspectiveCamera } from "three";
import { PointerLockControls } from "three/examples/jsm/Addons.js";
import { DEFAULT_POINTER_LOCK_CONTROLS_OPTIONS, ThreeDRendererPointerLockControlsOptions } from "../options/pointer-lock-controls-options";

export class ThreeDRendererPointerLockControls extends PointerLockControls {

  constructor(
    camera: PerspectiveCamera,
    viewportElement: HTMLDivElement,
    initOptions?: Partial<ThreeDRendererPointerLockControlsOptions>) {

    super(camera, viewportElement);
    const options = {
      ...DEFAULT_POINTER_LOCK_CONTROLS_OPTIONS,
      ...initOptions
    };
    this.enabled = false;

  }
}