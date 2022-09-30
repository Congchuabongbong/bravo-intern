//*Import form core angular */
import {
  Component,
  OnInit,
  ElementRef,
  AfterViewInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//**Import from library */
import { v4 as uuidV4 } from 'uuid';
//**import from source */
import { DataService } from 'src/app/services/data.service';
import { maxMonth } from 'src/app/utils/custom-validator/maxMonth.validator';
import { GridLayoutForm } from 'src/app/data-type';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, AfterViewInit {
  @ViewChild('something', { read: ViewContainerRef }) container!: ViewContainerRef;
  //**Declaration */
  public tabLinks!: ElementRef[];
  public tabContents!: ElementRef[];
  public productForm!: FormGroup;
  public formInfo!: GridLayoutForm.IControlGridLayoutForm;
  public formAttributeInfo!: GridLayoutForm.IControlGridLayoutForm;
  //**constructor */
  constructor(
    private _dataService: DataService,
    private _renderer: Renderer2,
    private _el: ElementRef,
    private _fb: FormBuilder,
    private _http: HttpClient) { }
  // **life cycle hooks
  ngOnInit(): void {
    this.productForm = this._fb.group({
      info: this._fb.group({
        productId: ['', [Validators.required]],
        productName: ['', [Validators.required]],
        productSecondName: [''],
        productUnit: ['', [Validators.required]],
        productType: ['', [Validators.required]],
        productGroup: ['', [Validators.required]],
        isAutoItemCodeProduct: [true],
        productItemCode: [
          uuidV4(),
          [Validators.required],
        ],
        productNote: [''],
        productThumbnail: [''],
      }),
      attribute: this._fb.group({
        productLength: ['', [Validators.required]],
        productWidth: ['', [Validators.required]],
        productHeight: ['', [Validators.required]],
        productWeight: ['', [Validators.required]],
        productStandardGroupQc: ['', [Validators.required]],
        typeOfPurchase: ['', [Validators.required]],
        shortCode: ['', [Validators.required]],
        isSerial: [''],
        isInventoryByLocation: [false],
        isIroningUniform: [false],
        isStampScale: [false],
        isUsingItem: [false],
        dueDateProduct: ['', [Validators.required, maxMonth(36)]],
      }),
    });
    this.getLayoutForm().subscribe(
      (response) => {
        this.formAttributeInfo = response.formAttributeInfo;
        this.formInfo = response.formInfo;
        this._dataService.sendData(this.productForm);
        this._dataService.sendDataByEvent({ formInfo: this.formInfo, formAttributeInfo: this.formAttributeInfo });
      }
    )
  }
  ngAfterViewInit(): void {
    //select element when after view init*/
    this.tabLinks = this._el.nativeElement.querySelectorAll('.tab__link');
    this.tabContents = this._el.nativeElement.querySelectorAll('.tabContent');
    this._el.nativeElement.querySelector('#defaultOpen').click();
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
  //** get layout 
  private getLayoutForm(): Observable<any> {
    return this._http.get('assets/data/layout-form.data.json');
  }
}
