import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IWjFlexColumnConfig, IWjFlexLayoutConfig } from '../data-type/wijmo-data.type';


@Injectable({
  providedIn: 'root'
})
export class HttpLayoutService {
  public formTabs$: Observable<any> = this._http.get<any>('assets/data/layout-form.data.json');
  public wijFlexLayout$: Observable<IWjFlexLayoutConfig> = this._http.get<any>('assets/data/wjFlex-layout-config.data.json');
  public wijFlexColumnConfig$: Observable<IWjFlexColumnConfig> = this._http.get<any>('assets/data/colFlex-product-config.data.json');

  constructor(private _http: HttpClient) { };


}
