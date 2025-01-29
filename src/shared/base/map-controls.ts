import { PerspectiveCamera } from "three";
import { MapControls } from "three/examples/jsm/Addons.js";
import { DEFAULT_MAP_CONTROLS_OPTIONS, ThreeDRendererMapControlsOptions } from "../options/map-controls-options";

export class ThreeDRendererMapControls extends MapControls {

  private _resetKey: string;

  constructor(
    camera: PerspectiveCamera,
    viewportElement: HTMLDivElement,
    initOptions?: Partial<ThreeDRendererMapControlsOptions>) {

    super(camera, viewportElement);
    const options = {
      ...DEFAULT_MAP_CONTROLS_OPTIONS,
      ...initOptions
    };
    this.enabled = false;
    this._resetKey = 'Escape';

  }
}