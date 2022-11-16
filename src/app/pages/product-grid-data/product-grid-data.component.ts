import { Component, OnInit } from '@angular/core';
import { HttpProductService } from 'src/app/shared/services/http-product.service';
import { IWjFlexColumnConfig } from 'src/app/shared/data-type/wijmo-data.type';
import { HttpLayoutService } from 'src/app/shared/services/http-layout.service';
import { Observable } from 'rxjs';
import * as wjcGrid from '@grapecity/wijmo.grid';
@Component({
  selector: 'app-product-grid-data',
  templateUrl: './product-grid-data.component.html',
  styleUrls: ['./product-grid-data.component.scss']
})
export class ProductGridDataComponent implements OnInit {
  public products$ = this.httpProductService.products$;
  public wijFlexColumnConfig$: Observable<IWjFlexColumnConfig> = this.httpLayoutService.wijFlexColumnConfig$;
  //**Constructor */
  constructor(private httpProductService: HttpProductService, private httpLayoutService: HttpLayoutService) {
  }
  //**Lifecycle hooks
  ngOnInit(): void {

  }

  public flexMainInitialized(flexGrid: wjcGrid.FlexGrid) {
    flexGrid.allowDragging = wjcGrid.AllowDragging.Both; //-> allow dragging
    flexGrid.allowResizing = wjcGrid.AllowResizing.Both; // -> allow resizing
    // flexGrid.headersVisibility = wjcGrid.HeadersVisibility.Column; // -> headers visibility
    flexGrid.allowMerging = 1; // ->allow merging
  }

  public flexTabInitialized(flexGrid: wjcGrid.FlexGrid) {
    flexGrid.headersVisibility = wjcGrid.HeadersVisibility.Column; // -> headers visibility
  }
}
