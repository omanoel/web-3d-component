import { Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, SphereGeometry, Vector3 } from "three";
import { MyWorld } from "./my-world";
import { WEB_3D_COMPONENT_CONTROL_TYPE_ENUM } from "../shared/controls/controller";
import { Web3dComponentFirstPersonControls } from "../shared/controls/first-person-controls";
import { Web3dComponentAxesHelper } from "../shared/helpers/axes-helper";
import { Web3dComponentCrossPointer } from "../shared/helpers/cross-pointer";
import { SphereGridHelper } from "../shared/helpers/sphere-grid-helper";

export class MyScene3 {

  constructor(private _world: MyWorld) { }

  public init(): void {

    this._world.cleanScene();
    this.addSphereGridHelper();
    this.addStar();
    this.addStar(new Vector3(30, 2, 1));
    this.addCrossPointer();
    this.addCustomAxesHelper();

    const camera = new PerspectiveCamera();
    const firstPersonControls = new Web3dComponentFirstPersonControls(camera, this._world.viewportElement);
    this._world.addController(WEB_3D_COMPONENT_CONTROL_TYPE_ENUM.FIRST_PERSON, camera, firstPersonControls);
    this._world.render();
  }

  public addSphereGridHelper(): void {
    const sphere = new SphereGridHelper(100, 64);
    this._world.addObject(sphere);
  }

  public addStar(position: Vector3 = new Vector3(0, 0, 0)): void {
    const geometry = new SphereGeometry(0.1, 32, 16);
    const material = new MeshBasicMaterial({ color: 0xffffff });
    const star = new Mesh(geometry, material);
    star.userData.cleanable = true;
    star.userData.clickable = true;
    star.userData.onMouseOver = (_pos: Vector3, _obj: Object3D) => {
      //
    };
    star.userData.options = {
      position: {}
    };
    star.userData.options.position.x = position.x;
    star.userData.options.position.y = position.y;
    star.userData.options.position.z = position.z;
    this._world.addObject(star);
  }

  public addCrossPointer(): void {
    const crossPointer = new Web3dComponentCrossPointer(this._world.distanceToTarget);
    this._world.addObject(crossPointer, true);
  }

  public addCustomAxesHelper(): void {
    const axesHelper = new Web3dComponentAxesHelper(this._world.distanceToTarget);
    this._world.addObject(axesHelper);
  }

}