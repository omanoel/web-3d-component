import { Intersection, Raycaster, Vector2 } from 'three';
import { Web3dComponentCamera } from './camera';
import { Web3dComponentScene } from './scene';
import { Web3dComponentWebGlRenderer } from './web-gl-renderer';
import { DEFAULT_RAYCASTER_OPTIONS, Web3dComponentRaycasterOptions } from '../options/raycaster-options';
import { IConfigurable } from '../abstract/abstract-interfaces';


export class Web3dComponentRaycaster extends Raycaster
  implements IConfigurable<Web3dComponentRaycasterOptions> {

  private _isActive = true;

  private _document: Document;

  private _intersected: Intersection | undefined;

  private _boundMouseMoveHandler: (mouseEvent: MouseEvent) => void;

  private _boundMouseDblClickHandler: (mouseEvent: MouseEvent) => void;

  /**
   * @param viewportElement The DOM element
   * @param renderer The renderer
   * @param scene The scene
   * @param camera The camera
   */
  constructor(
    viewportElement: HTMLDivElement,
    renderer: Web3dComponentWebGlRenderer,
    scene: Web3dComponentScene,
    camera: Web3dComponentCamera,
    initOptions?: Partial<Web3dComponentRaycasterOptions>
  ) {
    super();
    const options = {
      ...DEFAULT_RAYCASTER_OPTIONS,
      ...initOptions
    };
    this._document = viewportElement.ownerDocument;
    this._isActive = options.isActive;

    this._boundMouseMoveHandler = (mouseEvent: MouseEvent) => {
      if (this._isActive) {
        this._handleMouseMove(
          mouseEvent,
          renderer,
          scene,
          camera,
        );
      }
    };
    this._boundMouseDblClickHandler = (mouseEvent: MouseEvent) => {
      if (this._isActive) {
        this._handleMouseDblClick(
          mouseEvent,
          renderer,
          scene,
          camera,
        );
      }
    };
    this._document.addEventListener(
      'mousemove',
      this._boundMouseMoveHandler,
      false
    );
    this._document.addEventListener(
      'dblclick',
      this._boundMouseDblClickHandler,
      false
    );
  }

  public handleMouseOver(_intersected: Intersection): void {
    // Empty here
  }

  public handleMouseOut(_intersected: Intersection): void {
    // Empty here
  }

  public handleMouseDblClick(_intersected: Intersection): void {
    // Empty here
  }

  public updateWithOptions(
    options: Partial<Web3dComponentRaycasterOptions>
  ): void {
    if (options.isActive !== undefined) {
      this._isActive = options.isActive;
    }
  }

  /**
   * clear all event listeners
   */
  public dispose(): void {
    this._document.removeEventListener(
      'mousemove',
      this._boundMouseMoveHandler,
      false,
    );
    this._document.removeEventListener(
      'dblclick',
      this._boundMouseDblClickHandler,
      false,
    );
  }

  public clearIntersected(): void {
    this._intersected = undefined;
  }

  public get intersected(): Intersection | undefined {
    return this._intersected;
  }

  private _handleMouseMove(
    mouseEvent: MouseEvent,
    renderer: Web3dComponentWebGlRenderer,
    scene: Web3dComponentScene,
    camera: Web3dComponentCamera,
  ): void {
    const intersects = this._getRaycasterIntersections(
      mouseEvent,
      renderer,
      scene,
      camera,
    );
    if (intersects.length > 0) {
      this._intersected = intersects[0];
      this.handleMouseOver(intersects[0]);
    } else if (this._intersected !== undefined) {
      this.handleMouseOut({ ...this._intersected });
      this._intersected = undefined;
    }
  }

  private _handleMouseDblClick(
    mouseEvent: MouseEvent,
    renderer: Web3dComponentWebGlRenderer,
    scene: Web3dComponentScene,
    camera: Web3dComponentCamera,
  ): void {
    const intersects = this._getRaycasterIntersections(
      mouseEvent,
      renderer,
      scene,
      camera,
    );
    if (intersects.length > 0) {
      this.handleMouseDblClick(intersects[0]);
    }
  }

  private _getRaycasterIntersections(
    mouseEvent: MouseEvent,
    renderer: Web3dComponentWebGlRenderer,
    scene: Web3dComponentScene,
    camera: Web3dComponentCamera,
  ): Intersection[] {
    const mouse = new Vector2();
    const boundRect = renderer.domElement.getBoundingClientRect();
    mouse.x =
      ((mouseEvent.clientX - boundRect.left) /
        renderer.domElement.clientWidth) *
      2 -
      1;
    mouse.y =
      -(
        (mouseEvent.clientY - boundRect.top) /
        renderer.domElement.clientHeight
      ) *
      2 +
      1;
    this.setFromCamera(mouse, camera);
    return this.intersectObjects(scene.clickableObjects, true);
  }
}
