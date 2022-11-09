import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
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
  //** declared property here */

  //** constructor */
  constructor(private _http: HttpClient) { }

  //** lifecycle here */
  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }

  public onClick(): void {

  }
  //Select box
  public initializedSelectBox(comboBox: SelectControlPanelComponent): void {
    this.comboSelect = comboBox;
    comboBox.headerPath = 'id';
    comboBox.displayMemberPath = 'title'
    comboBox.selectedIndex = 10;
    comboBox.selectedIndexChanged.addHandler((sender: SelectControlPanelComponent) => {
      console.log(sender.selectedIndex);
    }, this)
  }

  onChanged(value: string): void {
    this.comboSelect.displayMemberPath = value;
  }
  // ComboBox
  initializedComboBox(comboBox: WjComboBox) {
    // comboBox.refreshed.addHandler(() => {
    //   console.log('refreshed!');
    // });




    // comboBox.autoExpandSelection = false
    // setTimeout(() => {
    //   comboBox.displayMemberPath = 'title';
    //   comboBox.headerPath = 'title' // chọn trường của 
    // }, 5000);
    // comboBox.handleWheel = true; // cho phép lăn chuột thay đổi giá trị input
    // comboBox.inputElement.style.border = '1px solid red'; //-> lấy ra input custom input
    // comboBox.inputType = 'text' //-> set type for input
    // comboBox.isAnimated = true;
    // comboBox.isContentHtml = true;
    // comboBox.isDisabled = false;  //default is false
    // comboBox.isDroppedDown = false; //fault false
    // comboBox.isEditable = true;
    // comboBox.selectedValuePath = 'title';
    // console.log(comboBox.getDisplayText());
    // comboBox.selectedIndex = 10
  }


}
