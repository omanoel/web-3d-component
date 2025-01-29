import { ThreeDRendererWebGlRenderer } from './web-gl-renderer';
import { ThreeDRendererCamera } from './camera';


export class ThreeDRendererResizer {
  // =======================================
  // CONSTRUCTOR
  // =======================================
  constructor(
    viewportElement: HTMLDivElement,
    renderer: ThreeDRendererWebGlRenderer,
    camera: ThreeDRendererCamera,
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
    renderer: ThreeDRendererWebGlRenderer,
    camera: ThreeDRendererCamera,
  ): void {
    if (width > 0 && height > 0) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
    }
  }
}
