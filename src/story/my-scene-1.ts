import { AmbientLight, AxesHelper, BoxGeometry, DirectionalLight, DoubleSide, GridHelper, Group, MathUtils, Mesh, MeshLambertMaterial, MeshPhongMaterial, Plane, PlaneGeometry, PlaneHelper, PolarGridHelper, Vector3 } from "three";

import { Sky } from "three/examples/jsm/Addons.js";
import { Web3dComponentAxesHelper } from "../shared/helpers/axes-helper";
import { MyWorld } from "./my-world";

export class MyScene1 {

  constructor(private _world: MyWorld) { }

  public init(): void {
    this._world.cleanScene();

    this._world.updateRendererToComputeShadows();
    this.addDirectionalLight();
    this.addSky();
    this.addCubePhong();
    this.addAmbientLight();
    this.addAxesHelper();
    this.addCustomAxesHelper();
    this.addFloor();
    this._world.render();

  }

  public addCube(mainGroup: Group): void {

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshLambertMaterial({ color: 0x049ef4 });

    const mesh = new Mesh(geometry, material);
    mesh.castShadow = true;
    mainGroup.add(mesh);

  }

  public addCubePhong(): void {

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshPhongMaterial({ color: 0x049ef4 });

    const mesh = new Mesh(geometry, material);
    mesh.position.setY(5);
    this._world.addObject(mesh);

  }

  public addSky(): void {

    const sky = new Sky();
    sky.scale.setScalar(10000);

    const phi = MathUtils.degToRad(90);
    const theta = MathUtils.degToRad(0);
    const sunPosition = new Vector3().setFromSphericalCoords(1, phi, theta);

    sky.material.uniforms.sunPosition.value = sunPosition;

    this._world.addObject(sky);
  }

  public addCameraLight(): void {

  }

  public addAmbientLight(): void {

    const ambientLight = new AmbientLight(0xffffff, 0.2);
    this._world.addObject(ambientLight);
  }

  public addPolarGridHelper(): void {
    const radius = 10;
    const sectors = 16;
    const rings = 8;
    const divisions = 64;

    const helper = new PolarGridHelper(radius, sectors, rings, divisions);
    this._world.addObject(helper);
  }

  public addPlaneHelper(): void {
    const plane = new Plane(new Vector3(0, 1, 0), 0);
    const helper = new PlaneHelper(plane, 10, 0xffff00);
    this._world.addObject(helper);
  }

  public addGridHelper(): void {
    const size = 10;
    const divisions = 10;

    const gridHelper = new GridHelper(size, divisions);
    this._world.addObject(gridHelper);
  }

  public addAxesHelper(): void {
    const axesHelper = new AxesHelper(5);
    this._world.addObject(axesHelper);
  }

  public addFloor(): void {
    const floorGeometry = new PlaneGeometry(50, 50);  // Width and height of the plane
    const floorMaterial = new MeshPhongMaterial({ color: 0x999999, side: DoubleSide });  // Color it gray for now
    const floor = new Mesh(floorGeometry, floorMaterial);

    // Rotate the floor to be horizontal (plane geometries are vertical by default)
    floor.rotation.x = Math.PI / 2;

    // Add shadow properties to the floor
    floor.receiveShadow = true;

    this._world.addObject(floor);
  }

  public addDirectionalLight(): void {
    const light1 = new DirectionalLight(0xffffff, 1.0);
    light1.position.set(4, 0, 10);

    light1.castShadow = true;  // Enable shadow casting for the light

    // Configure the shadow properties (optional, but can give better shadow quality)
    light1.shadow.mapSize.width = 512;  // Default is 512
    light1.shadow.mapSize.height = 512; // Default is 512
    light1.shadow.camera.near = 0.5;    // Default is 0.5
    light1.shadow.camera.far = 50;      // Default is 500

    this._world.addObject(light1);
  }

  public addCustomAxesHelper(): void {
    const axesHelper = new Web3dComponentAxesHelper(this._world.distanceToTarget);
    this._world.addObject(axesHelper);
  }

}