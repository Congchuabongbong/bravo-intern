//**data type */
export type unitOfMeasure = MinMax | Min | Max | string;
export interface MinMax {
  min: string;
  max: string;
}
export interface Min extends Pick<MinMax, 'min'> {}
export interface Max extends Pick<MinMax, 'max'> {}
export interface PositionLine {
  startLine: number;
  endLine: number;
}
