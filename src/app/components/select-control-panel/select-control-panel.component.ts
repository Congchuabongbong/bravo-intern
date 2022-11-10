import { Control, EventArgs, addClass, Binding, Event as wjEven, CollectionView, SortDescription } from '@grapecity/wijmo';
import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, OnDestroy, AfterViewInit } from '@angular/core';
import { from } from 'rxjs';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

@Component({
  selector: 'BravoComboBox',
  templateUrl: './select-control-panel.component.html',
  styleUrls: ['./select-control-panel.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SelectControlPanelComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: SelectControlPanelComponent
    }
  ]
})
export class SelectControlPanelComponent extends Control implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor, Validator {
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
  private _selectedIndex!: number;
  private _selectedValuePath!: string;
  private _selectedValueBinding!: Binding;
  public valueFiled!: any;
  private touched = false;
  private disabled = false;
  get selectElement(): HTMLSelectElement {
    return this._select;
  }
  get selectedItem(): any {
    return this.itemsSource[this.selectedIndex];
  }
  get selectedValue(): any {
    if (this.selectedValuePath && typeof this.itemsSource[this.selectedIndex] === 'object') {
      return this._selectedValueBinding.getValue(this.itemsSource[this.selectedIndex]);
    } else {
      return this.selectedItem;
    }
  }
  //**Input declaration
  @Input() set itemsSource(value: any[]) {
    this._itemsSource = value;
    this.onGenerateOptions();
    this._isGenerated && this._isInitialized && this.onItemsSourceChanged();
    // this._collectionView = new CollectionView(value);
  }
  get itemsSource(): any[] {
    return this._itemsSource;
  };
  @Input() set displayMemberPath(value: string) {
    this._displayMemberPath = value;
    this._displayMemberBinding = new Binding(value)
    this._isGenerated && this._updateBindingText();
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
    return this._selectedIndex ??= 0;
  }

  @Input() set selectedValuePath(value: string) {
    this._selectedValuePath = value;
    this._selectedValueBinding = new Binding(value);
  }
  get selectedValuePath(): string {
    return this._selectedValuePath;
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
    addClass(this.hostElement, "br-comboBox"); // -> add class for hostElement
    addClass(this.selectElement, "br-select"); // -> add class for select
    this.selectElement.addEventListener("change", this.onSelectedChange.bind(this), false); // -> add event listener!;
  }
  //**Lifecycle methods
  ngOnInit(): void {
    this.triggerSignals();
    // this._collectionView.sortDescriptions.push(new SortDescription('id', true));
    // console.log(this._collectionView.items);
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
  /** @desc : generate options equal amount of itemsSource*/
  private _generateOptions(): void {
    const optionsEl: HTMLOptionElement[] = [];
    from(this.itemsSource).subscribe(item => {
      const option: HTMLOptionElement = document.createElement("option");
      addClass(option, 'br-listBox-item')
      if (typeof item === 'object') {
        if (typeof item.getMonth === 'function') {
          option.value = item.toString();
          option.text = item.toString();
        } else {
          this._headerBinding ? this._setValue(option, item) : option.value = item;
          this._displayMemberBinding ? this._setText(option, item) : option.text = item;
        }
      } else {
        option.value = item;
        option.text = item;
      }
      optionsEl.push(option)
    }).unsubscribe();
    this.selectElement.append(...optionsEl);
    this.selectElement.selectedIndex = this.selectedIndex; // default is selected index = 0 
    this._updateSelected(); //-> update selected index
    this._options = this.selectElement.options; // -> assign options 
    this._isGenerated = !0; // switch flag _isGenerated = true
  }

  private _setText(option: HTMLOptionElement, value: any): void {
    option.text = this._displayMemberBinding.getValue(value);
  }

  private _setValue(option: HTMLOptionElement, value: any): void {
    option.value = this._headerBinding.getValue(value);
  }

  /**@desc: update binding value when headerBinding changed */
  private _updateBindingValue() {
    for (let i = 0; i < this._options.length; i++) {
      if (typeof this.itemsSource[i] === 'object') {
        this._options[i].value = this._headerBinding.getValue(this.itemsSource[i]);
      } else {
        this._options[i].value = this.itemsSource[i];
      }
    }
  }

  /**@desc: update binding value when displayMemberBinding changed */
  private _updateBindingText() {
    for (let i = 0; i < this._options.length; i++) {
      if (typeof this.itemsSource[i] === 'object') {
        this._options[i].text = this._displayMemberBinding.getValue(this.itemsSource[i]);
      } else {
        this._options[i].text = this.itemsSource[i];
      }
    }
  }

  /**@desc: using dispatch event to update selectedIndex the first time generate options;*/
  private _updateSelected(): void {
    let event = new Event("change");
    this.selectElement.dispatchEvent(event);
  }

  //*method raise event
  /**
   * @desc: call method reset to generate options and raise event generating and generated options!
   * @param: {e?:EventArgs} 
   * @return: void
   * */
  public onGenerateOptions(e?: EventArgs): void {
    this.invalidate();
  }

  /**
   * @desc: using to raise event when itemSource changed
   * @param: {e?:EventArgs}
   * @return: void
   */
  public onItemsSourceChanged(e?: EventArgs): void {
    this.deferUpdate(() => {
      this.itemsSourceChanged.hasHandlers && this.itemsSourceChanged.raise(this, e);
      this._isGenerated = this._isInitialized && false;
      this.selectElement.replaceChildren();
    })
  }

  /**
  * @desc: using to raise event when selected index changed
  * @param: {e?:EventArgs}
  * @return: void
  */
  public onSelectedIndexChanged(e?: EventArgs) {
    this.selectedIndexChanged.hasHandlers && this.selectedIndexChanged.raise(this, e);
  }
  //**method handle Event selected change;
  /**
   * @desc: handle event when select changed
   * @param: {e?:any}
   * @return: void
   */
  private onSelectedChange(e: any): void {
    e.preventDefault();
    e.stopPropagation();
    this.selectedIndex = e.currentTarget.selectedIndex;
    this.onChange(e.currentTarget.value);
    this.onSelectedIndexChanged();
  }
  //** Trigger Signals */
  /**@desc: using to trigger event of component when initialized component */
  private triggerSignals(): void {
    //**Emit Event support via Output*/
    this.initializedNg.emit(); //-> emit event when component is initialized
    this._isInitialized = !0; //-> flag isInitialized = true;
  }
  //**Clean Event*/
  /**@desc: using to remove all event of component when destroy component */
  private cleanEvent(): void {
    this.removeEventListener(this.hostElement);
    this.removeEventListener(this.selectElement);
    this.initializedNg.unsubscribe();
    this.itemsSourceChanged.removeAllHandlers();
    this.selectedIndexChanged.removeAllHandlers();
  }
  //**custom form 
  public onChange = (value: any) => { return value };
  public onTouched = () => { };
  public onChangeChecked(value: any) {
    this.markAsTouched();
    this.onChange(value);
    return;
  }
  public writeValue(value: any): void {
    this.selectElement.value = value;
  }
  public registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }
  public registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  private markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
  public setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
  //**implemented validator */
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    return null;
  }
  registerOnValidatorChange?(fn: () => void): void {

  }
}
