import {
  Controls,
  MathUtils,
  PerspectiveCamera,
  Spherical,
  Vector3
} from 'three';

export interface FirstPersonControlsJsmEventMap {
  // nothing there...
}

export class FirstPersonControlsJsm extends Controls<FirstPersonControlsJsmEventMap> {

  movementSpeed = 1.0;
  lookSpeed = 0.005;
  lookVertical = true;
  autoForward = false;

  activeLook = true;

  heightSpeed = false;
  heightCoef = 1.0;
  heightMin = 0.0;
  heightMax = 1.0;

  constrainVertical = false;
  verticalMin = 0;
  verticalMax = Math.PI;

  mouseDragOn = false;

  target = new Vector3();

  sphericalRadius = 1;

  domElement: HTMLElement | null;

  // internals
  private _autoSpeedFactor = 0.0;

  private _pointerX = 0;
  private _pointerY = 0;

  private _moveForward = false;
  private _moveBackward = false;
  private _moveLeft = false;
  private _moveRight = false;
  private _moveUp = false;
  private _moveDown = false;

  private _viewHalfX = 0;
  private _viewHalfY = 0;

  private _lat = 0;
  private _lon = 0;

  private _lookDirection = new Vector3();
  private _spherical = new Spherical();
  private _target = new Vector3();

  private _onPointerDown: (event: MouseEvent) => void;
  private _onPointerUp: (event: MouseEvent) => void;
  private _onPointerMove: (event: MouseEvent) => void;
  private _onKeyDown: (event: KeyboardEvent) => void;
  private _onKeyUp: (event: KeyboardEvent) => void;
  private _onContextMenu: (event: MouseEvent) => void;

  constructor(camera: PerspectiveCamera, domElement: HTMLElement | null) {

    super(camera, domElement);

    this.domElement = domElement;

    // event listeners
    this._onPointerDown = (event: MouseEvent) => {
      this._handlePointerDown(event);
    }
    this._onPointerUp = (event: MouseEvent) => {
      this._handlePointerUp(event);
    }
    this._onPointerMove = (event: MouseEvent) => {
      this._handlePointerMove(event);
    }
    this._onKeyDown = (event: KeyboardEvent) => {
      this._handleKeyDown(event);
    }
    this._onKeyUp = (event: KeyboardEvent) => {
      this._handleKeyUp(event);
    }
    this._onContextMenu = (event: MouseEvent) => {
      this._handleContextMenu(event);
    }

    //
    if (this.domElement !== null) {
      this.connect();
      this.handleResize();
    }
    this._setOrientation();
  }

  public connect(): void {
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    this.domElement?.addEventListener('pointermove', this._onPointerMove);
    this.domElement?.addEventListener('pointerdown', this._onPointerDown);
    this.domElement?.addEventListener('pointerup', this._onPointerUp);
    this.domElement?.addEventListener('contextmenu', this._onContextMenu);
  }

  public disconnect(): void {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    this.domElement?.removeEventListener('pointerdown', this._onPointerMove);
    this.domElement?.removeEventListener('pointermove', this._onPointerDown);
    this.domElement?.removeEventListener('pointerup', this._onPointerUp);
    this.domElement?.removeEventListener('contextmenu', this._onContextMenu);
  }

  public dispose(): void {
    this.disconnect();
  }

  public handleResize(): void {
    if (this.domElement === null) {
      this._viewHalfX = window.innerWidth / 2;
      this._viewHalfY = window.innerHeight / 2;
    } else {
      this._viewHalfX = this.domElement.offsetWidth / 2;
      this._viewHalfY = this.domElement.offsetHeight / 2;
    }
  }

  public lookAt(x: number | Vector3, y?: number, z?: number): this {
    if (x instanceof Vector3) {
      this._target.copy(x);
    } else if (x !== undefined && y !== undefined && z !== undefined) {
      this._target.set(x, y, z);
    }
    this.object.lookAt(this._target);
    this._setOrientation();
    return this;
  }

  public update(delta: number): void {
    if (this.enabled === false) return;
    if (this.heightSpeed) {
      const y = MathUtils.clamp(this.object.position.y, this.heightMin, this.heightMax);
      const heightDelta = y - this.heightMin;
      this._autoSpeedFactor = delta * (heightDelta * this.heightCoef);
    } else {
      this._autoSpeedFactor = 0.0;
    }
    const actualMoveSpeed = delta * this.movementSpeed;
    if (this._moveForward || (this.autoForward && !this._moveBackward)) this.object.translateZ(- (actualMoveSpeed + this._autoSpeedFactor));
    if (this._moveBackward) this.object.translateZ(actualMoveSpeed);
    if (this._moveLeft) this.object.translateX(- actualMoveSpeed);
    if (this._moveRight) this.object.translateX(actualMoveSpeed);
    if (this._moveUp) this.object.translateY(actualMoveSpeed);
    if (this._moveDown) this.object.translateY(- actualMoveSpeed);
    let actualLookSpeed = delta * this.lookSpeed;
    if (!this.activeLook) {
      actualLookSpeed = 0;
    }
    let verticalLookRatio = 1;
    if (this.constrainVertical) {
      verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);
    }
    this._lon -= this._pointerX * actualLookSpeed;
    if (this.lookVertical) this._lat -= this._pointerY * actualLookSpeed * verticalLookRatio;
    this._lat = Math.max(- 85, Math.min(85, this._lat));
    let phi = MathUtils.degToRad(90 - this._lat);
    const theta = MathUtils.degToRad(this._lon);
    if (this.constrainVertical) {
      phi = MathUtils.mapLinear(phi, 0, Math.PI, this.verticalMin, this.verticalMax);
    }
    const position = this.object.position;
    this.target.setFromSphericalCoords(this.sphericalRadius, phi, theta).add(position);
    this.object.lookAt(this.target);
  }

  private _setOrientation(): void {
    const quaternion = this.object.quaternion;
    this._lookDirection.set(0, 0, - 1).applyQuaternion(quaternion);
    this._spherical.setFromVector3(this._lookDirection);
    this._lat = 90 - MathUtils.radToDeg(this._spherical.phi);
    this._lon = MathUtils.radToDeg(this._spherical.theta);
  }

  private _handlePointerMove(event: MouseEvent): void {
    if (this.enabled === false) return;
    if (this.domElement === null) {
      this._pointerX = event.pageX - this._viewHalfX;
      this._pointerY = event.pageY - this._viewHalfY;
    } else if (this.domElement !== null) {
      this._pointerX = event.pageX - this.domElement.offsetLeft - this._viewHalfX;
      this._pointerY = event.pageY - this.domElement.offsetTop - this._viewHalfY;
    }
  };

  private _handlePointerDown(event: MouseEvent): void {
    if (this.enabled === false) return;
    if (this.domElement !== null) {
      this.domElement.focus();
    }
    if (this.activeLook) {
      switch (event.button) {
        case 0: this._moveForward = true; break;
        case 2: this._moveBackward = true; break;
      }
    }
    this.mouseDragOn = true;
  };

  private _handlePointerUp(event: MouseEvent): void {
    if (this.enabled === false) return;
    if (this.activeLook) {
      switch (event.button) {
        case 0: this._moveForward = false; break;
        case 2: this._moveBackward = false; break;
      }
    }
    this.mouseDragOn = false;
  };

  private _handleContextMenu(event: MouseEvent): void {
    if (this.enabled === false) return;
    event.preventDefault();
  }

  private _handleKeyDown(event: KeyboardEvent): void {
    if (this.enabled === false) return;
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW': this._moveForward = true; break;
      case 'ArrowLeft':
      case 'KeyA': this._moveLeft = true; break;
      case 'ArrowDown':
      case 'KeyS': this._moveBackward = true; break;
      case 'ArrowRight':
      case 'KeyD': this._moveRight = true; break;
      case 'KeyR': this._moveUp = true; break;
      case 'KeyF': this._moveDown = true; break;
    }
  }

  private _handleKeyUp(event: KeyboardEvent): void {
    if (this.enabled === false) return;
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW': this._moveForward = false; break;
      case 'ArrowLeft':
      case 'KeyA': this._moveLeft = false; break;
      case 'ArrowDown':
      case 'KeyS': this._moveBackward = false; break;
      case 'ArrowRight':
      case 'KeyD': this._moveRight = false; break;
      case 'KeyR': this._moveUp = false; break;
      case 'KeyF': this._moveDown = false; break;
    }
  }
}

