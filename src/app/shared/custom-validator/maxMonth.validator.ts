import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export function maxMonth(val: number): ValidatorFn | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const month = control.value as number;

    if (month >= val) {
      return {
        maxMonth: true,
        requiredValue: `Bảo hành không được quá ${val} tháng`,
      };
    }
    return null;
  };
}
