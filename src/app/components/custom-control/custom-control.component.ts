import * as wjcInput from '@grapecity/wijmo.input';
import * as wjGrid from '@grapecity/wijmo.grid';
import { AfterViewInit, ElementRef, EventEmitter, Injector, Input, OnDestroy } from '@angular/core';
import { Control, setCss, Event, EventArgs, CancelEventArgs } from '@grapecity/wijmo';
import { Component, OnInit } from '@angular/core'


@Component({
  selector: 'app-custom-control',
  templateUrl: './custom-control.component.html',
  styleUrls: ['./custom-control.component.scss'],

})
export class CustomControlComponent extends wjcInput.InputDate implements OnInit, AfterViewInit, OnDestroy {
  @Input() set styleOptions(value: any) {
    this._styleOptions = value;
  }
  get styleOptions() {
    return this._styleOptions
  };
  private _styleOptions!: any;
  public updatedStyle = new Event<this, EventArgs>();
  public updatingStyle = new Event<this, CancelEventArgs>();
  private _updateStyle = new CancelEventArgs();
  constructor(_el: ElementRef, _injector: Injector) {
    super(_el.nativeElement, _injector);
  }
  ngOnDestroy(): void {
    this.updatedStyle.hasHandlers && this.updatedStyle.removeAllHandlers();
    this.updatingStyle.hasHandlers && this.updatingStyle.removeAllHandlers();
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.refreshed.addHandler(() => {
      console.log('refreshed'); // check refreshed
    }, this)
  }

  //** On update style */
  public onUpdatedStyle(styleOptions?: any): void {
    try {
      !this._updateStyle.cancel && this.beginUpdate();
      console.log(this._updating);
      styleOptions ??= this.styleOptions;
      this.updatingStyle.hasHandlers && this.onUpdating();
      styleOptions && !this._updateStyle.cancel && setCss(this.hostElement.querySelector('.wj-form-control'), styleOptions);
    } catch (error) {
      console.log(error);
    } finally {
      !this._updateStyle.cancel && this.endUpdate();
      !this._updateStyle.cancel && this.updatedStyle.hasHandlers && this.updatedStyle.raise(this);
      console.log(this._updating);
    }
  }

  public onUpdating(e?: CancelEventArgs) {
    e ??= this._updateStyle
    this.updatingStyle.raise(this, e);
  }
  //**Override valueChanged */
  override valueChanged = new Event<this, EventArgs>();
  override onValueChanged(e?: EventArgs | undefined): void {
    this.valueChanged.raise(this, e)
  }
}
