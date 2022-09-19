import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { debounceTime, map, Subscription } from 'rxjs';
@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})

export class ErrorMessageComponent implements OnInit, OnDestroy {
  @Input() control!: AbstractControl;
  @Input() titleError!: string;
  public errorMessage: string = ''
  public errorMessage$!: Subscription;
  constructor() {
  }

  ngOnInit(): void {
    if (this.control && this.control.invalid) {
      this.getErrorMessage();
    }
    this.errorMessage$ = this.control.valueChanges.pipe(debounceTime(200), map(() => {
      const { invalid } = this.control;
      return invalid ? this.getErrorMessage() : '';
    })).subscribe();
  }
  ngOnDestroy(): void {
    if (this.errorMessage$) {
      this.errorMessage$.unsubscribe();
    }
  }

  getErrorMessage() {
    const controlErrors: ValidationErrors | null = this.control.errors;
    if (controlErrors != null) {
      Object.keys(controlErrors).forEach(keyError => {
        switch (keyError) {
          case 'required':
            this.errorMessage = 'Không được bỏ trắng giá trị.';
            break;
          case 'min':
            this.errorMessage = `Giá trị tối thiểu phải lớn hơn ${controlErrors['min'].min}.`;
            break;
          case 'max':
            this.errorMessage = `Giá trị không được quá ${controlErrors['min'].max}.`;
            break;
          case 'email':
            this.errorMessage = 'Email không hợp lệ.';
            break;
          case 'pattern':
            this.errorMessage = `Dữ liệu không đúng định dạng yêu cầu.`;
            break;
          case 'requiredValue':
            this.errorMessage = `${controlErrors['requiredValue']}.`;
            break;
          case 'minlength':
            this.errorMessage = `Dữ liệu phải dài tối thiểu ${controlErrors['minlength'].requiredLength} ký tự.`;
            break;
          case 'maxlength':
            this.errorMessage = `Dữ liệu không vượt quá ${controlErrors['maxlength'].requiredLength} ký tự.`;
            break;
          default:
            this.errorMessage = 'Giá trị không hợp lệ.';
            break;
        }
      });
    }
  }

}
