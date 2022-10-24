import { Component, OnInit, Renderer2 } from '@angular/core';
import { HttpProductService } from 'src/app/shared/services/http-product.service';
import { IWjFlexColumnConfig, IWjFlexLayoutConfig } from 'src/app/shared/data-type/wijmo-data.type';
import { HttpLayoutService } from 'src/app/shared/services/http-layout.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-product-grid-data',
  templateUrl: './product-grid-data.component.html',
  styleUrls: ['./product-grid-data.component.scss']
})
export class ProductGridDataComponent implements OnInit {
  public products$ = this.httpProductService.products$;
  public wijFlexLayout$: Observable<IWjFlexLayoutConfig> = this.httpLayoutService.wijFlexLayout$
  public wijFlexColumnConfig$: Observable<IWjFlexColumnConfig> = this.httpLayoutService.wijFlexColumnConfig$;
  //**Constructor */
  constructor(private httpProductService: HttpProductService, private httpLayoutService: HttpLayoutService) { }
  //**Lifecycle hooks
  ngOnInit(): void {
  }
}
