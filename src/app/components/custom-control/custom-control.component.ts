import { updateStyle } from 'src/app/shared/utils/style.util';
import * as wjcInput from '@grapecity/wijmo.input';
import * as wjGrid from '@grapecity/wijmo.grid';
import { AfterViewInit, ElementRef, EventEmitter, Injector, Input, OnDestroy, Output } from '@angular/core';
import { Control, setCss, Event, EventArgs, CancelEventArgs } from '@grapecity/wijmo';
import { Component, OnInit } from '@angular/core'


@Component({
  selector: 'app-custom-control',
  templateUrl: './custom-control.component.html',
  styleUrls: ['./custom-control.component.scss'],
  inputs: ['value'],
})
export class CustomControlComponent extends wjcInput.InputDate implements OnInit, AfterViewInit, OnDestroy {
  @Input() set styleOptions(value: any) {
    this._styleOptions = value;
  }
  get styleOptions() {
    return this._styleOptions
  };

  @Output() initializeInputDate = new EventEmitter<any>();

  private _styleOptions!: any;
  public updatedStyle = new Event<this, EventArgs>();
  public updatingStyle = new Event<this, CancelEventArgs>();
  private _updateStyle = new CancelEventArgs();
  //**constructor */
  constructor(_el: ElementRef, _injector: Injector) {
    super(_el.nativeElement, _injector);
  }
  //**lifecycle hooks
  ngOnDestroy(): void {
    this.updatedStyle.hasHandlers && this.updatedStyle.removeAllHandlers();
    this.updatingStyle.hasHandlers && this.updatingStyle.removeAllHandlers();
  }

  ngOnInit(): void {
    this.refreshed.addHandler(() => {
      console.log('refreshed');
      console.log(this._updating);
    })
    this.initializeInputDate.emit();
  }

  ngAfterViewInit(): void {

  }

  //** On update style */
  public onUpdatedStyle(styleOptions?: any, e?: EventArgs): void {
    this.styleOptions = styleOptions
    this.styleOptions && this.invalidate();

    // this.deferUpdate(() => {

    // })

    // this.styleOptions && this.beginUpdate();
    // setTimeout(() => {
    //   this.endUpdate();
    // }, 4000);
    this.updatedStyle.hasHandlers && this.updatedStyle.raise(this, e)
  }

  public onUpdating(e?: CancelEventArgs) {
    e ??= this._updateStyle
    this.updatingStyle.raise(this, e);
  }
  //**Override
  override valueChanged = new Event<CustomControlComponent, EventArgs>();
  override onValueChanged(e?: EventArgs | undefined): void {
    super.onValueChanged(e);
    this.valueChanged.raise(this, e)
  }

  override refresh(fullUpdate?: boolean | undefined): void {
    super.refresh(fullUpdate); // -> using refresh from parent component.
    if (this.hostElement) {
      this.styleOptions && setCss(this.hostElement.querySelector('.wj-form-control'), this.styleOptions)
    }
  }
  //draw input style


}
