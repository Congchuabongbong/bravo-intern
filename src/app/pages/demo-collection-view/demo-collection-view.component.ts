import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { map, Observable, tap, AsyncSubject, switchMap, of, Subject, combineLatest, startWith, takeUntil, interval, takeWhile, filter, merge, finalize, delay } from 'rxjs';
import * as wjcInput from '@grapecity/wijmo.input';
import { setCss, assert, closest, closestClass, clamp, PropertyGroupDescription, IPredicate, IGetError, IEventHandler, NotifyCollectionChangedEventArgs, EventArgs, CancelEventArgs, ObservableArray, Event, Binding, asFunction, createElement, tryCast, isNullOrWhiteSpace, SortDescription, Globalize, ArrayBase, CollectionView } from '@grapecity/wijmo';
@Component({
  selector: 'app-demo-collection-view',
  templateUrl: './demo-collection-view.component.html',
  styleUrls: ['./demo-collection-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoCollectionViewComponent implements OnInit, OnDestroy {
  private selectedSubject = new Subject<number>();
  private notifierCompleted = new Subject();
  public isLoading: boolean = true;
  public selectedAction$ = this.selectedSubject.asObservable().pipe(takeUntil(this.notifierCompleted), startWith(0), tap(() => this.isLoading = true));
  public products$ = this._http.get<any>('https://dummyjson.com/products').pipe(takeUntil(this.notifierCompleted), tap(({ products }) => {
    this.arr = new CollectionView(products, {
      trackChanges: true,
      canAddNew: true,
      canCancelEdit: true,
      pageSize: 0,
      newItemCreator: (): any => ({}),
      //... config here....
    });
    this.arr.groupDescriptions.clear();
    this.arr.groupDescriptions.push(new PropertyGroupDescription('rating', (item) => { // add group
      if (item.price > 1000) return 'High';
      else if (item.price > 500 || item.age < 1000) return 'Medium';
      return 'Low';
    }))
    this.arr.sortDescriptions.push(new SortDescription('price', false));
  }));
  public productWithSelectedAction$ = combineLatest([this.products$, this.selectedAction$]).pipe(takeUntil(this.notifierCompleted),
    delay(2000)
    , map(([{ products }, selectNumber]) => {
      this.arr.filter = (item: any) => {
        switch (selectNumber) {
          case 0:
            return item;
          case 1:
            return item.price > 1000;
          case 2:
            return ((item.price < 1000) && (item.price > 500));
          case 3:
            return item.price < 500;
          default:
            return item;
        }
      }
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
    }),
    tap(() => this.isLoading = false)
  )

  private stopObs() {
    this.notifierCompleted.next(null);
    this.notifierCompleted.complete();
  }

  public arr!: CollectionView;
  constructor(private _http: HttpClient, private _el: ElementRef) { }


  ngOnInit(): void {
    console.log(clamp(-1, 0, 3));
    // assert(false, 'something is wrong')
  }
  ngOnDestroy(): void {
    this.stopObs();
  }
  selectChangeHandler(e: any): void {
    this.selectedSubject.next(+e.target.value as number);
  };

  public onHandleAddNewItem(): void {
    this.arr.addNew({ id: 1, title: 'something', price: 2000 }, true);
  }
  public printDirect() {
    window.print();

  }

}