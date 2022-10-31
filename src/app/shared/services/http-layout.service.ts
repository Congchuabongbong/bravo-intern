import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, tap } from 'rxjs';
import { IWjFlexColumnConfig, IWjFlexLayoutConfig, IWjFlexLayoutConfigs } from '../data-type/wijmo-data.type';

@Injectable({
  providedIn: 'root'
})
export class HttpLayoutService {
  public formTabs$: Observable<any> = this._http.get<any>('assets/data/layout-form.data.json');

  public wijFlexColumnConfig$: Observable<IWjFlexColumnConfig> = this._http.get<any>('assets/data/colFlex-product-config.data.json');
  constructor(private _http: HttpClient) {
  };

  private selectedLayoutSubject = new BehaviorSubject<number>(2);
  public selectedLayoutAction$ = this.selectedLayoutSubject.asObservable();
  public selectedLayoutChange(value: number): void {
    this.selectedLayoutSubject.next(value)
  }
  public wijFlexLayout$: Observable<IWjFlexLayoutConfig> = combineLatest([this._http.get<IWjFlexLayoutConfigs>('assets/data/wjFlex-layout-config.data.json'), this.selectedLayoutAction$]).pipe(
    map(([layoutConfig, layoutNumber]) => (layoutConfig.layouts[layoutNumber])),
    tap(data => console.log(JSON.stringify(data)))
  );
}
