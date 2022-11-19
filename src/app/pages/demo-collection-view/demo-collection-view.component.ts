import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { map, Observable, tap, switchMap, of, Subject, combineLatest, startWith, takeUntil, interval, takeWhile, filter, merge } from 'rxjs';
import * as wjcInput from '@grapecity/wijmo.input';
import { setCss, PropertyGroupDescription, IPredicate, IGetError, IEventHandler, NotifyCollectionChangedEventArgs, EventArgs, CancelEventArgs, ObservableArray, Event, Binding, asFunction, createElement, tryCast, isNullOrWhiteSpace, SortDescription, Globalize, ArrayBase, CollectionView } from '@grapecity/wijmo';
@Component({
  selector: 'app-demo-collection-view',
  templateUrl: './demo-collection-view.component.html',
  styleUrls: ['./demo-collection-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoCollectionViewComponent implements OnInit, OnDestroy {
  private selectedSubject = new Subject<number>();
  private addNewSubject = new Subject<any>();
  public addNewAction$ = this.addNewSubject.asObservable();
  private notifierCompleted = new Subject();
  public selectedAction = this.selectedSubject.asObservable();
  public products$ = this._http.get<any>('https://dummyjson.com/products').pipe(
    takeUntil(this.notifierCompleted));
  public productWithSelectedAction$ = combineLatest([this.products$, this.selectedAction.pipe(startWith(1)), this.addNewAction$.pipe(startWith(null))]).pipe(takeUntil(this.notifierCompleted),

  )


  private stopObs() {
    this.notifierCompleted.next(null);
    this.notifierCompleted.complete();
  }

  public arr!: CollectionView;
  constructor(private _http: HttpClient) { }


  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.stopObs();
  }
  selectChangeHandler(e: any): void {
    this.selectedSubject.next(+e.target.value as number);
  };

  public onHandleAddNewItem(): void {
    this.addNewSubject.next(null);
  }

}
