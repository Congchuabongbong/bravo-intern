import { ElementRef, Renderer2 } from '@angular/core';

//**data type */
type unitOfMeasure = minMax | string;
interface minMax {
  min: string;
  max: string;
}
interface positionLine {
  startLine: number;
  endLine: number;
}

export default class GridLayout {
  private numberOfRows: number;
  private numberOfColumns: number;
  private arrayUnitRow!: unitOfMeasure[];
  private arrayUnitColumn!: unitOfMeasure[];
  private renderer!: Renderer2;

  constructor(row: number, column: number, renderer: Renderer2) {
    this.numberOfRows = row;
    this.numberOfColumns = column;
    this.renderer = renderer;
  }
  public generateGridLayout(girdContainer: ElementRef) {
    this.renderer.setStyle(girdContainer.nativeElement, 'display', 'grid');
    if (this.arrayUnitRow !== undefined) {
      let preParedStatement = '';
      this.arrayUnitRow.forEach((unitRow) => {
        if (typeof unitRow !== 'string' && this.isMinMax(unitRow)) {
          preParedStatement += `minmax(${unitRow.min}, ${unitRow.max}) `;
        } else {
          preParedStatement += `${unitRow} `;
        }
      });

      this.renderer.setStyle(
        girdContainer.nativeElement,
        'grid-template-rows',
        preParedStatement
      );
    } else {
      this.renderer.setStyle(
        girdContainer.nativeElement,
        'grid-template-rows',
        `repeat(${this.numberOfRows},1fr)`
      );
    }
    if (this.arrayUnitColumn !== undefined) {
      let preParedStatement: string = '';
      this.arrayUnitColumn.forEach((unitColumn) => {
        if (typeof unitColumn !== 'string' && this.isMinMax(unitColumn)) {
          preParedStatement += `minmax(${unitColumn.min}, ${unitColumn.max}) `;
        } else {
          preParedStatement += `${unitColumn} `;
        }
      });
      this.renderer.setStyle(
        girdContainer.nativeElement,
        'grid-template-columns',
        preParedStatement
      );
    } else {
      this.renderer.setStyle(
        girdContainer.nativeElement,
        'grid-template-columns',
        `repeat(${this.numberOfColumns},1fr)`
      );
    }
  }

  set heightRow(arrayUnitRow: unitOfMeasure[]) {
    this.arrayUnitRow = arrayUnitRow;
  }
  set widthColumn(arrayUnitColumn: unitOfMeasure[]) {
    this.arrayUnitColumn = arrayUnitColumn;
  }

  public setPositionGirdItem(
    girdItem: ElementRef,
    rowLine: positionLine,
    columnLine: positionLine
  ) {
    this.renderer.setStyle(
      girdItem.nativeElement,
      'grid-row-start',
      `${rowLine.startLine}`
    );
    this.renderer.setStyle(
      girdItem.nativeElement,
      'grid-row-end',
      `${rowLine.endLine}`
    );
    this.renderer.setStyle(
      girdItem.nativeElement,
      'grid-column-start',
      `${columnLine.startLine}`
    );
    this.renderer.setStyle(
      girdItem.nativeElement,
      'grid-column-end',
      `${columnLine.endLine}`
    );
  }

  //** Check if obj is type of minMax type*/
  private isMinMax(obj: any): obj is minMax {
    return 'min' in obj && 'max' in obj;
  }
}
