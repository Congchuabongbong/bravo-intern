import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import * as wjcInput from '@grapecity/wijmo.input';
import { setCss, IEventHandler, EventArgs, CancelEventArgs, Event } from '@grapecity/wijmo';
import { CustomControlComponent } from 'src/app/components/custom-control/custom-control.component';

@Component({
  selector: 'app-test-base-control',
  templateUrl: './test-base-control.component.html',
  styleUrls: ['./test-base-control.component.scss']
})
export class TestBaseControlComponent implements OnInit, AfterViewInit {
  //**declaration Input, Output, ViewChild*/
  @ViewChild('inputDate') inputDate!: CustomControlComponent;

  //** declared property here */
  public styleOptions: any = {
    background: 'red',
    border: '5px solid yellow',
  }
  public background: any;
  public border: any;
  public padding: any;
  public value = new Date('2022-01-31');
  //** constructor */
  constructor(private _http: HttpClient) { }

  //** lifecycle here */
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.inputDate.onValueChanged();
    this.inputDate.valueChanged.addHandler((sender: CustomControlComponent, e: EventArgs) => {
      // alert(`Value have changed ${sender.value}`)
    }, this);
    //** Handle on style updated */
    this.inputDate.updatedStyle.addHandler((sender: CustomControlComponent, e: EventArgs) => {

    }, this);
    //** Handle on style updating */
    this.inputDate.updatingStyle.addHandler((sender: CustomControlComponent, e: CancelEventArgs) => {
      e.cancel = true;
      alert('updating style!')
    })
  }

  public onClick(): void {
    this.inputDate.onUpdatedStyle({
      background: this.background ??= 'yellow',
      border: this.border ??= '5px solid red',
      padding: this.padding ??= '10px'
    });
  }

  inputInitialized(inputDate: CustomControlComponent) {
    console.log(inputDate);
  }
}
