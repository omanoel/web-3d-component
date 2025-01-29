import { BufferAttribute, BufferGeometry, CircleGeometry, DoubleSide, Group, Line, Line3, LineBasicMaterial, LineCurve, LineLoop, MathUtils, Mesh, MeshBasicMaterial, SphereGeometry, Vector2, Vector3 } from "three";

export class SphereGridHelper extends Group {

  private readonly LATITUDES_COUNTER = 8;
  private readonly LONGITUDES_COUNTER = 24;

  constructor(radius: number, segments: number) {
    super();
    const material = new LineBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.2 });
    this.init(radius, segments, material);
  }

  public init(radius: number, segments: number, material: LineBasicMaterial): void {

    const materialOpacity3 = material.clone();
    materialOpacity3.opacity = 0.3;

    const geometryCircle = new CircleGeometry(radius, segments);
    // Remove center vertex
    const itemSize = 3;
    geometryCircle.setAttribute('position',
      new BufferAttribute(
        geometryCircle.attributes.position.array.slice(itemSize,
          geometryCircle.attributes.position.array.length - itemSize
        ), itemSize
      )
    );
    geometryCircle.index = null;

    const baseCircle = new LineLoop(geometryCircle, material);

    for (let i = 0; i < this.LONGITUDES_COUNTER; i++) {
      const longitude = baseCircle.clone();
      longitude.rotation.y = Math.PI * 2 / this.LONGITUDES_COUNTER * i;
      this.add(longitude);
    }

    // equateur
    const equator = baseCircle.clone();
    equator.material = materialOpacity3;
    equator.rotation.x = Math.PI / 2;
    this.add(equator);

    // z = 0: equator, z = 9: pole
    for (let z = 1; z <= this.LATITUDES_COUNTER; z++) {
      const latitudeNorth = baseCircle.clone();
      const angleNorth = Math.PI / 2 / 9 * z;
      latitudeNorth.scale.x = Math.cos(angleNorth);
      latitudeNorth.scale.y = Math.cos(angleNorth);
      latitudeNorth.rotation.x = Math.PI / 2; // horizontal
      latitudeNorth.position.y = radius * Math.sin(angleNorth);
      this.add(latitudeNorth);

      const latitudeSouth = baseCircle.clone();
      const angleSouth = Math.PI / 2 / 9 * z;
      latitudeSouth.scale.x = Math.cos(angleSouth);
      latitudeSouth.scale.y = Math.cos(angleSouth);
      latitudeSouth.rotation.x = Math.PI / 2; // horizontal
      latitudeSouth.position.y = - radius * Math.sin(angleSouth);
      this.add(latitudeSouth);
    }

    // polar grid
    for (let z = 1; z < 10; z++) {
      const polarGrid = baseCircle.clone();
      if (z % 2 === 0) {
        polarGrid.material = materialOpacity3;
      }
      polarGrid.scale.x = z / 10;
      polarGrid.scale.y = z / 10;
      polarGrid.rotation.x = Math.PI / 2;
      this.add(polarGrid);
    }

    const points = [];
    points.push(new Vector3(0, 0, 0));
    points.push(new Vector3(radius, 0, 0));

    const geometryLine = new BufferGeometry().setFromPoints(points)
    const line = new Line(geometryLine, material);

    for (let i = 0; i < this.LONGITUDES_COUNTER; i++) {
      const linePolar = line.clone();
      if (i % 2 === 0) {
        linePolar.material = materialOpacity3;
      }
      linePolar.rotation.y = Math.PI * 2 / this.LONGITUDES_COUNTER * i;
      this.add(linePolar);
    }

    // polar surface
    const geometryPolarCircle = new CircleGeometry(radius, segments);
    const materialPolarCircle = new MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.1, side: DoubleSide });
    const polarCircle = new Mesh(geometryPolarCircle, materialPolarCircle);
    polarCircle.rotation.x = Math.PI / 2;
    // this.add(polarCircle);
  }
}