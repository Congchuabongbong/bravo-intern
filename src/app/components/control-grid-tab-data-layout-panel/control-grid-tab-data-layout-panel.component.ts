import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { GridLayoutData } from 'src/app/shared/data-type';
import { IWjFlexColumnConfig } from 'src/app/shared/data-type/wijmo-data.type';

@Component({
  selector: 'app-control-grid-tab-data-layout-panel',
  templateUrl: './control-grid-tab-data-layout-panel.component.html',
  styleUrls: ['./control-grid-tab-data-layout-panel.component.scss']
})
export class ControlGridTabDataLayoutPanelComponent implements OnInit, OnDestroy {
  @Input() dataSource!: any[];
  @Input() layoutConfig!: GridLayoutData.IGridLayout;
  @Input() wjFlexColumnConfig!: IWjFlexColumnConfig;
  @Output() flexTabInitialized = new EventEmitter<wjcGrid.FlexGrid>();
  public configLayout = {
    row: {
      rowOfNumber: 2,
      arrayUnitRow: [
        "3rem",
        "calc(100% - 3rem)"
      ]
    },
    column: {
      columnOfNumber: 1
    }
  }
  constructor() { }


  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.flexTabInitialized.unsubscribe();
  }
  //** */
  public flexInitialized(flexGrid: wjcGrid.FlexGrid) {
    this.flexTabInitialized.emit(flexGrid);
  }
  public onClickTab(): void {
    //**next signal here */
  }
}
