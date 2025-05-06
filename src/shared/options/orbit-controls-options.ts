export interface Web3dComponentOrbitControlsOptions {
  resetKey: string;
  toggleEnabledKey: string;
  minDistance: number;
  maxDistance: number;
  zoomSpeed: number;
  rotateSpeed: number;
  rangeFactor: number;
}

export const DEFAULT_ORBIT_CONTROLS_OPTIONS: Web3dComponentOrbitControlsOptions = {
  resetKey: 'Escape',
  toggleEnabledKey: 'Delete',
  minDistance: 0.01,
  maxDistance: Infinity,
  zoomSpeed: 0.3,
  rotateSpeed: 0.3,
  rangeFactor: 4
};