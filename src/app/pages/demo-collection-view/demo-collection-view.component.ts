import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { map, Observable, tap, AsyncSubject, switchMap, of, Subject, combineLatest, startWith, takeUntil, interval, takeWhile } from 'rxjs';
import * as wjcInput from '@grapecity/wijmo.input';
import { setCss, PropertyGroupDescription, IPredicate, IGetError, IEventHandler, NotifyCollectionChangedEventArgs, EventArgs, CancelEventArgs, ObservableArray, Event, Binding, asFunction, createElement, tryCast, isNullOrWhiteSpace, SortDescription, Globalize, ArrayBase, CollectionView } from '@grapecity/wijmo';
@Component({
  selector: 'app-demo-collection-view',
  templateUrl: './demo-collection-view.component.html',
  styleUrls: ['./demo-collection-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoCollectionViewComponent implements OnInit, OnDestroy {
  private selectedSubject = new Subject();
  private notifierCompleted = new Subject();
  public selectedAction = this.selectedSubject.asObservable().pipe(takeUntil(this.notifierCompleted));
  public products$ = this._http.get<any>('https://dummyjson.com/products').pipe(takeUntil(this.notifierCompleted));
  public productWithSelectedAction$ = combineLatest([this.products$, this.selectedAction.pipe(startWith(1))]).pipe(takeUntil(this.notifierCompleted),
    map(([{ products }, selectNumber]) => {
      this.arr = new CollectionView(products, {
        trackChanges: true,
        newItemCreator: () => {
          return {};
        }
      });

      this.arr.trackChanges = true;
      this.arr.filter = (item) => { // filter
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
      };
      this.arr.groupDescriptions.clear();
      this.arr.groupDescriptions.push(new PropertyGroupDescription('rating', (item) => { // add group
        if (item.price > 1000) return 'High';
        if (item.price > 500 && item.age < 1000) return 'Medium';
        return 'Low';
      }))
      //get isEmpty
      let isEmpty = this.arr.isEmpty;
      //get total number of items in view taking paging into account
      let itemCount = this.arr.itemCount;
      //get items in current view
      let items = this.arr.items
      //get itemsSource
      let itemsSource = this.arr.sourceCollection;
      //newItemCreator
      let newItem = this.arr.newItemCreator();
      //pageCount
      let pageCount = this.arr.pageCount;
      console.log(pageCount);
      return this.arr;
    }),
    switchMap(({ groups, ...rest }) => {
      let productsByGrp = groups.map(gr => {
        return {
          name: gr.name,
          products: gr.items
        }
      })
      return of(productsByGrp);
    })
  )

  private stopObs() {
    this.notifierCompleted.next(null);
    this.notifierCompleted.complete();
  }

  public arr!: CollectionView;
  constructor(private _http: HttpClient) { }


  ngOnInit(): void {
    const observable = new ObservableArray();
    observable.collectionChanged.addHandler((s: ObservableArray<any>, e: NotifyCollectionChangedEventArgs<any>) => {
      console.log(e);
    })

    interval(1000).pipe(takeWhile(item => item < 5)).subscribe(data => observable.push(data))
  }
  ngOnDestroy(): void {
    this.stopObs();
  }
  selectChangeHandler(e: any): void {
    this.selectedSubject.next(+e.target.value);
  };
}
