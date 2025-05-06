import { PerspectiveCamera } from "three";
import { FirstPersonControlsJsm } from "../jsm/first-person-controls-jsm";

export class Web3dComponentFirstPersonControls extends FirstPersonControlsJsm {

  constructor(
    camera: PerspectiveCamera,
    viewportElement: HTMLDivElement) {

    super(camera, viewportElement);
    this.enabled = false;

  }
}