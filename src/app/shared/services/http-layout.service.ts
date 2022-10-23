import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class HttpLayoutService {
  public formTabs$ = this._http.get<any>('assets/data/layout-form.data.json');
  constructor(private _http: HttpClient) { }
}
