import { Control, EventArgs, addClass, Binding } from '@grapecity/wijmo';
import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, OnDestroy, AfterViewInit } from '@angular/core';
import { from, tap } from 'rxjs';

@Component({
  selector: 'BravoComboBox',
  templateUrl: './select-control-panel.component.html',
  styleUrls: ['./select-control-panel.component.scss']
})
export class SelectControlPanelComponent extends Control implements OnInit, AfterViewInit, OnDestroy {
  //**Input
  @Input() set itemsSource(value: any[]) {
    if (this._itemsSource != value) {
      this._itemsSource = value;
      this.onGenerateOptions();
    }
  }
  get itemsSource(): any[] {
    return this._itemsSource;
  };
  @Input() set displayMemberPath(value: string) {
    this._displayMemberPath = value;
    this._displayMemberBinding = new Binding(value)
    this._isGenerated && this._updateBindText();
  }
  get displayMemberPath(): string {
    return this._displayMemberPath;
  };

  @Input() set headerPath(value: string) {
    this._headerPath = value;
    this._headerBinding = new Binding(value);
    this._isGenerated && this._updateBindingValue();
  }
  get headerPath(): string {
    return this._headerPath;
  }
  @Input() set selectedIndex(value: number) {
    this._selectedIndex = value;
  }
  get selectedIndex(): number {
    return this._selectedIndex;
  }
  //**Output
  @Output('initialize') initializedNg = new EventEmitter<any>();
  //**Event


  //**Properties Declaration
  static controlTemplate = '<select wj-part="select"></select>';
  private _select!: HTMLSelectElement;
  private _options!: HTMLOptionsCollection;
  private _itemsSource!: any[];
  private _displayMemberPath!: string;
  private _displayMemberBinding!: Binding;
  private _headerPath!: string;
  private _headerBinding!: Binding;
  private _initialized: boolean = false;
  private _isGenerated: boolean = false;
  private _selectedIndex: number = -1;
  get selectElement(): HTMLElement {
    return this._select;
  }
  //**constructor */
  constructor(_el: ElementRef, _injector: Injector) {
    super(_el.nativeElement) //-> call parent constructor
    this.applyTemplate('wj-control', this.getTemplate(), { //->apply template for control 
      _select: 'select',
    })
    addClass(this.hostElement, "br-combobox");
    addClass(this._select, "br-select");
    this._initialized = !0;
  }
  //**Lifecycle methods
  ngOnInit(): void {
    //**Emit Event support via Output*/
    this.initializedNg.emit(); //-> emit event when component is initialized
    this.refreshed.addHandler(() => {
      console.log('refreshed!');
    })


  }
  ngAfterViewInit(): void {

  }
  ngOnDestroy(): void {
    this.initializedNg.unsubscribe();
    this.removeEventListener(this.hostElement);
    this.removeEventListener(this._select);
  }

  //**Override method properties of the control class
  override refresh(fullUpdate?: boolean | undefined): void {
    super.refresh(fullUpdate);
    if (this.hostElement) {
      !this._isGenerated && this._generateOptions();
    }
  }

  //**method Properties of control */
  private _generateOptions(): void {
    from(this.itemsSource).pipe(tap(item => {
      let option: HTMLOptionElement = document.createElement("option");
      addClass(option, 'br-listbox-item')
      if (typeof item === 'object') {
        this._headerBinding ? this._setValue(option, item) : option.value = item;
        this._displayMemberBinding ? this._setText(option, item) : option.text = item;
      } else {
        option.value = item;
        option.text = item;
      }
      this._select.appendChild(option);
    })).subscribe().unsubscribe();
    this._options = this._select.options;
    this._isGenerated = true;
  }

  private _setText(option: HTMLOptionElement, value: any): void {
    option.text = this._displayMemberBinding.getValue(value);
  }
  private _setValue(option: HTMLOptionElement, value: any): void {
    option.value = this._headerBinding.getValue(value)
  }

  private _updateBindingValue() {
    this.deferUpdate(() => {
      for (let i = 0; i < this._options.length; i++) {
        this._options[i].value = this._headerBinding.getValue(this.itemsSource[i]);
      }
    })
  }

  private _updateBindText() {
    this.deferUpdate(() => {
      for (let i = 0; i < this._options.length; i++) {
        this._options[i].text = this._displayMemberBinding.getValue(this.itemsSource[i]);
      }
    })
  }

  private _updateSelect(): boolean {
    return true;
  }

  public onGenerateOptions(e?: EventArgs): void {
    this.invalidate();
  }


}


