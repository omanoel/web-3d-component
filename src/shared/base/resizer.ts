import { Web3dComponentWebGlRenderer } from './web-gl-renderer';
import { Web3dComponentCamera } from './camera';


export class Web3dComponentResizer {
  // =======================================
  // CONSTRUCTOR
  // =======================================
  constructor(
    viewportElement: HTMLDivElement,
    renderer: Web3dComponentWebGlRenderer,
    camera: Web3dComponentCamera,
  ) {
    this._setSize(
      viewportElement.clientWidth,
      viewportElement.clientHeight,
      renderer,
      camera,
    );
    const resizeObserver = new ResizeObserver((entries) => {
      requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }
        if (entries.length) {
          const entry = entries[0];
          this._setSize(
            entry.contentRect.width,
            entry.contentRect.height,
            renderer,
            camera,
          );
          this.onResize();
        }
      });
    });
    resizeObserver.observe(viewportElement);
  }

  // =======================================
  // PUBLIC
  // =======================================
  public onResize(): void {
    // Empty here
  }

  // =======================================
  // PRIVATE
  // =======================================
  private _setSize(
    width: number,
    height: number,
    renderer: Web3dComponentWebGlRenderer,
    camera: Web3dComponentCamera,
  ): void {
    if (width > 0 && height > 0) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
    }
  }
}
