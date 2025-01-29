import { PerspectiveCamera } from "three";
import { FirstPersonControlsJsm } from "../jsm/first-person-controls-jsm";

export class ThreeDRendererFirstPersonControls extends FirstPersonControlsJsm {

  constructor(
    camera: PerspectiveCamera,
    viewportElement: HTMLDivElement) {

    super(camera, viewportElement);
    this.enabled = false;

  }
}