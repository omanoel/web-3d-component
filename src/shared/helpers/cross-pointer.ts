import { BufferGeometry, Color, Line, LineBasicMaterial, Vector3 } from 'three';
import { AbstractOnlyTickableGroup, IOnlyTickable, IConfigurable, ITickParams } from '../abstract/abstract-group';
import { DEFAULT_CROSS_POINTER_OPTIONS, ThreeDRendererCrossPointerOptions } from '../options/cross-pointer-options';

export class ThreeDRendererCrossPointer
  extends AbstractOnlyTickableGroup<IOnlyTickable>
  implements IConfigurable<ThreeDRendererCrossPointerOptions> {
  //
  public type: string;
  //
  private _material: LineBasicMaterial;
  private _originalDistanceToTarget: number;

  // =======================================
  // CONSTRUCTOR
  // =======================================
  constructor(
    distanceToTarget: number,
    initActions?: Partial<IOnlyTickable>,
    initOptions?: Partial<ThreeDRendererCrossPointerOptions>
  ) {
    //
    super(initActions);
    //
    this.type = 'ThreeDRendererCrossPointer';
    //
    this.userData.options = {
      ...DEFAULT_CROSS_POINTER_OPTIONS,
      ...initOptions
    };
    //
    this._material = new LineBasicMaterial({
      color: this.userData.options.color
    });
    this.visible = false;
    this._originalDistanceToTarget = distanceToTarget;
    this._build();
    this.userData.onMouseOver = this.display.bind(this);
    this.userData.onMouseOut = this.hide.bind(this);
    // override onTick
    this.userData.onTick = this.tick.bind(this);
  }

  // =======================================
  // PUBLIC
  // =======================================
  public updateWithOptions(
    options: Partial<ThreeDRendererCrossPointerOptions>
  ): void {
    if (options.color !== undefined) {
      this.userData.options.color = options.color;
      this._material.color = new Color(this.userData.options.color);
    }
    if (options.lineLength !== undefined) {
      this.userData.options.lineWidth = options.lineLength;
    }
    if (options.autoScale !== undefined) {
      this.userData.options.autoScale = options.autoScale;
    }
  }
  public display(position: Vector3): void {
    this.visible = true;
    this.position.set(position.x, position.y, position.z);
  }
  public hide(): void {
    this.visible = false;
  }
  public tick(_deltaTime: number, params: ITickParams): void {
    this._update(params.distance);
  }

  // =======================================
  // PRIVATE
  // =======================================
  private _build(): void {
    this.clear();
    this.add(this._createCrossLine(this.userData.options.lineLength, 0, 0, 0));
    this.add(
      this._createCrossLine(this.userData.options.lineLength, 0, Math.PI / 2, 0)
    );
    this.add(
      this._createCrossLine(this.userData.options.lineLength, 0, 0, Math.PI / 2)
    );
  }
  private _createCrossLine(
    lineLength: number,
    xRotation: number,
    yRotation: number,
    zRotation: number
  ): Line {
    const linesData = [
      new Vector3(-lineLength, 0, 0),
      new Vector3(+lineLength, 0, 0)
    ];
    const geometry = new BufferGeometry().setFromPoints(linesData);
    const crossLine = new Line(geometry, this._material);
    crossLine.rotateX(xRotation);
    crossLine.rotateY(yRotation);
    crossLine.rotateZ(zRotation);
    return crossLine;
  }

  private _update(distance: number): void {
    if (this.userData.options.autoScale === true) {
      this._resize(distance / this._originalDistanceToTarget);
    }
  }
  //
  private _resize(ratio: number): void {
    this.scale.setScalar(ratio);
  }
}
