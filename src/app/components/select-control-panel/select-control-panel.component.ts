import { Control, EventArgs, addClass, Binding, Event as wjEven } from '@grapecity/wijmo';
import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, OnDestroy, AfterViewInit } from '@angular/core';
import { from, tap } from 'rxjs';

@Component({
  selector: 'BravoComboBox',
  templateUrl: './select-control-panel.component.html',
  styleUrls: ['./select-control-panel.component.scss']
})
export class SelectControlPanelComponent extends Control implements OnInit, AfterViewInit, OnDestroy {
  //**Properties Declaration\
  static controlTemplate = '<select wj-part="select"></select>';
  private _select!: HTMLSelectElement;
  private _options!: HTMLOptionsCollection;
  private _itemsSource!: any[];
  private _displayMemberPath!: string;
  private _displayMemberBinding!: Binding;
  private _headerPath!: string;
  private _headerBinding!: Binding;
  private _isInitialized: boolean = false;
  private _isGenerated: boolean = false;
  private _selectedIndex!: number; // done
  private _selectedItem!: any;
  private _selectedValue!: any;
  private _selectedValuePath!: string;
  get selectElement(): HTMLSelectElement {
    return this._select;
  }
  //**Input declaration
  @Input() set itemsSource(value: any[]) {
    if (this._itemsSource != value) {
      this._itemsSource = value;
      this.onItemsSourceChanged();
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
  //**Output declaration
  @Output('initialize') initializedNg = new EventEmitter<any>();
  //**Event
  public itemsSourceChanged = new wjEven<this, EventArgs>();
  public selectedIndexChanged = new wjEven<this, EventArgs>();
  //**constructor */
  constructor(_el: ElementRef, _injector: Injector) {
    super(_el.nativeElement) //-> call parent constructor
    this.applyTemplate('wj-control', this.getTemplate(), { //->apply template for control 
      _select: 'select',
    })
    addClass(this.hostElement, "br-combobox"); // -> add class for hostElement
    addClass(this.selectElement, "br-select"); // -> add class for select
    this._isInitialized = !0; //-> flag isInitialized = true;
    this.selectElement.addEventListener("change", this.onSelectedChange.bind(this), false); // -> add event listener!;

  }
  //**Lifecycle methods
  ngOnInit(): void {
    this.triggerSignals();
  }

  ngAfterViewInit(): void {

  }
  ngOnDestroy(): void {
    this.cleanEvent();//->clean all event
  }

  //**Override method properties of the control class
  override refresh(fullUpdate?: boolean | undefined): void {
    super.refresh(fullUpdate);
    if (this.hostElement) {
      !this._isGenerated && this._generateOptions();
    }
  }

  //**method Properties of control */

  /** @desc : generate options by amount of itemsSource*/
  private _generateOptions(): void {
    const optionsEl: HTMLOptionElement[] = [];
    from(this.itemsSource).pipe(tap(item => {
      const option: HTMLOptionElement = document.createElement("option");
      addClass(option, 'br-listbox-item')
      if (typeof item === 'object') {
        this._headerBinding ? this._setValue(option, item) : option.value = item;
        this._displayMemberBinding ? this._setText(option, item) : option.text = item;
      } else {
        option.value = item;
        option.text = item;
      }
      option.setAttribute('data', item)
      optionsEl.push(option)
    })).subscribe().unsubscribe();
    this.selectElement.append(...optionsEl);
    this.selectElement.selectedIndex = this.selectedIndex || 0;
    this._updateSelected() //-> update selected index
    this._options = this.selectElement.options;
    this._isGenerated = !0;
  }

  private _setText(option: HTMLOptionElement, value: any): void {
    option.text = this._displayMemberBinding.getValue(value);
  }

  private _setValue(option: HTMLOptionElement, value: any): void {
    option.value = this._headerBinding.getValue(value)
  }

  /**@desc: update binding value when headerBinding changed */
  private _updateBindingValue() {
    this.deferUpdate(() => {
      for (let i = 0; i < this._options.length; i++) {
        this._options[i].value = this._headerBinding.getValue(this.itemsSource[i]);
      }
    })
  }

  /**@desc: update binding value when displayMemberBinding changed */
  private _updateBindText() {
    this.deferUpdate(() => {
      for (let i = 0; i < this._options.length; i++) {
        this._options[i].text = this._displayMemberBinding.getValue(this.itemsSource[i]);
      }
    })
  }

  /**@desc: using dispatch event to update selectedIndex the first time;*/
  private _updateSelected(): void {
    let event = new Event("change");
    this.selectElement.dispatchEvent(event)
  }


  //*method raise event
  public onGenerateOptions(e?: EventArgs): void {
    this.invalidate();
  }

  public onItemsSourceChanged(e?: EventArgs): void {
    this.itemsSourceChanged.hasHandlers && this.itemsSourceChanged.raise(this, e);
  }
  public onSelectedIndexChanged(e?: EventArgs) {
    this.selectedIndexChanged.hasHandlers && this.selectedIndexChanged.raise(this, e);
  }
  //**method handle Event selected change;
  private onSelectedChange(e: any): void {
    this.selectedIndex = e.currentTarget.selectedIndex;
    this.onSelectedIndexChanged();
  }

  //** Trigger Signals */
  private triggerSignals(): void {
    //**Emit Event support via Output*/
    this.initializedNg.emit(); //-> emit event when component is initialized
  }
  //**Clean Event*/
  private cleanEvent(): void {
    this.removeEventListener(this.hostElement);
    this.removeEventListener(this.selectElement);
    this.initializedNg.unsubscribe();
    this.itemsSourceChanged.removeAllHandlers();
    this.selectedIndexChanged.removeAllHandlers();
  }


}


