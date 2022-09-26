import {
  Component,
  ElementRef,
  Input,
  OnInit,
  AfterViewInit,
  Renderer2,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, FormGroup, FormRecord, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { FormFieldData } from 'src/app/data-type';
import { GridLayoutService } from 'src/app/services/grid-layout.service';

@Component({
  selector: 'app-control-form-field-panel',
  templateUrl: './control-form-field-panel.component.html',
  styleUrls: ['./control-form-field-panel.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ControlFormFieldPanelComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: ControlFormFieldPanelComponent
    }
  ]
})
export class ControlFormFieldPanelComponent implements OnInit, AfterViewInit, ControlValueAccessor, Validator, OnDestroy {
  @Input() field!: FormFieldData.ControlFormType;
  @Input() isIcon?: boolean;


  public valueFiled!: any;
  private touched = false;
  private disabled = false;
  public classList!: string;
  //** */
  constructor(private _element: ElementRef, private _gridLayoutService: GridLayoutService, private cd: ChangeDetectorRef) {

  }

  //**Life cycle hooks */
  ngOnInit(): void {

    if (this.field) {
      this._gridLayoutService.setPositionGirdItem(this._element, this.field.attribute.position)
    }
  }
  ngAfterViewInit(): void {
    this.classList = this._element.nativeElement.classList;
    this.cd.detectChanges();
  }
  ngOnDestroy(): void {
  }
  //**Check instance of FormFieldData type*/
  public isInput(obj: any): obj is FormFieldData.IInput {
    return 'attribute' in obj && 'type' in obj;
  }
  public isSelect(obj: any): obj is FormFieldData.ISelect {
    return 'attribute' in obj && 'options' in obj;
  }
  public isTextarea(obj: any): obj is FormFieldData.ISelect {
    return 'attribute' in obj;
  }
  //**event binding 
  public onChange = (value: any) => { return value };
  public onTouched = () => { };
  public handleValueChange(value: any) {
    this.markAsTouched();
    if (this.isInput(this.field)) {
      if (this.field.type == 'checkbox') {
        this.onChange(value.target.checked);
        return;
      }
    }
    this.onChange(value);
  }
  //**implement controlValueAccessor:
  public writeValue(value: any): void {

    this.valueFiled = value;
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
