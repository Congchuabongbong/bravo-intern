import { Injectable } from '@angular/core';
import { IWjFlexColumnConfig } from '../data-type/wijmo-data.type';
import * as wjcGrid from '@grapecity/wijmo.grid';
@Injectable({
  providedIn: 'root'
})
export class WijFlexGridService {

  constructor() { }

  public generateWijColumn(flexGrid: wjcGrid.FlexGrid, columnConfig: IWjFlexColumnConfig,): void {
    flexGrid.columns.clear();
    columnConfig.flexColumns.forEach(col => {
      flexGrid.columns.push(new wjcGrid.Column(col));
    });
  }

  public drawBgOddAndEven() {

  }
}
