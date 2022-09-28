import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { FormFieldData } from 'src/app/data-type';

@Component({
  selector: 'app-custom-form-checkbox',
  templateUrl: './custom-form-checkbox.component.html',
  styleUrls: ['./custom-form-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CustomFormCheckboxComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: CustomFormCheckboxComponent
    }
  ]
})
export class CustomFormCheckboxComponent implements OnInit, ControlValueAccessor, Validator, OnDestroy {
  @Input('classIp') class!: string;
  @Input('idIp') id!: string;
  @Input('nameIp') name!: string;
  @Input() placeholder!: string;

  public valueFiled!: any;
  private touched = false;
  private disabled = false;
  constructor() { }

  // **Lifecycle hook
  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }
  //**event binding 
  public onChange = (value: any) => { return value };
  public onTouched = () => { };
  public handleValueChange(value: any) {
    this.markAsTouched();
    this.onChange(value.target.checked);
    return;
  }
  //** Implement Control value accessor */
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
