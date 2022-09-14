import { ElementRef, Renderer2 } from '@angular/core';
//**data type */
import {
  MinMax,
  PositionLine,
  UnitOfMeasure,
  PositionGridItem,
} from '../data-type/grid-layout-data-type.type';

export default class GridLayout {
  private gridContainer!: ElementRef;
  private numberOfRows: number;
  private numberOfColumns: number;
  private arrayUnitRow!: UnitOfMeasure[];
  private arrayUnitColumn!: UnitOfMeasure[];
  private renderer!: Renderer2;

  constructor(
    _gridContainer: ElementRef,
    _numberOfRows: number,
    _numberOfColumns: number,
    _renderer: Renderer2
  ) {
    this.gridContainer = _gridContainer;
    this.numberOfRows = _numberOfRows;
    this.numberOfColumns = _numberOfColumns;
    this.renderer = _renderer;
  }
  set heightRow(arrayUnitRow: UnitOfMeasure[]) {
    this.arrayUnitRow = arrayUnitRow;
  }
  set widthColumn(arrayUnitColumn: UnitOfMeasure[]) {
    this.arrayUnitColumn = arrayUnitColumn;
  }
  public generateGridLayout(): void {
    this.renderer.setStyle(this.gridContainer.nativeElement, 'display', 'grid');
    if (this.arrayUnitRow !== undefined) {
      if (this.arrayUnitRow.length !== this.numberOfRows) {
        throw new Error(
          'The number of rows declared and the number of rows passed in are not equal!'
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
        this.gridContainer.nativeElement,
        'grid-template-rows',
        preParedStatement
      );
    } else {
      this.renderer.setStyle(
        this.gridContainer.nativeElement,
        'grid-template-rows',
        `repeat(${this.numberOfRows},1fr)`
      );
    }
    if (this.arrayUnitColumn !== undefined) {
      if (this.arrayUnitColumn.length != this.numberOfColumns) {
        throw new Error(
          'The number of columns declared in constructor and the number of columns passed in are not equal!!'
        );
      }
      let preParedStatement: string = '';
      this.arrayUnitColumn.forEach((unitColumn: UnitOfMeasure) => {
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
        this.gridContainer.nativeElement,
        'grid-template-columns',
        preParedStatement
      );
    } else {
      this.renderer.setStyle(
        this.gridContainer.nativeElement,
        'grid-template-columns',
        `repeat(${this.numberOfColumns},1fr)`
      );
    }
  }
  //**Set gap column and row */
  public setRowGap(rowGapUnit: string): void {
    this.renderer.setStyle(
      this.gridContainer.nativeElement,
      'row-gap',
      `${rowGapUnit}`
    );
  }
  public setColumnGap(columnGapUnit: string): void {
    this.renderer.setStyle(
      this.gridContainer.nativeElement,
      'column-gap',
      `${columnGapUnit}`
    );
  }
  public setGap(rowGapUnit: string, columnGapUnit: string) {
    this.renderer.setStyle(
      this.gridContainer.nativeElement,
      'gap',
      `${rowGapUnit} ${columnGapUnit}`
    );
  }
  //**set position grid item */
  public setPositionGirdItem(
    gridItem: ElementRef,
    position: PositionGridItem
  ): void {
    this.renderer.setStyle(
      gridItem.nativeElement,
      'grid-row-start',
      `${position.rowLine.startLine}`
    );
    this.renderer.setStyle(
      gridItem.nativeElement,
      'grid-row-end',
      `${position.rowLine.endLine}`
    );
    this.renderer.setStyle(
      gridItem.nativeElement,
      'grid-column-start',
      `${position.columnLine.startLine}`
    );
    this.renderer.setStyle(
      gridItem.nativeElement,
      'grid-column-end',
      `${position.columnLine.endLine}`
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
