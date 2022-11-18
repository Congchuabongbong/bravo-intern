import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { map, Observable, tap, AsyncSubject, switchMap, of, Subject, combineLatest, startWith, takeUntil, interval, takeWhile, filter, merge } from 'rxjs';
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
  public selectedAction = this.selectedSubject.asObservable().pipe(takeUntil(this.notifierCompleted), tap((selectNumber) => {
    console.log(selectNumber);
    this.arr.filter = (item: any) => {
      switch (selectNumber) {
        case 1:
          return item.price > 1000;
        case 2:
          return (item.price < 1000) && (item.price > 500);
        case 3:
          return item.price < 100;
        default:
          return item;
      }
    }
  }));
  public products$ = this._http.get<any>('https://dummyjson.com/products').pipe(takeUntil(this.notifierCompleted), tap(({ products }) => {
    this.arr = new CollectionView(products, {
      trackChanges: true,
      canAddNew: true,
      canCancelEdit: true,
      pageSize: 4,
      newItemCreator: () => ({}),
      //... config here....
    });
    this.arr.groupDescriptions.clear();
    this.arr.groupDescriptions.push(new PropertyGroupDescription('rating', (item) => { // add group
      if (item.price > 1000) return 'High';
      if (item.price > 500 && item.age < 1000) return 'Medium';
      return 'Low';
    }))
    this.arr.sortDescriptions.push(new SortDescription('price', false));
  }));
  public productWithSelectedAction$ = combineLatest([this.products$, this.selectedAction.pipe(startWith(1)), this.addNewAction$.pipe(startWith(null))]).pipe(takeUntil(this.notifierCompleted),
    map(([{ products }, selectNumber, itemNew]) => {
      this.arr.moveToNextPage();
      return this.arr;
    }),
    map(({ groups, ...rest }) => {
      let productsByGrp = groups.map(gr => {
        return {
          name: gr.name,
          products: gr.items
        }
      })
      return productsByGrp
    })
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
