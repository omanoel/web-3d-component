export interface Web3dComponentMapControlsOptions {
  resetKey: string;
  minDistance: number;
  maxDistance: number;
  zoomSpeed: number;
  rotateSpeed: number;
  rangeFactor: number;
}

export const DEFAULT_MAP_CONTROLS_OPTIONS: Web3dComponentMapControlsOptions = {
  resetKey: 'Escape',
  minDistance: 0.01,
  maxDistance: Infinity,
  zoomSpeed: 0.3,
  rotateSpeed: 0.3,
  rangeFactor: 4
};