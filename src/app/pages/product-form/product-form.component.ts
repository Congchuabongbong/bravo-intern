//*Import form core angular */
import {
  Component,
  OnInit,
  ElementRef,
  AfterViewInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
//**import from source */
import { DataService } from 'src/app/services/data.service';
import { maxMonth } from 'src/app/utils/custom-validator/maxMonth.validator';
import { FormFieldData, GridLayoutForm } from 'src/app/data-type';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChild('something', { read: ViewContainerRef }) container!: ViewContainerRef;
  //**Declaration */
  public tabLinks!: ElementRef[];
  public tabContents!: ElementRef[];
  public productForm!: FormGroup;
  public formInfo!: GridLayoutForm.IControlGridLayoutForm;
  public formAttributeInfo!: GridLayoutForm.IControlGridLayoutForm;
  public isProductForm: boolean = false;
  public httpSubscription!: Subscription;
  //**constructor */
  constructor(
    private _dataService: DataService,
    private _renderer: Renderer2,
    private _el: ElementRef,
    private _fb: FormBuilder,
    private _http: HttpClient) { }
  // **life cycle hooks
  ngOnInit(): void {
    // this.productForm = this._fb.group({
    //   info: this._fb.group({
    //     productId: ['', [Validators.required]],
    //     productName: ['', [Validators.required]],
    //     productSecondName: [''],
    //     productUnit: ['', [Validators.required]],
    //     productType: ['', [Validators.required]],
    //     productGroup: ['', [Validators.required]],
    //     isAutoItemCodeProduct: [true],
    //     productItemCode: [
    //       uuidV4(),
    //       [Validators.required],
    //     ],
    //     productNote: [''],
    //     productThumbnail: [''],
    //   }),
    //   attribute: this._fb.group({
    //     productLength: ['', [Validators.required]],
    //     productWidth: ['', [Validators.required]],
    //     productHeight: ['', [Validators.required]],
    //     productWeight: ['', [Validators.required]],
    //     productStandardGroupQc: ['', [Validators.required]],
    //     typeOfPurchase: ['', [Validators.required]],
    //     shortCode: ['', [Validators.required]],
    //     isSerial: [''],
    //     isInventoryByLocation: [false],
    //     isIroningUniform: [false],
    //     isStampScale: [false],
    //     isUsingItem: [false],
    //     dueDateProduct: ['', [Validators.required, maxMonth(36)]],
    //   }),
    // });
    this.httpSubscription = this.getLayoutForm().subscribe(
      (response) => {
        this.formAttributeInfo = response.attribute;
        this.formInfo = response.info;
        //!!getLayoutForm
        const initialForm: Record<string, any> = {}
        Object.keys(response).forEach(key => {
          initialForm[key] = this.generateFormGroup(response[key]);
        });
        this.isProductForm = true;
        this.productForm = this._fb.group(initialForm);
        this._dataService.sendData(this.productForm);
        this._dataService.sendDataByEvent({ formInfo: this.formInfo, formAttributeInfo: this.formAttributeInfo });
      }
    )
  }
  ngAfterViewInit(): void {

  }
  ngAfterViewChecked(): void {
    if (this.isProductForm) {
      this.tabLinks = this._el.nativeElement.querySelectorAll('.tab__link');
      this.tabContents = this._el.nativeElement.querySelectorAll('.tabContent');
      this._el.nativeElement.querySelector('#defaultOpen').click();
      this.isProductForm = false;
    }
  }
  ngOnDestroy(): void {
    this.httpSubscription.unsubscribe();
  }
  //**open tab  */  
  public openTab(elRef: any, tabName: string): void {
    let currentTab = this._el.nativeElement.querySelector(`#${tabName}`);
    this.tabContents.forEach((tabContent) => {
      this._renderer.setStyle(tabContent, 'display', 'none');
    });
    this.tabLinks.forEach((tabLink) => {
      this._renderer.removeClass(tabLink, 'active');
    });
    elRef.classList.add('active');
    this._renderer.setStyle(currentTab, 'display', 'grid');
  }
  // **!! create service latter 
  //** get layout 
  private getLayoutForm(): Observable<any> {
    return this._http.get('assets/data/layout-form.data.json');
  }
  //**Generate Form when receive data form api */
  // private generateForm(): FormGroup {

  // }
  // ** generate form group
  private generateFormGroup(controlGridLayoutForm: GridLayoutForm.IControlGridLayoutForm): FormGroup {
    const formGroupPrepareObject: Record<string, any> = {};
    controlGridLayoutForm.formField.forEach(field => {
      formGroupPrepareObject[field.attribute.formControlName] = [field.attribute.value || '', field.attribute.validators ? this.generateValidators(field.attribute.validators) : null];
    })
    if (controlGridLayoutForm.subControlGridLayoutForm) {
      controlGridLayoutForm.subControlGridLayoutForm.subGridItemForm.formField.forEach(field => {
        formGroupPrepareObject[field.attribute.formControlName] = [field.attribute.value || '', field.attribute.validators ? this.generateValidators(field.attribute.validators) : null];
      })
    }
    return this._fb.group(formGroupPrepareObject);
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

