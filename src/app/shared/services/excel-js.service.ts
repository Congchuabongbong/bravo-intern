import { FlexGrid } from '@grapecity/wijmo.grid';
import { merge } from 'rxjs';
import { Injectable } from '@angular/core';
import * as Excel from 'exceljs';
import * as FileSaver from 'file-saver';



enum TYPE_SELECTOR {
  ID = 1,
  CLASS = 2,
  TAGNAME = 3
}



export class ExcelJsService {
  private flexGrid!: FlexGrid;
  private hostElement!: HTMLElement;
  constructor(flexGrid: FlexGrid) {
    this.flexGrid = flexGrid
  }

  convertFontExcel(hostElement: HTMLElement, typeSelector: TYPE_SELECTOR, selector: string): Partial<Excel.Font> | null {
    let elementSelected: HTMLElement | null;
    let computedStyle: CSSStyleDeclaration | null;
    switch (typeSelector) {
      case TYPE_SELECTOR.ID:
        elementSelected = hostElement.querySelector(`#${selector}`);
        computedStyle = elementSelected && window.getComputedStyle(elementSelected);
        if (computedStyle == null) return null;
        const styleExcel: Partial<Excel.Font> = {

        }
        return styleExcel;
      case TYPE_SELECTOR.CLASS:
        return null;
      case TYPE_SELECTOR.TAGNAME:
        return null;
      default:

        return null;
    }


  }



  public mergeCells(): void {

  }
}
