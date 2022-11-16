import { FormBuilder, FormGroup, Validator } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { from, map, Observable, tap, AsyncSubject } from 'rxjs';
import * as wjcInput from '@grapecity/wijmo.input';
import { setCss, PropertyGroupDescription, IPredicate, IGetError, IEventHandler, EventArgs, CancelEventArgs, Event, Binding, asFunction, createElement, tryCast, isNullOrWhiteSpace, SortDescription, Globalize, ArrayBase, CollectionView } from '@grapecity/wijmo';
import { CustomControlComponent } from 'src/app/components/custom-control/custom-control.component';
import { SelectControlPanelComponent } from 'src/app/components/select-control-panel/select-control-panel.component';
import { WjComboBox } from '@grapecity/wijmo.angular2.input'
import { FormatItemEventArgs } from '@grapecity/wijmo.input';

interface IDataItem {
  product: string,
  brand: string,
  unitPrice: number,
  qty: number,
  shipped: boolean
}
interface ICalcDataItem extends IDataItem {
  fullName: string;
  allCaps: string;
  totalPrice: number,
  tax: number;
}
@Component({
  selector: 'app-test-base-control',
  templateUrl: './test-base-control.component.html',
  styleUrls: ['./test-base-control.component.scss'],

})
export class TestBaseControlComponent implements OnInit, AfterViewInit {
  //**declaration Input, Output, ViewChild*/
  public comboSelect!: SelectControlPanelComponent;
  public products$ = this._http.get<any>('https://dummyjson.com/products');
  public displayMemberPath$ = this._http.get<any>('https://dummyjson.com/products').pipe(map((data) => {
    return Object.keys(data.products[0]);
  }));
  public biding = new Binding('title');
  public formDemo!: FormGroup;
  public sub = new AsyncSubject();
  public arr = new CollectionView([{ name: 'somebody', age: 21 }, { name: 'someone', age: 81 }, { name: 'anonymous', age: 11 }]
  );
  @ViewChild('button', { static: true }) btnSubmit!: ElementRef;
  //** declared property here */

  //** constructor */
  constructor(private _http: HttpClient, private _fb: FormBuilder) { }

  //** lifecycle here */
  ngOnInit(): void {
    this.formDemo = this._fb.group({
      item: [{ value: "", disabled: false }],
    })
  }

  ngAfterViewInit(): void {
    // this.arr.filter = (item: { name: string, age: number }) => {
    //   return item.age < 18
    // };
    this.arr.groupDescriptions.clear();
    this.arr.groupDescriptions.push(new PropertyGroupDescription('age', (item: { age: number }) => {
      if (item.age > 18) return 'High';
      if (item.age < 18 && item.age > 18) return 'Medium';
      return 'Low';
    })
    );

    console.log(this.arr.groupDescriptions[0]);




  }

  public onClick(): void {
    console.log(this.formDemo.value);
  }
  //Select box
  public initializedSelectBox(comboBox: SelectControlPanelComponent): void {
    const e: CancelEventArgs = new CancelEventArgs();
    this.comboSelect = comboBox;
    comboBox.initialize({
      headerPath: 'id',
      displayMemberPath: 'title',
      selectedValuePath: 'brand',
    })
    comboBox.selectedIndexChanged.addHandler(() => {

    });
    comboBox.itemsSourceChanged.addHandler(() => {

    });
    comboBox.collectionView.sortDescriptions.push(new SortDescription('rating', true));
    // setTimeout(() => {
    //   comboBox.itemsSource = [new Date(2019, 0, 1), new Date(2019, 1, 12), new Date(2019, 1, 22), new Date(2019, 4, 13), new Date(2019, 4, 24), new Date(2019, 8, 19)]
    //   comboBox.formatItem.addHandler((sender: SelectControlPanelComponent, e: FormatItemEventArgs) => {
    //     e.item.textContent = Globalize.format(e.data, 'dd', true)
    //   });
    // }, 4000);

  }

  onSelectedChanged(comboBox: SelectControlPanelComponent, e?: EventArgs): void {
    console.log(comboBox.selectedItem);
  };
  onChanged(value: string): void {
    this.comboSelect.displayMemberPath = value;
  }


  public initializedComboBox(comboBox: WjComboBox) {

  }
}
