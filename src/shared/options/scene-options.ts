import { ColorRepresentation, CubeTexture } from 'three';

export interface ThreeDRendererSceneOptions {
  /**
   * Color property of the Scene's background. CSS predefined colors
   *
   * @defaultValue 'black'
   */
  backgroundColor: ColorRepresentation;
  cubeTexture?: CubeTexture;
}

export const DEFAULT_SCENE_OPTIONS: ThreeDRendererSceneOptions = {
  backgroundColor: 'black'
};
