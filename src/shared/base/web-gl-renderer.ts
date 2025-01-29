import { WebGLRenderer } from 'three';

export class ThreeDRendererWebGlRenderer extends WebGLRenderer {
  //
  constructor(viewportElement: HTMLDivElement) {
    super({ antialias: true });
    viewportElement.append(this.domElement);
  }
}