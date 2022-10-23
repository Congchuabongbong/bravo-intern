import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataSubject: Subject<any> = new Subject<any>();
  public data$: Observable<any> = this.dataSubject.asObservable();
  public dataByEvent: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }
  public sendData(data: any) {
    this.dataSubject.next(data);
  }
  public sendDataByEventEmitter(data: any) {
    this.dataByEvent.emit(data);
  }
}
