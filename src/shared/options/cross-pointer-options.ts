import { ColorRepresentation } from 'three';

export interface ThreeDRendererCrossPointerOptions {
  autoScale: boolean;
  lineLength: number;
  color: ColorRepresentation;
}

export const DEFAULT_CROSS_POINTER_OPTIONS: ThreeDRendererCrossPointerOptions =
{
  autoScale: true,
  lineLength: 1,
  color: 'red'
};
