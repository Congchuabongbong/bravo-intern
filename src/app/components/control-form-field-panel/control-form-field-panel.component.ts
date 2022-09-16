import {
  Component,
  ElementRef,
  Input,
  OnInit,
  AfterViewInit,
  forwardRef,
  Renderer2,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
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
      useExisting: forwardRef(() => ControlFormFieldPanelComponent)
    }
  ]
})
export class ControlFormFieldPanelComponent implements OnInit, AfterViewInit, ControlValueAccessor, Validator {
  @Input() field!: FormFieldData.ControlFormType;
  @Input() isIcon?: boolean;

  public valueFiled!: any;
  private touched = false;
  private disabled = false;
  public classList!: any;
  //** */
  constructor(private _element: ElementRef, private _gridLayoutService: GridLayoutService, private _renderer: Renderer2) { }
  //**Life cycle hooks */
  ngOnInit(): void { }
  ngAfterViewInit(): void {
    this._gridLayoutService.setPositionGirdItem(this._element, this.field.attribute.position)

    setTimeout(() => {
      this.classList = this._element.nativeElement.classList;
    });
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
