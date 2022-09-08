import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataSource: Subject<any> = new Subject<any>();
  public data: Observable<any> = this.dataSource.asObservable();
  constructor() {}
  public sendData(data: any) {
    this.dataSource.next(data);
  }
}
