import WebGL from 'three/examples/jsm/capabilities/WebGL.js';
import { AmbientLight, AxesHelper, BoxGeometry, Clock, DirectionalLight, DoubleSide, GridHelper, Group, Material, MathUtils, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial, Object3D, PCFSoftShadowMap, PerspectiveCamera, Plane, PlaneGeometry, PlaneHelper, PMREMGenerator, PointLight, PointLightHelper, PolarGridHelper, RepeatWrapping, Scene, SphereGeometry, Spherical, Texture, TextureLoader, Vector3, WebGLRenderTarget } from 'three';
import { MapControls, Sky, Water } from 'three/examples/jsm/Addons.js';
import { WaterMesh } from 'three/examples/jsm/objects/WaterMesh.js';
import { SkyMesh } from 'three/examples/jsm/objects/SkyMesh.js';
import { ThreeDRendererWorld } from './base/world';
import { InfiniteGridHelper } from './grid-helpers/infinite-grid-helper';
import { ThreeDRendererAxesHelper } from './helpers/axes-helper';
import { SphereGridHelper } from './helpers/sphere-grid-helper';
import { ThreeDRendererCrossPointer } from './helpers/cross-pointer';
import { ThreeDRendererMapControls } from './base/map-controls';
import { ThreeDRendererPointerLockControls } from './base/pointer-lock-controls';
import { ThreeDRendererFirstPersonControls } from './base/first-person-controls';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { ITickParams } from './abstract/abstract-group';
import { GetOptionValueUtil } from './utils/get-option-value-util';
import { ThreeDRendererController, ThreeDRendererControllers } from './abstract/controller';

export class MyWorld extends ThreeDRendererWorld {

  isAvailable = false;
  tickableObjects: Map<string, any> = new Map();

  private _pointerLockControls: ThreeDRendererPointerLockControls | undefined;
  private _mapControls: ThreeDRendererMapControls | undefined;
  private _firstPersonControls: ThreeDRendererFirstPersonControls | undefined;
  private _requestAnimationFrameId: number = 0;
  private _fps = 24;
  private _then: DOMHighResTimeStamp = window.performance.now();
  private _clock: Clock = new Clock();

  private _controllers: ThreeDRendererControllers = new ThreeDRendererControllers(this);

  constructor(viewportElement: HTMLDivElement) {
    // WebGL available ?
    if (!WebGL.isWebGL2Available()) {
      const warning = WebGL.getWebGL2ErrorMessage();
      viewportElement.appendChild(warning);
      return;
    }
    super(viewportElement);
    this.isAvailable = true;
    this._controllers.add('orbit', this._camera, this._controls);
    // const scene1 = this.initScene1();
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
    let targetPos = this._controllers.enabledController.controls.target;
    this._scene.tickableObjects.forEach(
      (t: Object3D) => {
        const distanceToCamera = t.userData.computeDistanceToCamera(
          this._camera.position
        );
        const tickParams: ITickParams = {
          distance: distanceToCamera,
          worldOrigin: GetOptionValueUtil.getVector3(this._options.worldOrigin),
          cameraPos: cameraPos,
          targetPos: targetPos
        };
        if (t.userData.onTick !== undefined) {
          t.userData.onTick(deltaTime, tickParams);
        }
      }
    );
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
        this.switchControls('orbit');
        break;
      case 'switch-fp-controls':
        this.switchControls('fp');
        break;

      default:
        break;
    }
  }

  public initScene0(): void {
    this.cleanScene();

    /*
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._renderer.setAnimationLoop(animate);
        this._renderer.toneMapping = ACESFilmicToneMapping;
        this._renderer.toneMappingExposure = 0.5;


        const sun = new Vector3();

        // Water

        const waterGeometry = new PlaneGeometry(10000, 10000);
        const loader = new TextureLoader();
        const waterNormals = loader.load('./textures/waternormals.jpg');
        waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping;

        const water = new WaterMesh(
            waterGeometry,
            {
                waterNormals: waterNormals,
                sunDirection: new Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7
            }
        );

        water.rotation.x = - Math.PI / 2;

        this._scene.add(water);

        // Skybox

        const sky = new SkyMesh();
        sky.scale.setScalar(10000);
        this._scene.add(sky);

        sky.turbidity.value = 10;
        sky.rayleigh.value = 2;
        sky.mieCoefficient.value = 0.005;
        sky.mieDirectionalG.value = 0.8;

        const parameters = {
            elevation: 2,
            azimuth: 180
        };

        const pmremGenerator = new PMREMGenerator(this._renderer);
        const sceneEnv = new Scene();

        let renderTarget: WebGLRenderTarget;


        // this._renderer.init().then(this.updateSun(sun, parameters, sky, water, renderTarget, sceneEnv, pmremGenerator));

        //

        const geometry = new BoxGeometry(30, 30, 30);
        const material = new MeshStandardMaterial({ roughness: 0 });

        const mesh = new Mesh(geometry, material);
        this._scene.add(mesh);

        //

        this._controls.maxPolarAngle = Math.PI * 0.495;
        this._controls.target.set(0, 10, 0);
        this._controls.minDistance = 40.0;
        this._controls.maxDistance = 200.0;
        this._controls.update();


        */

    const mainGroup = new Group();



    const ambientLight = new AmbientLight(0xffffff, 0.2);
    mainGroup.add(ambientLight);

    // LIGTHS
    const lights = [];
    lights[0] = new PointLight(0xff0000, 10, 0); // red x
    lights[0].position.set(10, 0, 0);
    lights[1] = new PointLight(0x00ff00, 10, 0); // green y
    lights[1].position.set(0, 10, 0);
    lights[2] = new PointLight(0x0000ff, 10, 0); // blue z
    lights[2].position.set(0, 0, 10);
    mainGroup.add(lights[0]);
    mainGroup.add(lights[1]);
    mainGroup.add(lights[2]);

    // LIGHT HELPERS
    const lightHelpers = [];
    lightHelpers[0] = new PointLightHelper(lights[0]);
    lightHelpers[1] = new PointLightHelper(lights[1]);
    lightHelpers[2] = new PointLightHelper(lights[2]);
    mainGroup.add(lightHelpers[0]);
    mainGroup.add(lightHelpers[1]);
    mainGroup.add(lightHelpers[2]);


    const size = 100;
    const divisions = 10;
    const gridHelper = new GridHelper(size, divisions, 0xffffff, 0xdddddd);
    (gridHelper.material as Material).transparent = true;
    (gridHelper.material as Material).opacity = 0.5;
    mainGroup.add(gridHelper);

    /*
        const infiniteGridHelper = new InfiniteGridHelper();
        this.add(infiniteGridHelper);
        */

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshLambertMaterial({ color: 0x049ef4 });

    const mesh = new Mesh(geometry, material);
    mainGroup.add(mesh);

    const groundFloorGeometry = new PlaneGeometry(10000, 10000);
    const groundFloorMaterial = new MeshStandardMaterial({ color: 0x0000ff, transparent: true, opacity: 0.5 });
    const groundFloor = new Mesh(groundFloorGeometry, groundFloorMaterial);
    groundFloor.position.y = -0.1;
    groundFloor.rotation.x = -Math.PI / 2;
    mainGroup.add(groundFloor);

    // Skybox

    const sky = new SkyMesh();
    sky.scale.setScalar(10000);
    mainGroup.add(sky);

    sky.turbidity.value = 10;
    sky.rayleigh.value = 2;
    sky.mieCoefficient.value = 0.005;
    sky.mieDirectionalG.value = 0.8;

    const parameters = {
      elevation: 2,
      azimuth: 180
    };


    this.addObject(mainGroup);
    this.render();
  }

  /* 

    public updateSun(
        sun: Vector3,
        parameters: any,
        sky: SkyMesh,
        water: WaterMesh,
        renderTarget: WebGLRenderTarget,
        sceneEnv: Scene,
        pmremGenerator: PMREMGenerator): void {

        const phi = MathUtils.degToRad(90 - parameters.elevation);
        const theta = MathUtils.degToRad(parameters.azimuth);

        sun.setFromSphericalCoords(1, phi, theta);

        sky.sunPosition.value.copy(sun);
        water.sunDirection.value.copy(sun).normalize();

        if (renderTarget !== undefined) renderTarget.dispose();

        sceneEnv.add(sky);
        renderTarget = pmremGenerator.fromScene(sceneEnv);
        this._scene.add(sky);

        this._scene.environment = renderTarget.texture;

    }
        */

  public initScene1(): void {
    this.cleanScene();

    this.updateRendererToComputeShadows();
    this.addDirectionalLight();
    this.addSky();
    this.addCubePhong();
    this.addAmbientLight();
    this.addAxesHelper();
    this.addCustomAxesHelper();
    this.addFloor();
    this.render();

  }

  public initScene2(): void {
    this.cleanScene();
    this.addSky();
    this.addCustomAxesHelper();
    this.render();
  }

  public initScene3(): void {
    this.cleanScene();
    this.addSphereGridHelper();
    this.addStar();
    this.addStar(new Vector3(30, 2, 1));
    this.addCrossPointer();
    this.addCustomAxesHelper();

    // this._mapControls = new ThreeDRendererMapControls(this._camera, this._viewportElement);
    // this._pointerLockControls = new ThreeDRendererPointerLockControls(this._camera, this._viewportElement);
    const camera = new PerspectiveCamera();
    const firstPersonControls = new ThreeDRendererFirstPersonControls(camera, this._viewportElement);
    this._controllers.add('fp', camera, firstPersonControls);
    this.render();

  }

  public switchMapControls(): void {
    if (this._pointerLockControls !== undefined) {
      this._pointerLockControls.enabled = !this._pointerLockControls.enabled;
      this._controls.enabled = !this._controls.enabled;
      this._controls.update();
      this._pointerLockControls.update(0);
    }
    if (this._controls.enabled) {
      if (this._requestAnimationFrameId !== 0) {
        cancelAnimationFrame(this._requestAnimationFrameId);
        this._requestAnimationFrameId = 0;
      }
      this.render();
    } else {
      this.animateMap();
    }
  }

  public animateMap(): void {
    this._requestAnimationFrameId = requestAnimationFrame(() => this.animateMap);
    this._pointerLockControls?.update(0.3);
    this.render();
  }

  public switchControls(key: string): void {
    this._controllers.switch(key);
  }

  public startFirstPersonAnimation(): void {
    const fps = 24;
    const fpsInterval = 1000 / fps;
    this._then = window.performance.now();
    this.animateFirstPerson(this._then);
  }

  public animateFirstPerson = (newTime: number) => {
    this._requestAnimationFrameId = requestAnimationFrame(this.animateFirstPerson);
    this._firstPersonControls?.update(0.1);
    this.tick(0);
    this.render()
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
    this.addObject(mesh);

  }

  public addSky(): void {

    const sky = new Sky();
    sky.scale.setScalar(10000);

    const phi = MathUtils.degToRad(90);
    const theta = MathUtils.degToRad(0);
    const sunPosition = new Vector3().setFromSphericalCoords(1, phi, theta);

    sky.material.uniforms.sunPosition.value = sunPosition;

    this.addObject(sky);
  }

  public addCameraLight(): void {

  }

  public addAmbientLight(): void {

    const ambientLight = new AmbientLight(0xffffff, 0.2);
    this.addObject(ambientLight);
  }

  public addPolarGridHelper(): void {
    const radius = 10;
    const sectors = 16;
    const rings = 8;
    const divisions = 64;

    const helper = new PolarGridHelper(radius, sectors, rings, divisions);
    this.addObject(helper);
  }

  public addPlaneHelper(): void {
    const plane = new Plane(new Vector3(0, 1, 0), 0);
    const helper = new PlaneHelper(plane, 10, 0xffff00);
    this.addObject(helper);
  }

  public addGridHelper(): void {
    const size = 10;
    const divisions = 10;

    const gridHelper = new GridHelper(size, divisions);
    this.addObject(gridHelper);
  }

  public addAxesHelper(): void {
    const axesHelper = new AxesHelper(5);
    this.addObject(axesHelper);
  }

  public addCustomAxesHelper(): void {
    const axesHelper = new ThreeDRendererAxesHelper(this._controls.distanceToTarget);
    this._scene.addObject
    this.addObject(axesHelper);
  }

  public addFloor(): void {
    const floorGeometry = new PlaneGeometry(50, 50);  // Width and height of the plane
    const floorMaterial = new MeshPhongMaterial({ color: 0x999999, side: DoubleSide });  // Color it gray for now
    const floor = new Mesh(floorGeometry, floorMaterial);

    // Rotate the floor to be horizontal (plane geometries are vertical by default)
    floor.rotation.x = Math.PI / 2;

    // Add shadow properties to the floor
    floor.receiveShadow = true;

    this.addObject(floor);
  }

  public updateRendererToComputeShadows(): void {
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = PCFSoftShadowMap;
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

    this.addObject(light1);
  }

  public addSphereGridHelper(): void {
    const sphere = new SphereGridHelper(100, 64);
    this.addObject(sphere);
  }

  public addStar(position: Vector3 = new Vector3(0, 0, 0)): void {
    const geometry = new SphereGeometry(0.1, 32, 16);
    const material = new MeshBasicMaterial({ color: 0xffffff });
    const star = new Mesh(geometry, material);
    star.userData.cleanable = true;
    star.userData.clickable = true;
    star.userData.onMouseOver = (pos: Vector3, obj: Object3D) => {
      console.log('mouseover on star');
    };
    star.userData.options = {
      position: {}
    };
    star.userData.options.position.x = position.x;
    star.userData.options.position.y = position.y;
    star.userData.options.position.z = position.z;
    this.addObject(star);
  }

  public addCrossPointer(): void {
    const crossPointer = new ThreeDRendererCrossPointer(this._controls.distanceToTarget);
    this.addObject(crossPointer, true);
  }

}