import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mergeMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpProductService {

  constructor(private _http: HttpClient) { }
  public products$ = this._http.get<any>('assets/data/product-data.json').pipe(mergeMap(({ vB20Item, ...rest }) => {
    return of(vB20Item);
  }))
}
