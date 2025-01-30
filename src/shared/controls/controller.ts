import { PerspectiveCamera } from "three";
import { Web3dComponentOrbitControls } from "./orbit-controls";
import { Web3dComponentFirstPersonControls } from "./first-person-controls";
import { Web3dComponentWorld } from '../base/world';

export interface Web3dComponentController {
  camera: PerspectiveCamera;
  controls: Web3dComponentOrbitControls | Web3dComponentFirstPersonControls;
  requestAnimationFrameId: number
}

export enum WEB_3D_COMPONENT_CONTROL_TYPE_ENUM {
  ORBIT = 'ORBIT',
  FIRST_PERSON = 'FIRST_PERSON'
}

export class Web3dComponentControllers<W extends Web3dComponentWorld> {

  items: Map<string, Web3dComponentController> = new Map();

  world: W;

  constructor(world: W) {
    this.world = world;
  }

  public add(key: WEB_3D_COMPONENT_CONTROL_TYPE_ENUM, camera: PerspectiveCamera, controls: Web3dComponentOrbitControls | Web3dComponentFirstPersonControls): void {
    if (this.items.has(key)) return;
    this.items.set(key, { camera, controls, requestAnimationFrameId: 0 });
  }

  public remove(key: WEB_3D_COMPONENT_CONTROL_TYPE_ENUM): void {
    if (!this.items.has(key)) return;
    this.items.delete(key);
  }

  public get enabledController(): Web3dComponentController | null {
    let enabledItem = null;
    this.items.forEach(c => {
      if (c.controls.enabled) {
        enabledItem = c;
      }
    })
    return enabledItem;
  }

  public switch(key: WEB_3D_COMPONENT_CONTROL_TYPE_ENUM): void {
    if (!this.items.has(key)) return;
    const startItem = this.items.get(key);
    if (!startItem) return;
    if (startItem.controls.enabled) return;
    let stopItem = null;
    this.items.forEach(c => {
      if (c.controls.enabled) {
        stopItem = this.stop(c);
      }
    });
    if (stopItem) {
      this.start(startItem, stopItem);
    }
  }

  public stop(c: Web3dComponentController): Web3dComponentController {
    if (c.controls instanceof Web3dComponentFirstPersonControls) {
      cancelAnimationFrame(c.requestAnimationFrameId);
      c.requestAnimationFrameId = 0;
    }
    c.controls.enabled = false;
    return c;
  }

  public start(startItem: Web3dComponentController, stopItem: Web3dComponentController): void {
    startItem.controls.enabled = true;
    if (startItem.controls instanceof Web3dComponentOrbitControls) {
      startItem.controls.update();
      this.world.render();
      return;
    }
    if (startItem.controls instanceof Web3dComponentFirstPersonControls) {
      // const distanceToTarget = this._getDistanceToTarget(stopItem.controls);
      // startItem.controls.sphericalRadius = distanceToTarget;
      // startItem.controls.lookAt(stopItem.controls.target);
      startItem.camera.position.x = stopItem.controls.target.x;
      startItem.camera.position.y = stopItem.controls.target.y;
      startItem.camera.position.z = stopItem.controls.target.z;
      startItem.controls.lookAt(this.world.options.worldOrigin.x, this.world.options.worldOrigin.z, this.world.options.worldOrigin.z);
      startItem.controls.update(0);
      this.startFirstPersonAnimation(startItem);
    }
  }


  public startFirstPersonAnimation(startItem: Web3dComponentController): void {
    this.animateFirstPerson(startItem)(window.performance.now());
  }

  public animateFirstPerson(startItem: Web3dComponentController) {
    return (newTime: number) => {
      startItem.requestAnimationFrameId = requestAnimationFrame(this.animateFirstPerson(startItem));
      startItem.controls.update(0.1);
      this.world.tick(0);
      this.world.render()
    }
  }

  private _getDistanceToTarget(controls: Web3dComponentOrbitControls | Web3dComponentFirstPersonControls): number {
    let d = 0;
    if (controls instanceof Web3dComponentOrbitControls) {
      d = controls.distanceToTarget;
    }
    return d;
  }
}