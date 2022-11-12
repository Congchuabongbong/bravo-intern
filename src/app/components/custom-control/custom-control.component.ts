import { updateStyle } from 'src/app/shared/utils/style.util';
import * as wjcInput from '@grapecity/wijmo.input';
import * as wjGrid from '@grapecity/wijmo.grid';
import { AfterViewInit, ElementRef, EventEmitter, inject, Injector, Input, OnDestroy, Output, TemplateRef, ViewChild } from '@angular/core';
import { Control, setCss, Event, EventArgs, CancelEventArgs, addClass } from '@grapecity/wijmo';
import { Component, OnInit } from '@angular/core'
import { WjComboBox } from '@grapecity/wijmo.angular2.input'

@Component({
  selector: 'app-custom-control',
  templateUrl: './custom-control.component.html',
  styleUrls: ['./custom-control.component.scss'],
  inputs: [],
  outputs: [],
})
export class CustomControlComponent extends Control implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('select', { static: true }) select!: ElementRef;
  //**@Input declaration */
  @Input() set itemsSource(value: any[]) {
    this._itemsSource = value;
    this.onGenerateOptions();
  }
  get itemsSource(): any[] {
    return this._itemsSource;
  }
  //**@Output declaration */

  //**Properties declaration */
  private _itemsSource!: any[];
  //**constructor */
  constructor(private _el: ElementRef, private _injector: Injector) {
    super(_el.nativeElement, _injector);
    _el.nativeElement.classList.add('wj-control');
  }

  //**lifecycle hooks


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }
  ngOnDestroy(): void {

  }
  public generateOptions(): void {
    this.itemsSource.forEach(item => {
      let option: HTMLOptionElement = document.createElement('option');
      option.value = item;
      option.text = item;
      (this.select.nativeElement as HTMLSelectElement).appendChild(option);
    })
  }
  public onGenerateOptions() {
    this.invalidate();
  }
  //** On update style */

  //**Override

  public override refresh(fullUpdate?: boolean | undefined): void {
    super.refresh(fullUpdate);
    if (this.hostElement) {
      this.generateOptions();
    }
  }

}
