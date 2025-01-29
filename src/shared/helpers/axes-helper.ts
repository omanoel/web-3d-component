import { ArrowHelper, Object3D, Vector3 } from 'three';
import { AbstractOnlyTickableGroup, IOnlyTickable, IConfigurable, ITickParams } from '../abstract/abstract-group';
import { SharedAxisTypes } from '../options/common-options';
import { DEFAULT_AXES_HELPER_OPTIONS, ThreeDRendererAxesHelperOptions } from '../options/axes-helper-options';
import { GetOptionValueUtil } from '../utils/get-option-value-util';

export class ThreeDRendererAxesHelper
  extends AbstractOnlyTickableGroup<IOnlyTickable>
  implements IConfigurable<ThreeDRendererAxesHelperOptions> {
  //
  public static readonly AXIS_ARROW_NAME = 'axis-arrow-';
  //
  public type: string;
  //
  private _originalDistanceToTarget: number;
  // =======================================
  // CONSTRUCTOR
  // =======================================
  constructor(
    distanceToTarget: number,
    initActions?: Partial<IOnlyTickable>,
    initOptions?: Partial<ThreeDRendererAxesHelperOptions>
  ) {
    //
    super(initActions);
    //
    this.type = 'ThreeDRendererAxesHelper';
    //
    this.userData.options = {
      ...DEFAULT_AXES_HELPER_OPTIONS,
      ...initOptions
    };
    //
    this._originalDistanceToTarget = distanceToTarget;
    this._build();
    // override onTick
    this.userData.onTick = this.tick.bind(this);
  }

  // =======================================
  // PUBLIC
  // =======================================
  public updateWithOptions(
    options: Partial<ThreeDRendererAxesHelperOptions>
  ): void {
    if (options.x !== undefined) {
      const axisX = this.getObjectByName(
        ThreeDRendererAxesHelper.AXIS_ARROW_NAME + 'x'
      );
      if (axisX !== undefined) {
        //
      }
    }
    if (options.autoScale !== undefined) {
      this.userData.options.autoScale = options.autoScale;
    }
  }
  public tick(_deltaTime: number, params: ITickParams): void {
    this._update(params.distance, params.targetPos);
  }

  // =======================================
  // PRIVATE
  // =======================================
  private _build(): void {
    this.clear();
    const axisArrowX = this._initAxisArrow('x');
    const axisArrowY = this._initAxisArrow('y');
    const axisArrowZ = this._initAxisArrow('z');
    this._updateAxisArrowWithOptions(axisArrowX, 'x');
    this._updateAxisArrowWithOptions(axisArrowY, 'y');
    this._updateAxisArrowWithOptions(axisArrowZ, 'z');
    this.add(axisArrowX, axisArrowY, axisArrowZ);
  }

  private _update(distance: number, targetPos: Vector3): void {
    if (this.userData.options.autoScale === true) {
      this._resize(distance / this._originalDistanceToTarget);
    }
    if (this.userData.options.trackTarget === true) {
      this.position.set(targetPos.x, targetPos.y, targetPos.z);
    }
  }

  private _resize(ratio: number): void {
    this.scale.set(ratio, ratio, ratio);
  }

  private _initAxisArrow(
    axis: keyof Pick<ThreeDRendererAxesHelperOptions, SharedAxisTypes>
  ): ArrowHelper {
    const arrowOptions = DEFAULT_AXES_HELPER_OPTIONS[axis];
    const arrow = new ArrowHelper(
      this._getAxisArrowDirection(axis, arrowOptions.inverted),
      new Vector3(
        arrowOptions.position.x,
        arrowOptions.position.y,
        arrowOptions.position.z
      ),
      this.userData.options.length,
      arrowOptions.color
    );
    arrow.name = ThreeDRendererAxesHelper.AXIS_ARROW_NAME + axis;
    return arrow;
  }

  private _getAxisArrowDirection(
    axis: keyof Pick<ThreeDRendererAxesHelperOptions, SharedAxisTypes>,
    inverted: boolean
  ): Vector3 {
    let direction: Vector3;
    switch (axis) {
      case 'x': {
        direction = new Vector3(inverted ? -1 : 1, 0, 0);
        break;
      }
      case 'y': {
        direction = new Vector3(0, inverted ? -1 : 1, 0);
        break;
      }
      case 'z': {
        direction = new Vector3(0, 0, inverted ? -1 : 1);
        break;
      }
    }
    return direction;
  }

  private _updateAxisArrowWithOptions(
    axisArrow: Object3D,
    axisArrowOptionsAttributeName: keyof Pick<
      ThreeDRendererAxesHelperOptions,
      SharedAxisTypes
    >
  ): void {
    const axisArrowOptions =
      this.userData.options[axisArrowOptionsAttributeName];

    axisArrow.visible = GetOptionValueUtil.getIfDefined(
      axisArrow.visible,
      this.userData.options.visible,
      axisArrowOptions?.visible
    );

    axisArrow.position.set(
      GetOptionValueUtil.getIfDefined(
        axisArrow.position.x,
        this.userData.options.position?.x,
        axisArrowOptions?.position?.x
      ),
      GetOptionValueUtil.getIfDefined(
        axisArrow.position.y,
        this.userData.options.position?.y,
        axisArrowOptions?.position?.y
      ),
      GetOptionValueUtil.getIfDefined(
        axisArrow.position.z,
        this.userData.options.position?.z,
        axisArrowOptions?.position?.z
      )
    );

    if (axisArrow instanceof ArrowHelper) {
      axisArrow.setDirection(
        this._getAxisArrowDirection(
          axisArrowOptionsAttributeName,
          GetOptionValueUtil.getIfDefined(false, axisArrowOptions?.inverted)
        )
      );

      axisArrow.setLength(this.userData.options.length);

      if (axisArrowOptions?.color !== undefined) {
        axisArrow.setColor(axisArrowOptions.color);
      }
    }
  }
}
