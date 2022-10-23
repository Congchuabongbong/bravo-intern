import { AfterViewInit, Component, EventEmitter, OnInit, Renderer2, RendererStyleFlags2, ViewChild } from '@angular/core';
import { HttpProductService } from 'src/app/shared/services/http-product.service';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { map, of } from 'rxjs';
import { categorizeBulkWriteRows } from 'rxdb';

@Component({
  selector: 'app-product-grid-data',
  templateUrl: './product-grid-data.component.html',
  styleUrls: ['./product-grid-data.component.scss']
})
export class ProductGridDataComponent implements OnInit, AfterViewInit {
  @ViewChild('wjFlex', { static: false }) wjFlex!: wjcGrid.FlexGrid;
  public products$ = this.httpProductService.products$;
  public rowCount!: string;
  public cellCount!: string;

  public layoutConfig = {
    row: {
      rowOfNumber: 2, arrayUnitRow: [
        "60%", "40%"
      ],
    },
    column: {
      columnOfNumber: 1
    }
  };
  public positionLineGridData = {
    rowLine: {
      startLine: 1,
      endLine: 2
    },
    columnLine: {
      startLine: 1,
      endLine: 2
    }
  }
  public positionLineTabGridData = {
    rowLine: {
      startLine: 2,
      endLine: 3
    },
    columnLine: {
      startLine: 1,
      endLine: 2
    }
  }
  //**Constructor */
  constructor(private httpProductService: HttpProductService, private _renderer: Renderer2) { }

  //**Lifecycle hooks
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {

  }
  //
  public flexInitialized(flexGrid: wjcGrid.FlexGrid) {
    this.rowCount = flexGrid.rows.length.toString();
    this.cellCount = flexGrid.hostElement.querySelectorAll('.wj-row').length.toString();
    flexGrid.allowDragging = wjcGrid.AllowDragging.Both; //-> allow dragging
    flexGrid.allowResizing = wjcGrid.AllowResizing.Both; // -> allow resizing
    flexGrid.headersVisibility = wjcGrid.HeadersVisibility.Column; // -> headers visibility
    //** format odd and even Id */
    flexGrid.formatItem.addHandler((flex, event) => {
      if (event.panel.cellType == wjcGrid.CellType.Cell) {
        let nameBindingColumn = event.getColumn()._binding._path; // -> get name binding column
        if (nameBindingColumn === 'Id') {
          let valueCell = +event.panel.getCellData(event.row, event.col, false);
          valueCell % 2 === 0 ? this._renderer.addClass(event.cell, 'even') : this._renderer.addClass(event.cell, 'odd');
        }
      }
    })
    //**selectionChanged;
    // flexGrid.selectionChanged.addHandler((s, e) => {
    //   console.log(s.selectedRanges);
    // })
    //**resizedColumn
    // flexGrid.resizedColumn.addHandler((s, e) => {
    //   console.log("resizedColumn")
    // })
    //** draggingColumn*/
    // flexGrid.draggingColumn.addHandler((s, e) => {
    //   console.log('draggingRow');
    // })
    //** copying*/
    // flexGrid.copying.addHandler((s, e) => {
    //   console.log('copying');
    // });
    //** autoSizedColumn*/
    // flexGrid.autoSizedColumn.addHandler((s, e) => {
    //   console.log('autoSizedColumn');
    // })
    //** rowEditEnded*/
    // flexGrid.rowEditEnded.addHandler((flex, event) => {
    //   console.log(flex.collectionView.currentItem);
    // })
    //**event updatedView 
    // flexGrid.updatedView.addHandler((s, e) => {
    //   this.rowCount = s.rows.length.toString();
    //   this.cellCount = s.hostElement.querySelectorAll('.wj-cell').length.toString();
    // });


    //**event scrollPositionChanged*/
    // flexGrid.scrollPositionChanged.addHandler((wjFlex, event) => {
    //   if (wjFlex.viewRange.bottomRow >= wjFlex.rows.length - 1) {
    //     alert('add more')
    //     let view = s.collectionView;
    //     let index = view.currentPosition; // keep position in case the view is sorted
    //     view.refresh();
    //     view.currentPosition = index;
    //     //**add row */
    //     for (let r = 0; r < 50; r++) {
    //       flexGrid.rows.push(new wjcGrid.Row());
    //     }
    //   }
    // });
  }
}
