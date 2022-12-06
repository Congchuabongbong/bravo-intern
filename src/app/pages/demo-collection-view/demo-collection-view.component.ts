import { Worksheet } from 'exceljs';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ElementRef, createPlatform } from '@angular/core';
import { map, Observable, tap, AsyncSubject, switchMap, of, Subject, combineLatest, startWith, takeUntil, interval, takeWhile, filter, merge, finalize, delay, throwError, from, scan, takeLast } from 'rxjs';
import * as wjcInput from '@grapecity/wijmo.input';
import { setCss, assert, closest, closestClass, clamp, PropertyGroupDescription, IPredicate, IGetError, IEventHandler, NotifyCollectionChangedEventArgs, EventArgs, CancelEventArgs, ObservableArray, Event, Binding, asFunction, createElement, tryCast, isNullOrWhiteSpace, SortDescription, Globalize, ArrayBase, CollectionView } from '@grapecity/wijmo';
import * as Excel from 'exceljs';
import * as FileSaver from 'file-saver';


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
    }));
    this.arr.sortDescriptions.push(new SortDescription('price', false));
  }));
  public productWithSelectedAction$ = combineLatest([this.products$, this.selectedAction$]).pipe(takeUntil(this.notifierCompleted),
    delay(0)
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
      };
      return this.arr;
    }),
    map(({ groups, ...rest }) => {
      this.dataVw = groups.map(gr => {
        return {
          name: gr.name,
          products: gr.items.map(item => ({ id: item.id, title: item.title, price: item.price, rating: item.price, thumbnail: item.thumbnail }))
        };
      });
      return this.dataVw;
    }),
    tap(() => this.isLoading = false)
  );

  private stopObs() {
    this.notifierCompleted.next(null);
    this.notifierCompleted.complete();
  }

  public arr!: CollectionView;
  public dataVw!: any[];

  //**WorkBook and WorkSheet declaration here */
  public workBook: Excel.Workbook = new Excel.Workbook();
  public workSheet!: Excel.Worksheet;

  //**constructor */
  constructor(private _http: HttpClient, private _el: ElementRef) { }


  ngOnInit(): void {
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


  public generateHeader(colKey: any[], colHeader?: any[]): Partial<Excel.Column>[] {
    let headers = colKey.map((key, index) => {
      return {
        header: colHeader && colHeader[index] || key,
        key: key
      };
    });
    return headers;
  }




  public async printDirect() {

    this.workSheet = this.workBook.addWorksheet();
    let tdHead = this._el.nativeElement.querySelectorAll('th') as HTMLTableCellElement[];
    const cols: any[] = [];
    from(tdHead).pipe(
      map((td) => {
        cols.push({
          header: td.textContent,
          style: getComputedStyle(td)
        });
        return cols;
      }),
      takeLast(1)
    ).subscribe(td => {
      this.workSheet.columns = td;
    });

    let tdCell = this._el.nativeElement.querySelectorAll('tr') as HTMLTableRowElement[];

    tdCell.forEach((tRow) => {

    });

    // let headers = Object.keys(this.dataVw[0].products[0]).map(key => key);
    // this.workSheet.columns = this.generateHeader(headers, ['Id', 'Title', 'Price', 'Rating', 'Thumbnail']);
    console.log(tdCell.length);
    // console.log(tdCell.length);



    // this.dataVw.forEach(data => {
    //   data.products.forEach((product: any) => {
    //     let row = this.workSheet.addRow(Object.values(product));
    //     row.height = 37;
    //     row.eachCell({ includeEmpty: true }, (cell, colNumber) => {

    //       cell.fill = {
    //         type: 'pattern',
    //         pattern: 'solid', //darkVertical
    //         fgColor: {
    //           argb: '0000FF',
    //         },
    //       }

    //     })
    //   })
    // });
    // console.log(this.workSheet.actualRowCount * this.workSheet.getRow(1).actualCellCount)



    const buf = await this.workBook.xlsx.writeBuffer();
    FileSaver.saveAs(new Blob([buf]), `demo.xlsx`);
  }

}
