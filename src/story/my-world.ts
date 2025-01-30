import { Object3D, PerspectiveCamera, PCFSoftShadowMap } from 'three';
import { MyScene3 } from './my-scene-3';
import { MyScene0 } from './my-scene-0';
import { MyScene1 } from './my-scene-1';
import { ITickParams } from '../shared/abstract/abstract-interfaces';
import { Web3dComponentControllers, WEB_3D_COMPONENT_CONTROL_TYPE_ENUM } from '../shared/controls/controller';
import { Web3dComponentFirstPersonControls } from '../shared/controls/first-person-controls';
import { Web3dComponentOrbitControls } from '../shared/controls/orbit-controls';
import { Web3dComponentWorld } from '../shared/base/world';
import { GetOptionValueUtil } from '../shared/utils/get-option-value-util';

export class MyWorld extends Web3dComponentWorld {

  public isAvailable = false;

  private _controllers: Web3dComponentControllers<Web3dComponentWorld> = new Web3dComponentControllers(this);

  constructor(viewportElement: HTMLDivElement) {
    super(viewportElement);
    this.isAvailable = true;
    if (this._renderer !== undefined) {
      this._controllers.add(WEB_3D_COMPONENT_CONTROL_TYPE_ENUM.ORBIT, this._camera, this._controls);
    }
  }


  public override render(): void {
    if (!this._controllers.enabledController) return;
    this.tick(0);
    this._renderer.render(
      this._scene,
      this._controllers.enabledController.camera,
    );
  }

  public override tick(deltaTime: number): void {
    if (!this._controllers.enabledController) return;
    const cameraPos = this._controllers.enabledController.camera.position.clone();
    const targetPos = this._controllers.enabledController.controls.target;
    this._scene.tickableObjects.forEach(
      (t: Object3D) => {
        const distanceToCamera = t.userData.computeDistanceToCamera(
          this._camera.position
        );
        const tickParams: ITickParams = {
          distance: distanceToCamera,
          worldOrigin: GetOptionValueUtil.getVector3(this._options.worldOrigin),
          cameraPos,
          targetPos
        };
        if (t.userData.onTick !== undefined) {
          t.userData.onTick(deltaTime, tickParams);
        }
      }
    );
  }

  public get viewportElement(): HTMLDivElement {
    return this._viewportElement;
  }

  public get distanceToTarget(): number {
    return this._controls.distanceToTarget;
  }

  public triggerEvent(eventId: string): void {
    switch (eventId) {
      case 'reset':
        this.cleanScene();
        this.render();
        // this._mainGroup.clear();
        break;
      case 'clear':
        this.cleanScene();
        this.render();
        // this._mainGroup.clear();
        break;
      case 'scene-0':
        this.initScene0();
        break;
      case 'scene-1':
        this.initScene1();
        break;
      case 'scene-2':
        this.initScene2();
        break;
      case 'scene-3':
        this.initScene3();
        break;
      case 'switch-orbit-controls':
        this.switchControls(WEB_3D_COMPONENT_CONTROL_TYPE_ENUM.ORBIT);
        break;
      case 'switch-fp-controls':
        this.switchControls(WEB_3D_COMPONENT_CONTROL_TYPE_ENUM.FIRST_PERSON);
        break;

      default:
        break;
    }
  }

  public addController(key: WEB_3D_COMPONENT_CONTROL_TYPE_ENUM, camera: PerspectiveCamera, controls: Web3dComponentOrbitControls | Web3dComponentFirstPersonControls): void {
    this._controllers.add(key, camera, controls);
  }

  public initScene0(): void {
    const myScene = new MyScene0(this);
    myScene.init();
  }

  public initScene1(): void {
    const myScene = new MyScene1(this);
    myScene.init();

  }

  public initScene2(): void {
    const myScene = new MyScene1(this);
    myScene.init();
  }

  public initScene3(): void {
    const myScene = new MyScene3(this);
    myScene.init();
  }

  public switchControls(key: WEB_3D_COMPONENT_CONTROL_TYPE_ENUM): void {
    this._controllers.switch(key);
  }

  public updateRendererToComputeShadows(): void {
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = PCFSoftShadowMap;
  }
}