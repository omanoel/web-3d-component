import { PerspectiveCamera } from "three";
import { FirstPersonControlsJsm } from "../jsm/first-person-controls-jsm";
import { ThreeDRendererOrbitControls } from "../base/orbit-controls";
import { ThreeDRendererFirstPersonControls } from "../base/first-person-controls";
import { ThreeDRendererWorld } from '../base/world';
import { MyWorld } from "../my-world";

export interface ThreeDRendererController {
  camera: PerspectiveCamera;
  controls: ThreeDRendererOrbitControls | ThreeDRendererFirstPersonControls;
  requestAnimationFrameId: number
}

export class ThreeDRendererControllers {

  items: Map<string, ThreeDRendererController> = new Map();
  world: MyWorld;

  constructor(world: MyWorld) {
    this.world = world;
  }

  public add(key: string, camera: PerspectiveCamera, controls: ThreeDRendererOrbitControls | ThreeDRendererFirstPersonControls): void {
    if (this.items.has(key)) return;
    this.items.set(key, { camera: camera, controls: controls, requestAnimationFrameId: 0 });
  }

  public remove(key: string): void {
    if (!this.items.has(key)) return;
    this.items.delete(key);
  }

  public get enabledController(): ThreeDRendererController | null {
    let enabledItem = null;
    this.items.forEach(c => {
      if (c.controls.enabled) {
        enabledItem = c;
      }
    })
    return enabledItem;
  }

  public switch(key: string): void {
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

  public stop(c: ThreeDRendererController): ThreeDRendererController {
    if (c.controls instanceof ThreeDRendererFirstPersonControls) {
      cancelAnimationFrame(c.requestAnimationFrameId);
      c.requestAnimationFrameId = 0;
    }
    c.controls.enabled = false;
    return c;
  }

  public start(startItem: ThreeDRendererController, stopItem: ThreeDRendererController): void {
    startItem.controls.enabled = true;
    if (startItem.controls instanceof ThreeDRendererOrbitControls) {
      startItem.controls.setTarget(stopItem.controls.target);
      startItem.controls.update();
      this.world.render();
      return;
    }
    if (startItem.controls instanceof ThreeDRendererFirstPersonControls) {
      const distanceToTarget = this._getDistanceToTarget(stopItem.controls);
      startItem.controls.sphericalRadius = distanceToTarget;
      startItem.controls.lookAt(stopItem.controls.target);
      startItem.controls.update(0);
      this.startFirstPersonAnimation(startItem);
    }
  }


  public startFirstPersonAnimation(startItem: ThreeDRendererController): void {
    this.animateFirstPerson(startItem)(window.performance.now());
  }

  public animateFirstPerson(startItem: ThreeDRendererController) {
    return (newTime: number) => {
      startItem.requestAnimationFrameId = requestAnimationFrame(this.animateFirstPerson(startItem));
      startItem.controls.update(0.1);
      this.world.tick(0);
      this.world.render()
    }
  }

  private _getDistanceToTarget(controls: ThreeDRendererOrbitControls | ThreeDRendererFirstPersonControls): number {
    let d = 0;
    if (controls instanceof ThreeDRendererOrbitControls) {
      d = controls.distanceToTarget;
    }
    return d;
  }
}