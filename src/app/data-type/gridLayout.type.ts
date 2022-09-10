import { ElementRef, Renderer2 } from '@angular/core';

class GridLayout {
  public numberOfRows: number;
  public numberOfColumns: number;
  public arrayUnitRow!: [UnitMaxMin];
  public arrayUnitColumn!: [UnitMaxMin];

  constructor(
    row: number,
    column: number,
    option?: {},
    private renderer?: Renderer2
  ) {
    this.numberOfRows = row;
    this.numberOfColumns = column;
  }
  generateGridLayout(girdContainer: ElementRef) {
    if (this.setHeightRow()) {
    } else {
    }
    if (this.setWidthColumn()) {
    } else {
    }
  }

  setHeightRow(): [UnitMaxMin] {
    return this.arrayUnitRow;
  }
  setWidthColumn(): [UnitMaxMin] {
    return this.arrayUnitColumn;
  }
  setPositionGirdItem(girdItem: ElementRef, rowLine: {}, columnLine: {}) {}
}
interface UnitMaxMin {
  min: number;
  max: number;
}
