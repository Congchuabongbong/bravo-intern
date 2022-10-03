import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FormFieldData, GridLayoutFormData } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  //** Constructor */
  constructor(private _fb: FormBuilder) { }

  //** generate form group
  public generateForm(GridLayoutFormData: any): FormGroup {
    const entries = Object.keys(GridLayoutFormData).map(key => [key, this.generateFormGroup(GridLayoutFormData[key])]);
    const initFormModel = Object.fromEntries(entries);
    return this._fb.group(initFormModel);
  }

  // ** generate form group
  private generateFormGroup(controlGridLayoutFormData: GridLayoutFormData.IControlGridLayoutFormData): FormGroup {
    const formGroupPrepareObject: Record<string, any> = {};
    controlGridLayoutFormData.formField.forEach(field => {
      formGroupPrepareObject[field.attribute.formControlName] = [field.attribute.value || '', field.attribute.validators ? this.generateValidators(field.attribute.validators) : null];
    })
    //**Nested grid layout */
    if (controlGridLayoutFormData.subControlGridLayoutFormData) {
      controlGridLayoutFormData.subControlGridLayoutFormData.subGridItemForm.formField.forEach(field => {
        formGroupPrepareObject[field.attribute.formControlName] = [field.attribute.value || '', field.attribute.validators ? this.generateValidators(field.attribute.validators) : null];
      })
    }
    return this._fb.group(formGroupPrepareObject);
  }

  //*get validators message errorFiled
  public getValidatorsMessageErrorFiled(keyError: string, validators: FormFieldData.IValidator[]): string {
    let messageError: string = '';
    validators.forEach(validator => {
      if (validator.key === keyError) {
        messageError = validator.messageError
      }
    })
    return messageError;
  }
  //** generate validation form 
  private generateValidators(validatorsString: Array<FormFieldData.IValidator>): Array<ValidatorFn> {
    let validators: Array<ValidatorFn> = [];
    validatorsString.forEach(validator => {
      switch (validator.key) {
        case 'required':
          validators.push(Validators.required);
          break;
        case 'min':
          validators.push(Validators.min(validator.value as number));
          break;
        case 'max':
          validators.push(Validators.max(validator.value as number));
          break;
        case 'email':
          validators.push(Validators.email);
          break;
        case 'pattern':
          validators.push(Validators.pattern(validator.value as string));
          break;
        case 'minlength':
          validators.push(Validators.minLength(validator.value as number));
          break;
        case 'maxlength':
          validators.push(Validators.maxLength(validator.value as number));
          break;
        default:
          validators.push(Validators.required);
          break;
      }
    })
    return validators;
  }
}
