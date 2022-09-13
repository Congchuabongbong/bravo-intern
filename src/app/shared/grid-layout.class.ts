import { ElementRef, Renderer2 } from '@angular/core';
//**data type */
import {
  MinMax,
  PositionLine,
  unitOfMeasure,
} from '../data-type/grid-layout-data-type.type';

export default class GridLayout {
  private numberOfRows: number;
  private numberOfColumns: number;
  private arrayUnitRow!: unitOfMeasure[];
  private arrayUnitColumn!: unitOfMeasure[];
  private renderer!: Renderer2;

  constructor(
    numberOfRows: number,
    numberOfColumns: number,
    renderer: Renderer2
  ) {
    this.numberOfRows = numberOfRows;
    this.numberOfColumns = numberOfColumns;
    this.renderer = renderer;
  }
  set heightRow(arrayUnitRow: unitOfMeasure[]) {
    this.arrayUnitRow = arrayUnitRow;
  }
  set widthColumn(arrayUnitColumn: unitOfMeasure[]) {
    this.arrayUnitColumn = arrayUnitColumn;
  }
  public generateGridLayout(gridContainer: ElementRef): void {
    this.renderer.setStyle(gridContainer.nativeElement, 'display', 'grid');
    if (this.arrayUnitRow !== undefined) {
      if (this.arrayUnitRow.length !== this.numberOfRows) {
        throw new Error(
          'Số hàng được khai báo và số hàng được truyền vào không bằng nhau!'
        );
      }
      let preParedStatement = '';
      this.arrayUnitRow.forEach((unitRow) => {
        if (typeof unitRow !== 'string' && this.isMinMax(unitRow)) {
          preParedStatement += `minmax(${unitRow.min}, ${unitRow.max}) `;
        } else if (typeof unitRow !== 'string' && this.isMin(unitRow)) {
          preParedStatement += `min(${unitRow.min}) `;
        } else if (typeof unitRow !== 'string' && this.isMax(unitRow)) {
          preParedStatement += `max(${unitRow.max}) `;
        } else if (typeof unitRow === 'string') {
          preParedStatement += `${unitRow} `;
        }
      });
      console.log(`row statement:${preParedStatement}`);
      this.renderer.setStyle(
        gridContainer.nativeElement,
        'grid-template-rows',
        preParedStatement
      );
    } else {
      this.renderer.setStyle(
        gridContainer.nativeElement,
        'grid-template-rows',
        `repeat(${this.numberOfRows},1fr)`
      );
    }
    if (this.arrayUnitColumn !== undefined) {
      if (this.arrayUnitColumn.length != this.numberOfColumns) {
        throw new Error(
          'Số cột được khai báo và số cột được truyền vào không bằng nhau!'
        );
      }
      let preParedStatement: string = '';
      this.arrayUnitColumn.forEach((unitColumn: unitOfMeasure) => {
        if (typeof unitColumn !== 'string' && this.isMinMax(unitColumn)) {
          preParedStatement += `minmax(${unitColumn.min}, ${unitColumn.max}) `;
        } else if (typeof unitColumn !== 'string' && this.isMin(unitColumn)) {
          preParedStatement += `min(${unitColumn.min}) `;
        } else if (typeof unitColumn !== 'string' && this.isMax(unitColumn)) {
          preParedStatement += `max(${unitColumn.max}) `;
        } else if (typeof unitColumn === 'string') {
          preParedStatement += `${unitColumn} `;
        }
      });
      console.log(`column statement:${preParedStatement}`);
      this.renderer.setStyle(
        gridContainer.nativeElement,
        'grid-template-columns',
        preParedStatement
      );
    } else {
      this.renderer.setStyle(
        gridContainer.nativeElement,
        'grid-template-columns',
        `repeat(${this.numberOfColumns},1fr)`
      );
    }
  }
  //**Set gap column and row */
  public setRowGap(gridContainer: ElementRef, rowGapUnit: string): void {
    this.renderer.setStyle(
      gridContainer.nativeElement,
      'row-gap',
      `${rowGapUnit}`
    );
  }
  public setColumnGap(gridContainer: ElementRef, columnGapUnit: string): void {
    this.renderer.setStyle(
      gridContainer.nativeElement,
      'column-gap',
      `${columnGapUnit}`
    );
  }

  //**set position grid item */
  public setPositionGirdItem(
    gridItem: ElementRef,
    rowLinePosition: PositionLine,
    columnLinePosition: PositionLine
  ): void {
    this.renderer.setStyle(
      gridItem.nativeElement,
      'grid-row-start',
      `${rowLinePosition.startLine}`
    );
    this.renderer.setStyle(
      gridItem.nativeElement,
      'grid-row-end',
      `${rowLinePosition.endLine}`
    );
    this.renderer.setStyle(
      gridItem.nativeElement,
      'grid-column-start',
      `${columnLinePosition.startLine}`
    );
    this.renderer.setStyle(
      gridItem.nativeElement,
      'grid-column-end',
      `${columnLinePosition.endLine}`
    );
  }

  //** Check if obj is type of minMax type*/
  private isMinMax(obj: any): obj is MinMax {
    return 'min' in obj && 'max' in obj;
  }
  private isMin(obj: any): obj is Pick<MinMax, 'min'> {
    return 'min' in obj;
  }
  private isMax(obj: any): obj is Pick<MinMax, 'max'> {
    return 'max' in obj;
  }
}
