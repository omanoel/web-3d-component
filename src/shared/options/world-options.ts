import { SharedPositionOptions } from "./common-options";

/**
 * Represents the options available to alter the properties
 * of the objects rendered
 */
export interface Web3dComponentWorldOptions {
  worldOrigin: SharedPositionOptions;
  displayStats: boolean;
}

export const DEFAULT_WORLD_OPTIONS: Web3dComponentWorldOptions = {
  worldOrigin: {
    x: 0,
    y: 0,
    z: 0
  },
  displayStats: true
};
