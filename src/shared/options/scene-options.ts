import { ColorRepresentation, CubeTexture } from 'three';

export interface Web3dComponentSceneOptions {
  /**
   * Color property of the Scene's background. CSS predefined colors
   *
   * @defaultValue 'black'
   */
  backgroundColor: ColorRepresentation;
  cubeTexture?: CubeTexture;
}

export const DEFAULT_SCENE_OPTIONS: Web3dComponentSceneOptions = {
  backgroundColor: 'black'
};
