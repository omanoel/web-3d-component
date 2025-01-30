import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { IConfigurable } from '../abstract/abstract-interfaces';
import { DEFAULT_ORBIT_CONTROLS_OPTIONS, Web3dComponentOrbitControlsOptions } from '../options/orbit-controls-options';
import { GetOptionValueUtil } from '../utils/get-option-value-util';

export class Web3dComponentOrbitControls extends OrbitControls implements IConfigurable<Web3dComponentOrbitControlsOptions> {

  private _resetKey: string;

  private _toggleEnabledKey: string;

  private _boundingChangeEvent: () => void;

  private _boundingKeydownEvent: (event: KeyboardEvent) => void;

  constructor(
    camera: PerspectiveCamera,
    viewportElement: HTMLDivElement,
    initOptions?: Partial<Web3dComponentOrbitControlsOptions>
  ) {
    super(camera, viewportElement);
    const options = {
      ...DEFAULT_ORBIT_CONTROLS_OPTIONS,
      ...initOptions
    };
    this._resetKey = 'Escape';
    this._toggleEnabledKey = 'Delete';
    this.minDistance = camera.near * 1.01;
    this.maxDistance = camera.far * 0.99;
    this.zoomSpeed = options.zoomSpeed;
    this.rotateSpeed = options.rotateSpeed;
    this._boundingChangeEvent = () => {
      this.handleChange();
    };
    this._boundingKeydownEvent = (event: KeyboardEvent) =>
      this.handleKeyDown(event);
    // this._controls.enableDamping = true;
    this.addEventListener('change', this._boundingChangeEvent);
    viewportElement.ownerDocument.addEventListener(
      'keydown',
      this._boundingKeydownEvent,
    );
  }

  public updateWithOptions(
    options: Partial<Web3dComponentOrbitControlsOptions>
  ): void {
    this._toggleEnabledKey = GetOptionValueUtil.getIfDefined(
      this._toggleEnabledKey,
      options.toggleEnabledKey
    );
    this._resetKey = GetOptionValueUtil.getIfDefined(
      this._resetKey,
      options.resetKey
    );
  }


  public handleChange(): void {
    // can be called from ouside for specific behavior
  }

  public handleKeyDown(event: KeyboardEvent): void {
    if (event.key === this._resetKey) {
      this.resetView();
    }
    if (event.key === this._toggleEnabledKey) {
      this.toggleEnabled();
    }
  }

  public tick(_delta: number): void {
    this.update();
  }

  public get distanceToTarget(): number {
    return this.target.distanceTo(this.object.position);
  }

  public setTarget(position: Vector3): void {
    this.target.set(position.x, position.y, position.z);
  }

  public resetView(): void {
    this.reset();
    this.dispatchEvent({
      type: 'change',
    });
  }

  public toggleEnabled(): void {
    this.enabled = !this.enabled;
  }
}