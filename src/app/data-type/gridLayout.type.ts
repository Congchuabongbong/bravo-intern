import { ElementRef, Renderer2 } from '@angular/core';

class GridLayout {
  public numberOfRows: number;
  public numberOfColumns: number;
  public arrayUnitRow!: [UnitMaxMin];
  public arrayUnitColumn!: [UnitMaxMin];

  constructor(row: number, column: number, private renderer?: Renderer2) {
    this.numberOfRows = row;
    this.numberOfColumns = column;
  }
  generateGridLayout(girdContainer: ElementRef) {
    if (this.arrayUnitRow.length > 0) {
      let preParedStatement = '';
      this.arrayUnitRow.forEach((unitRow) => {
        preParedStatement += `minmax(${unitRow.min}, ${unitRow.max}) `;
      });
      this.renderer?.setStyle(
        girdContainer,
        'grid-template-rows',
        preParedStatement
      );
    } else {
      this.renderer?.setStyle(
        girdContainer,
        'grid-template-rows',
        `repeat(${this.numberOfRows},1fr)`
      );
    }
    if (this.arrayUnitColumn.length > 0) {
      let preParedStatement: string = '';
      this.arrayUnitColumn.forEach((unitColumn) => {
        preParedStatement += `minmax(${unitColumn.min}, ${unitColumn.max}) `;
      });
      this.renderer?.setStyle(
        girdContainer,
        'grid-template-columns',
        preParedStatement
      );
    } else {
      this.renderer?.setStyle(
        girdContainer,
        'grid-template-columns',
        `repeat(${this.numberOfColumns},1fr)`
      );
    }
  }

  set heightRow(arrayUnitRow: [UnitMaxMin]) {
    this.arrayUnitRow = arrayUnitRow;
  }
  set widthColumn(arrayUnitColumn: [UnitMaxMin]) {
    this.arrayUnitColumn = arrayUnitColumn;
  }
  setPositionGirdItem(
    girdItem: ElementRef,
    rowLine: positionLine,
    columnLine: positionLine
  ) {
    this.renderer?.setStyle(girdItem, '', '');
    this.renderer?.setStyle(girdItem, '', '');
  }
}
interface UnitMaxMin {
  min: number;
  max: number;
}
interface positionLine {
  startLine: number;
  endLine: number;
}
