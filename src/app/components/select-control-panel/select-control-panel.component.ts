import { Control, EventArgs, addClass, Binding, Event as wjEven, CollectionView, isDate } from '@grapecity/wijmo';
import { FormatItemEventArgs } from '@grapecity/wijmo.input';
import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, OnDestroy, AfterViewInit, Injectable } from '@angular/core';
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
@Injectable()
export class SelectControlPanelComponent extends Control implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor, Validator {
  //**Properties Declaration
  static controlTemplate = '<select wj-part="select"></select>';
  public collectionView!: CollectionView;
  public override isDisabled!: boolean;
  private _selectElement!: HTMLSelectElement;
  private _displayMemberPath!: string;
  private _displayMemberBinding!: Binding;
  private _headerPath!: string;
  private _headerBinding!: Binding;
  private _isGeneratedFirstTime: boolean = false;
  private _selectedIndex!: number;
  private _selectedValuePath!: string;
  private _selectedValueBinding!: Binding;
  private _valuesOption: any[] = [];
  private _valueBidingForm !: any;
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
    this.collectionView = new CollectionView<any>(value);
    this.onGenerateOptions();
    this._isGeneratedFirstTime && this.onItemsSourceChanged();
  }
  get itemsSource(): any[] {
    return this.collectionView.items;
  };
  /** @desc:specified or get displayMemberPath to bind text for select option*/
  @Input() set displayMemberPath(value: string) {
    this._displayMemberPath = value;
    this._displayMemberBinding = new Binding(value);
    this._isGeneratedFirstTime && this.onGenerateOptions();
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
  @Output('formatItem') formatItemNg = new EventEmitter<any>();
  //**Event
  public itemsSourceChanged = new wjEven<this, EventArgs>();
  public selectedIndexChanged = new wjEven<this, EventArgs>();
  public formatItem = new wjEven<this, FormatItemEventArgs>();
  //**constructor */
  constructor(private _el: ElementRef, private _injector: Injector) {
    super(_el.nativeElement, _injector) //-> call parent constructor
    this.applyTemplate('wj-control', this.getTemplate(), { //->apply template for control 
      _selectElement: 'select',
    })
    addClass(this.hostElement, "br-comboBox"); // -> add class for hostElement
    addClass(this.selectElement, "br-select"); // -> add class for select
    this.addEventListener(this.selectElement, "change", this.onSelectedChange.bind(this), false); // -> add event listener!;
  }
  //**Lifecycle methods
  ngOnInit(): void {
    this.triggerSignalsInit();
    // this.refreshed.addHandler(() => console.log('refreshed'))
  }

  ngAfterViewInit(): void {

  }
  ngOnDestroy(): void {
    this.cleanEvent();//->clean all event
    this.dispose();
  }

  //**Override method properties of the control class
  override refresh(fullUpdate?: boolean | undefined): void {
    super.refresh(fullUpdate);
    if (this.hostElement) {
      this._generateOptions();
    }
  }

  //**method Properties of control */
  /** @desc : generate options equal amount of itemsSource */
  private _generateOptions(): void {
    this._isGeneratedFirstTime && this.selectElement.replaceChildren();
    const optionsEl: HTMLOptionElement[] = [];
    this.collectionView.items.forEach(item => {
      const optionEL: HTMLOptionElement = document.createElement("option");
      addClass(optionEL, 'br-listBox-item');
      if (isDate(item)) {
        optionEL.value = item.toString();
        optionEL.text = item.toString();
      } else {
        optionEL.value = this._headerBinding && this._headerBinding.getValue(item) || item;
        optionEL.text = this._displayMemberBinding && this._displayMemberBinding.getValue(item) || item;
      }
      const formatItemEventArgs = new FormatItemEventArgs(this.collectionView.items.indexOf(item), item, optionEL)
      this.formatItem.hasHandlers && this.formatItem.raise(this, formatItemEventArgs);
      this.formatItemNg.emit(formatItemEventArgs)
      optionsEl.push(optionEL);
      this._valuesOption.push(optionEL.value);
    });
    this.selectElement.append(...optionsEl);
    this._valueBidingForm ? this.selectElement.value = this._valueBidingForm : this.selectElement.selectedIndex = this.selectedIndex;
    this.selectElement.disabled = this.isDisabled || false;
    this._updateSelected();
    this._isGeneratedFirstTime = !0;
  }

  /**@desc: using dispatch event to update selectedIndex the first time generate options;*/
  private _updateSelected(): void {
    let event = new Event("change");
    this.selectElement.dispatchEvent(event);
  }
  /**
   * @desc: Gets the string displayed in the option element (always plain text).
   * @param: {index: The index of the item to retrieve the text for, trimText: Optionally override the value of the trimText property}
   * @return: {string}
  */
  public getDisplayText(index?: number, trimText?: boolean): string {
    index ??= this.selectedIndex;
    let displayText: string = this._displayMemberBinding && this._displayMemberBinding.getValue(this.collectionView.items[index]) || this.collectionView.items[index] || '';
    return trimText ? displayText.trim() : displayText;
  };
  //*method raise event
  /**
   * @desc: call method reset to generate options and raise event generating and generated options!
   * @return: void
   * */
  public onGenerateOptions(): void {
    // setInterval(() => {
    //   this.isUpdating || this.invalidate();
    // }, 11);
    this.isUpdating || this.invalidate()
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
    });
  }

  public endUpdateSync() {
    this._updating--;
    this._updating <= 0 && this.refresh();
  }
  public deferUpdateSync(fn: Function): void {
    try {
      this.beginUpdate();
      fn();
    } catch (error) {
      console.log(error);
    } finally {
      this.endUpdateSync();
    }
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
    this.formatItem.removeAllHandlers();
    this.formatItemNg.unsubscribe();
  }
  //**custom form 
  public onChange = (value: any) => value;
  public onTouched = () => { };
  public onChangeChecked(value: any) {
    this.markAsTouched();
    this.onChange(value);
    return;
  }
  public writeValue(value: any): void {
    this._valueBidingForm = value;
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
    this.isDisabled = disabled;
  }
  //**implemented validator */
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    return null;
  }
  registerOnValidatorChange?(fn: () => void): void {

  }
}
