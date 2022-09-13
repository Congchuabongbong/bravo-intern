//*Import form core angular */
import {
  Component,
  OnInit,
  ElementRef,
  AfterViewInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//**Import from library */
import { v4 as uuidV4 } from 'uuid';
//**import from source */
import { DataService } from 'src/app/services/data.service';
import { maxMonth } from 'src/app/shared/custom-validator/maxMonth.validator';
import GridLayout from 'src/app/shared/grid-layout.class';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, AfterViewInit {
  //**Declaration */
  @ViewChild('info__general') infoGeneral!: ElementRef;
  @ViewChild('info__attribute') infoAttribute!: ElementRef;
  @ViewChild('product_id') lb_productId!: ElementRef;
  public tabLinks!: ElementRef[];
  public tabContents!: ElementRef[];
  public productForm!: FormGroup;
  public infoGeneralLayout = new GridLayout(8, 6, this.renderer); // init layout
  //**constructor */
  constructor(
    private dataService: DataService,
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder
  ) {}
  // **life cycle hooks
  ngOnInit(): void {
    this.productForm = this.fb.group({
      info: this.fb.group({
        idProduct: ['', [Validators.required]],
        nameProduct: ['', [Validators.required]],
        secondNameProduct: [''],
        unitProduct: ['', [Validators.required]],
        typeProduct: [null, [Validators.required]],
        groupProduct: [null, [Validators.required]],
        isAutoItemCodeProduct: [true],
        itemCodeProduct: [
          { value: uuidV4(), disabled: true },
          [Validators.required],
        ],
        noteProduct: [''],
        thumbnailProduct: [''],
      }),
      attribute: this.fb.group({
        lengthProduct: ['', [Validators.required]],
        widthProduct: ['', [Validators.required]],
        heightProduct: ['', [Validators.required]],
        weightProduct: ['', [Validators.required]],
        standardGroupQc: [null, [Validators.required]],
        typeOfPurchase: [null, [Validators.required]],
        shortCode: ['', [Validators.required]],
        isSerial: [false],
        isInventoryByLocation: [false],
        isIroningUniform: [false],
        isStampScale: [false],
        isUsingItem: [false],
        dueDateProduct: ['', [Validators.required, maxMonth(36)]],
      }),
    });
    setTimeout(() => {
      this.dataService.sendData(this.productForm);
    });
  }

  ngAfterViewInit(): void {
    //select element when after view init*/
    this.tabLinks = this.el.nativeElement.querySelectorAll('.tab__link');
    this.tabContents = this.el.nativeElement.querySelectorAll('.tabContent');
    this.el.nativeElement.querySelector('#defaultOpen').click();
    //declare css for layout here:
    this.infoGeneralLayout.widthColumn = [
      { min: '10rem', max: '15rem' },
      { min: '10rem', max: '20rem' },
      { min: '10rem' },
      { min: '10rem', max: '1fr' },
      { min: '10rem', max: '1fr' },
      { min: '5rem', max: '15%' },
    ];
    this.infoGeneralLayout.generateGridLayout(this.infoGeneral);
    this.infoGeneralLayout.setPositionGirdItem(
      this.lb_productId,
      { startLine: 1, endLine: 2 },
      { startLine: 1, endLine: 2 }
    );
    this.infoGeneralLayout.setRowGap(this.infoGeneral, '0.3rem');
    this.infoGeneralLayout.setColumnGap(this.infoGeneral, '1rem');
  }
  //**Getter Form */
  //**get information of product */
  get info() {
    return this.productForm.get('info');
  }
  get idProduct() {
    return this.info?.get('idProduct');
  }
  get nameProduct() {
    return this.info?.get('nameProduct');
  }
  get secondNameProduct() {
    return this.info?.get('secondNameProduct');
  }
  get unitProduct() {
    return this.info?.get('unitProduct');
  }
  get typeProduct() {
    return this.info?.get('typeProduct');
  }
  get groupProduct() {
    return this.info?.get('groupProduct');
  }
  get isAutoItemCodeProduct() {
    return this.info?.get('isAutoItemCodeProduct');
  }
  get itemCodeProduct() {
    return this.info?.get('itemCodeProduct');
  }
  get noteProduct() {
    return this.info?.get('noteProduct');
  }
  get thumbnailProduct() {
    return this.info?.get('thumbnailProduct');
  }
  //**get information attribute of product */
  get attribute() {
    return this.productForm.get('attribute');
  }
  get lengthProduct() {
    return this.attribute?.get('lengthProduct');
  }
  get widthProduct() {
    return this.attribute?.get('widthProduct');
  }
  get heightProduct() {
    return this.attribute?.get('heightProduct');
  }
  get weightProduct() {
    return this.attribute?.get('weightProduct');
  }
  get standardGroupQc() {
    return this.attribute?.get('standardGroupQc');
  }
  get typeOfPurchase() {
    return this.attribute?.get('typeOfPurchase');
  }
  get shortCode() {
    return this.attribute?.get('shortCode');
  }
  get isSerial() {
    return this.attribute?.get('isSerial');
  }
  get isInventoryByLocation() {
    return this.attribute?.get('isInventoryByLocation');
  }
  get isIroningUniform() {
    return this.attribute?.get('isIroningUniform');
  }
  get isStampScale() {
    return this.attribute?.get('isStampScale');
  }
  get isUsingItem() {
    return this.attribute?.get('isUsingItem');
  }
  get dueDateProduct() {
    return this.attribute?.get('dueDateProduct');
  }
  //**open tab  */
  public openTab(elRef: any, tabName: string): void {
    let currentTab = this.el.nativeElement.querySelector(`#${tabName}`);
    this.tabContents.forEach((tabContent) => {
      this.renderer.setStyle(tabContent, 'display', 'none');
    });
    this.tabLinks.forEach((tabLink) => {
      this.renderer.removeClass(tabLink, 'active');
    });
    elRef.classList.add('active');
    this.renderer.setStyle(currentTab, 'display', 'grid');
  }

  //**isAutoItemCodeProduct changed
  public onChangeAutoItemCodeProduct(event: any): void {
    if (event.target.checked) {
      this.itemCodeProduct?.disable();
      this.itemCodeProduct?.setValue(uuidV4());
    } else {
      this.itemCodeProduct?.enable();
      this.itemCodeProduct?.setValue('');
    }
  }
}
