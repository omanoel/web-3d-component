import { Controls, Intersection, Object3D, Vector3 } from 'three';
import { ThreeDRendererCamera } from './camera';
import { ThreeDRendererOrbitControls } from './orbit-controls';
import { ThreeDRendererRaycaster } from './raycaster';
import { ThreeDRendererResizer } from './resizer';
import { ThreeDRendererScene } from './scene';
import { ThreeDRendererWebGlRenderer } from './web-gl-renderer';
import { DEFAULT_WORLD_OPTIONS, ThreeDRendererWorldOptions } from '../options/world-options';
import { GetOptionValueUtil } from '../utils/get-option-value-util';
import { ITickParams } from '../abstract/abstract-group';
import { SharedBoundingBoxUtil } from '../utils/bounding-box-util';
import { FindObjectUtil } from '../utils/find-object-util';
import { MainGroup } from './main-group';

export class ThreeDRendererWorld {

  protected _viewportElement: HTMLDivElement;

  protected _renderer: ThreeDRendererWebGlRenderer;

  protected _camera: ThreeDRendererCamera;

  protected _scene: ThreeDRendererScene;

  protected _controls: ThreeDRendererOrbitControls;

  protected _raycaster: ThreeDRendererRaycaster;

  protected _resizer: ThreeDRendererResizer;

  protected _options: ThreeDRendererWorldOptions;

  protected _mainGroup: MainGroup;

  private _raytracerInteractions: Object3D[] = [];

  constructor(viewportElement: HTMLDivElement,
    initOptions?: Partial<ThreeDRendererWorldOptions>) {

    //
    this._viewportElement = viewportElement;

    this._options = {
      ...DEFAULT_WORLD_OPTIONS,
      ...initOptions
    };

    this._renderer = new ThreeDRendererWebGlRenderer(
      this._viewportElement,
    );

    this._scene = new ThreeDRendererScene();
    this._camera = new ThreeDRendererCamera(this._options.worldOrigin);
    this._controls = new ThreeDRendererOrbitControls(this._camera, this._viewportElement);
    this._raycaster = new ThreeDRendererRaycaster(this._viewportElement, this._renderer, this._scene, this._camera);

    this._resizer = new ThreeDRendererResizer(
      this._viewportElement,
      this._renderer,
      this._camera,
    );

    this._mainGroup = new MainGroup(this._options.worldOrigin);
    this._scene.add(this._mainGroup);

    // Handle events
    this._handleEvents();
  }


  public get options(): ThreeDRendererWorldOptions {
    return this._options;
  }

  public render(): void {
    this.tick(0);
    this._renderer.render(
      this._scene,
      this._camera,
    );
  }

  public animate(): void {
    // if (this._isAnimate) {
    //   requestAnimationFrame(this.animate);
    // }
    this.render();
  }

  /**
   * Add an object in scene
   * 
   * The position of this object is relative to world origin
   * 
   * If the objet has no position (set in userData.options), then the position will be world origin.
   * 
   * @param obj the object to add in scene
   */

  public addObject(obj: Object3D, interactWithRayCaster: boolean = false): void {
    this._mainGroup.add(obj);
    if (interactWithRayCaster) {
      this._raytracerInteractions.push(obj);
    }
    this._scene.addObject(obj);
  }
  public removeObjectById(id: number): void {
    this._scene.removeObjectById(id);
  }
  public getObjectById(id: number): Object3D | undefined {
    return this._scene.getObjectById(id);
  }
  public cleanScene(): void {
    this._scene.cleanScene();
    this._raytracerInteractions.length = 0;
    this._mainGroup.children.length = 0;
  }
  public dispose(): void {
    this._controls.dispose();
    this._raycaster.dispose();
  }
  public destroy(): void {
    this.dispose();
    this._scene.clear();
  }
  public resetView(): void {
    this._controls.resetView();
  }
  public focusView(objects: Object3D[]): void {
    const minMax = SharedBoundingBoxUtil.computeFromObjects(
      objects.length > 0 ? objects : this._scene.cleanableObjects
    );
    const newTargetPos = new Vector3(
      (minMax[1].x + minMax[0].x) / 2,
      (minMax[1].y + minMax[0].y) / 2,
      (minMax[1].z + minMax[0].z) / 2
    );
    const distanceMinMax = minMax[0].distanceTo(minMax[1]);
    this._controls.setTarget(newTargetPos);
    this._camera.position.set(
      newTargetPos.x - distanceMinMax,
      newTargetPos.y - distanceMinMax,
      newTargetPos.y + distanceMinMax
    );
    this._controls.update();
    this._controls.dispatchEvent({
      type: 'change'
    });
  }
  public hideByIds(ids: number[]): void {
    this._scene.hideByIds(ids);
    this.render();
  }
  public showByIds(ids: number[]): void {
    this._scene.showByIds(ids);
    this.render();
  }
  public showByType(type: string): void {
    this._scene.showByType(type);
    this.render();
  }
  public hideByType(type: string): void {
    this._scene.hideByType(type);
    this.render();
  }

  public tick(deltaTime: number): void {
    this._scene.tickableObjects.forEach(
      (t: Object3D) => {
        const distanceToCamera = t.userData.computeDistanceToCamera(
          this._camera.position
        );
        const tickParams: ITickParams = {
          distance: distanceToCamera,
          worldOrigin: GetOptionValueUtil.getVector3(this._options.worldOrigin),
          cameraPos: this._camera.position,
          targetPos: this._controls.target
        };
        if (t.userData.onTick !== undefined) {
          t.userData.onTick(deltaTime, tickParams);
        }
      }
    );
  }

  private _handleEvents(): void {
    this._handleRaycasterMouseOver();
    this._handleRaycasterMouseOut();
    this._handleRaycasterMouseDblClick();
    this._handleControlsChange();
    this._handleResize();
  }

  private _handleResize(): void {
    this._resizer.onResize = () => {
      this.render();
    };
  }

  private _handleRaycasterMouseOver(): void {
    this._raycaster.handleMouseOver = (intersected: Intersection) => {
      this._handleMouseOver(intersected);
      this.render();
    };
  }

  private _handleRaycasterMouseOut(): void {
    this._raycaster.handleMouseOut = (intersected: Intersection) => {
      this._handleMouseOut(intersected);
      this.render();
    };
  }

  private _handleRaycasterMouseDblClick(): void {
    this._raycaster.handleMouseDblClick = (intersected: Intersection) => {
      this._controls.enableDamping = true;
      this._controls.enabled = false;
      this._controls.setTarget(
        intersected.point
      );
      this.render();
      this._controls.enableDamping = false;
      this._controls.enabled = true;
      this._controls.update();
    };
  }

  private _handleControlsChange(): void {
    this._controls.handleChange = () => {
      const distance = this._controls.distanceToTarget;
      this.render();
    };

  }

  private _handleMouseOver(intersected: Intersection): void {
    this._raytracerInteractions.forEach(interactiveGroup => {
      interactiveGroup.userData.onMouseOver(intersected.point);
    })
    const objWithMouseOver = FindObjectUtil.findMethodMouseOver(
      intersected.object
    );
    if (objWithMouseOver !== undefined) {
      objWithMouseOver.userData.onMouseOver(
        intersected.point,
        objWithMouseOver
      );
    }
  }

  private _handleMouseOut(intersected: Intersection): void {
    this._raytracerInteractions.forEach(interactiveGroup => {
      interactiveGroup.userData.onMouseOut(intersected.point);
    })
    const objWithMouseOut = FindObjectUtil.findMethodMouseOut(
      intersected.object
    );
    if (objWithMouseOut !== undefined) {
      objWithMouseOut.userData.onMouseOut(intersected.point, objWithMouseOut);
    }
  }

}