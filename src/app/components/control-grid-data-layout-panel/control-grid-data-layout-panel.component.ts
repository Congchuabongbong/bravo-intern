import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ElementRef } from '@angular/core';
import { IWjFlexColumnConfig, IWjFlexLayoutConfig } from 'src/app/shared/data-type/wijmo-data.type';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { WijFlexGridService } from 'src/app/shared/services/wij-flex-grid.service';
@Component({
  selector: 'app-control-grid-data-layout-panel',
  templateUrl: './control-grid-data-layout-panel.component.html',
  styleUrls: ['./control-grid-data-layout-panel.component.scss']
})
export class ControlGridDataLayoutPanelComponent implements OnInit, OnDestroy {
  @Input() dataSource!: any[];
  @Input() dataTabSource!: any[];
  @Input() wjFlexColumnConfig!: IWjFlexColumnConfig;
  @Input() wijFlexLayout!: IWjFlexLayoutConfig;
  @Output() wijFlexMainInitialized = new EventEmitter<wjcGrid.FlexGrid>();
  @Output() wijFlexTabInitialized = new EventEmitter<wjcGrid.FlexGrid>();
  constructor(private _renderer: Renderer2, private wijFlexGridService: WijFlexGridService, private _el: ElementRef) { }

  ngOnInit(): void {
    this._renderer.setStyle(this._el.nativeElement, 'height', '100%');
    this._renderer.setStyle(this._el.nativeElement, 'display', 'block');
  }
  ngOnDestroy(): void {
    this.wijFlexMainInitialized.unsubscribe();
    this.wijFlexTabInitialized.unsubscribe();
  }
  //**Initialized */
  public flexMainInitialized(flexGrid: wjcGrid.FlexGrid) {
    this.wijFlexMainInitialized.emit(flexGrid);
    //**generate specify column */
    if (this.wjFlexColumnConfig) {
      this.wijFlexGridService.generateWijColumn(flexGrid, this.wjFlexColumnConfig)
    }
    //** format odd and even by Id */
    flexGrid.formatItem.addHandler((flex, event) => {
      if (event.panel.cellType == wjcGrid.CellType.Cell) {
        let nameBindingColumn = event.getColumn()._binding._path; // -> get name binding column
        if (nameBindingColumn === 'Id') {
          let valueCell = +event.panel.getCellData(event.row, event.col, false);
          valueCell % 2 === 0 ? this._renderer.addClass(event.cell, 'even') : this._renderer.addClass(event.cell, 'odd');
        }
      }
    })
  }
  public flexTabInitialized(flexGrid: wjcGrid.FlexGrid) {
    this.wijFlexTabInitialized.emit(flexGrid);
  }
}
