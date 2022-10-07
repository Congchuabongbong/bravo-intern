import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { debounceTime, Subscription, tap } from 'rxjs';
import { FormFieldData } from 'src/app/shared/data-type';
import { DynamicFormService } from 'src/app/shared/services/dynamic-form.service';
@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})

export class ErrorMessageComponent implements OnInit, OnDestroy {
  //**Declaration */
  @Input() control!: FormControl;
  @Input() field!: FormFieldData.ControlFormType;
  public errorMessage: string = ''
  public errorMessage$!: Subscription;
  constructor(private _dynamicFormService: DynamicFormService,) {
  }
  //** Lifecycle hooks */
  ngOnInit(): void {
    if (this.control && this.control.invalid) {
      this.getErrorMessage()
    }
    if (this.control) {
      this.errorMessage$ = this.control.valueChanges.pipe(debounceTime(200), tap(() => {
        const { invalid } = this.control as FormControl;
        invalid ? this.getErrorMessage() : '';
      })).subscribe();
    }
  }
  ngOnDestroy(): void {
    if (this.errorMessage$) {
      this.errorMessage$.unsubscribe();
    }
  }
  //**get Error Message */
  getErrorMessage() {
    const controlErrors: ValidationErrors | null = (this.control as FormControl).errors;
    if (controlErrors != null) {
      Object.keys(controlErrors).forEach(keyError => {
        this.errorMessage = this._dynamicFormService.getValidatorsMessageErrorFiled(keyError, this.field.attribute.validators as FormFieldData.IValidator[]);
      });
    }
  }
}
