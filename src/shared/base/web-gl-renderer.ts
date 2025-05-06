import { WebGLRenderer } from 'three';

export class Web3dComponentWebGlRenderer extends WebGLRenderer {
  //
  constructor(viewportElement: HTMLDivElement) {
    super({ antialias: true });
    viewportElement.append(this.domElement);
  }
}