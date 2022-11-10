import { FormBuilder, FormGroup, Validator } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { from, map, Observable, tap } from 'rxjs';
import * as wjcInput from '@grapecity/wijmo.input';
import { setCss, IEventHandler, EventArgs, CancelEventArgs, Event, Binding } from '@grapecity/wijmo';
import { CustomControlComponent } from 'src/app/components/custom-control/custom-control.component';
import { SelectControlPanelComponent } from 'src/app/components/select-control-panel/select-control-panel.component';
import { WjComboBox } from '@grapecity/wijmo.angular2.input'

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

  }

  public onClick(): void {
    console.log(this.formDemo.value);
  }
  //Select box
  public initializedSelectBox(comboBox: SelectControlPanelComponent): void {
    this.comboSelect = comboBox;
    comboBox.headerPath = 'id';
    comboBox.displayMemberPath = 'title'
    comboBox.selectedValuePath = 'title'
    comboBox.selectedIndex = 10;
    comboBox.selectedIndexChanged.addHandler(() => { console.log(comboBox.selectedItem); });
  }

  onSelectedChanged(comboBox: SelectControlPanelComponent, e?: EventArgs): void {
    console.log(comboBox.selectedItem);
  };
  onChanged(value: string): void {
    this.comboSelect.displayMemberPath = value;
  }
}
