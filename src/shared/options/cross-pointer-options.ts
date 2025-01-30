import { ColorRepresentation } from 'three';

export interface Web3dComponentCrossPointerOptions {
  autoScale: boolean;
  lineLength: number;
  color: ColorRepresentation;
}

export const DEFAULT_CROSS_POINTER_OPTIONS: Web3dComponentCrossPointerOptions =
{
  autoScale: true,
  lineLength: 1,
  color: 'red'
};
