//**data type */
export type UnitOfMeasure = IMinMax | IMin | IMax | string;
export interface IMinMax {
  min: string;
  max: string;
}
export interface IMin extends Pick<IMinMax, 'min'> { }
export interface IMax extends Pick<IMinMax, 'max'> { }
export interface IPositionLine {
  startLine: number;
  endLine: number;
}
export interface IPositionGridItem {
  rowLine: IPositionLine;
  columnLine: IPositionLine;
}
export interface IRow {
  rowOfNumber: number;
  arrayUnitRow?: UnitOfMeasure[];
}
export interface IColumn {
  columnOfNumber: number;
  arrayUnitColumn?: UnitOfMeasure[];
}
export interface IGridLayout {
  row: IRow;
  column: IColumn;
}



