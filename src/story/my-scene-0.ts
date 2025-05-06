import { SkyMesh } from "three/examples/jsm/objects/SkyMesh.js";
import { Group, AmbientLight, PointLight, PointLightHelper, GridHelper, Material, BoxGeometry, MeshLambertMaterial, Mesh, PlaneGeometry, MeshStandardMaterial } from "three";
import { MyWorld } from "./my-world";

export class MyScene0 {

    constructor(private _world: MyWorld) { }

    public init(): void {
        this._world.cleanScene();

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


        this._world.addObject(mainGroup);
        this._world.render();
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




}