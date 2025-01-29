import { SharedPositionOptions } from "./common-options";

/**
 * Represents the options available to alter the properties
 * of the objects rendered
 */
export interface ThreeDRendererWorldOptions {
  worldOrigin: SharedPositionOptions;
  displayStats: boolean;
}

export const DEFAULT_WORLD_OPTIONS: ThreeDRendererWorldOptions = {
  worldOrigin: {
    x: 0,
    y: 0,
    z: 0
  },
  displayStats: true
};
