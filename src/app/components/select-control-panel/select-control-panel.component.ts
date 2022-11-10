import { Control, EventArgs, addClass, Binding, Event as wjEven } from '@grapecity/wijmo';
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
  //**Properties Declaration
  static controlTemplate = '<select wj-part="select"></select>';
  private _selectElement!: HTMLSelectElement;
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
  public override isDisabled: boolean = false;
  private touched = false;
  get selectElement(): HTMLSelectElement {
    return this._selectElement;
  }
  get selectedItem(): any {
    return this.itemsSource[this.selectedIndex];
  }
  get selectedValue(): any {
    let value = this._selectedValueBinding && this._selectedValueBinding.getValue(this.itemsSource[this.selectedIndex]) || this.selectedItem;
    return value;
  }
  //**Input declaration
  /** @desc:specified or get itemsSource to generate select option*/
  @Input() set itemsSource(value: any[]) {
    this._itemsSource = value;
    this.onGenerateOptions();
    this._isGenerated && this._isInitialized && this.onItemsSourceChanged();
    // this._collectionView = new CollectionView(value);
  }
  get itemsSource(): any[] {
    return this._itemsSource;
  };
  /** @desc:specified or get displayMemberPath to bind text for select option*/
  @Input() set displayMemberPath(value: string) {
    this._displayMemberPath = value;
    this._displayMemberBinding = new Binding(value);
    this._isGenerated && this._updateBindingText();
  }
  get displayMemberPath(): string {
    return this._displayMemberPath;
  };
  /** @desc:specified or get headerPath to bind value for select option*/
  @Input() set headerPath(value: string) {
    this._headerPath = value;
    this._headerBinding = new Binding(value);
  }
  get headerPath(): string {
    return this._headerPath;
  }
  /**@desc:specified or get index of selected option selected */
  @Input() set selectedIndex(value: number) {
    this._selectedIndex = value;
  }
  get selectedIndex(): number {
    return this._selectedIndex ??= 0;
  }
  /**@desc:specified or get selectedValuePath to bind with selected item */
  @Input() set selectedValuePath(value: string) {
    this._selectedValuePath = value;
    this._selectedValueBinding = new Binding(value);
  }
  get selectedValuePath(): string {
    return this._selectedValuePath;
  }

  //**Output declaration
  @Output('initialize') initializedNg = new EventEmitter<any>();
  @Output('itemsSourceChanged') itemsSourceChangedNg = new EventEmitter<any>();
  @Output('selectedIndexChanged') selectedIndexChangedNg = new EventEmitter<any>();
  //**Event
  public itemsSourceChanged = new wjEven<this, EventArgs>();
  public selectedIndexChanged = new wjEven<this, EventArgs>();
  //**constructor */
  constructor(_el: ElementRef, _injector: Injector) {
    super(_el.nativeElement) //-> call parent constructor
    this.applyTemplate('wj-control', this.getTemplate(), { //->apply template for control 
      _selectElement: 'select',
    })
    addClass(this.hostElement, "br-comboBox"); // -> add class for hostElement
    addClass(this.selectElement, "br-select"); // -> add class for select
    this.selectElement.addEventListener("change", this.onSelectedChange.bind(this), false); // -> add event listener!;
  }
  //**Lifecycle methods
  ngOnInit(): void {
    this.triggerSignalsInit();
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
      if (item.getMonth === 'function') {
        option.value = item.toString();
        option.text = item.toString();
      } else {
        option.value = this._headerBinding && this._headerBinding.getValue(item) || item;
        option.text = this._displayMemberBinding && this._displayMemberBinding.getValue(item) || item;
      }
      optionsEl.push(option)
    }).unsubscribe();
    this.selectElement.append(...optionsEl);
    this.selectElement.selectedIndex = this.selectedIndex; // default is selected index = 0 
    this._updateSelected();
    this.selectElement.disabled = this.isDisabled;
    this._isGenerated = !0; // switch flag _isGenerated = true
  }
  /**
   * @desc: support updated binding value when headerBinding changed 
   * @deprecated : deprecated
  */
  private _updateBindingValue() {
    this.deferUpdate(() => {
      this._isGenerated = this._isInitialized && false;
      this._isGenerated || this.selectElement.replaceChildren();
    })
  }

  /**@desc: support updated binding value when displayMemberBinding changed */
  private _updateBindingText() {
    this.deferUpdate(() => {
      this._isGenerated = this._isInitialized && false;
      this._isGenerated || this.selectElement.replaceChildren();
    })
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
      this.itemsSourceChangedNg.emit(e);
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
    this.selectedIndexChangedNg.emit(e);
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
  private triggerSignalsInit(): void {
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
    this.itemsSourceChangedNg.unsubscribe();
    this.selectedIndexChanged.removeAllHandlers();
    this.selectedIndexChangedNg.unsubscribe();
    this.dispose();
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
    this.selectElement.disabled = disabled;
  }
  //**implemented validator */
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    return null;
  }
  registerOnValidatorChange?(fn: () => void): void {

  }
}
