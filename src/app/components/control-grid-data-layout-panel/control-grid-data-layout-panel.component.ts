import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { IWjFlexColumnConfig, IWjFlexLayoutConfig } from 'src/app/shared/data-type/wijmo-data.type';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { WijFlexGridService } from 'src/app/shared/services/wij-flex-grid.service';
@Component({
  selector: 'app-control-grid-data-layout-panel',
  templateUrl: './control-grid-data-layout-panel.component.html',
  styleUrls: ['./control-grid-data-layout-panel.component.scss']
})
export class ControlGridDataLayoutPanelComponent implements OnInit {
  @Input() dataSource!: any[];
  @Input() wjFlexColumnConfig!: IWjFlexColumnConfig;
  @Input() wijFlexLayout!: IWjFlexLayoutConfig;
  constructor(private _renderer: Renderer2, private wijFlexGridService: WijFlexGridService) { }
  ngOnInit(): void {
  }
  //**Initialized */
  public flexInitialized(flexGrid: wjcGrid.FlexGrid) {
    //**generate specify column */
    if (this.wjFlexColumnConfig) {
      this.wijFlexGridService.generateWijColumn(flexGrid, this.wjFlexColumnConfig)
    }
    flexGrid.allowDragging = wjcGrid.AllowDragging.Both; //-> allow dragging
    flexGrid.allowResizing = wjcGrid.AllowResizing.Both; // -> allow resizing
    flexGrid.headersVisibility = wjcGrid.HeadersVisibility.Column; // -> headers visibility
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
}
