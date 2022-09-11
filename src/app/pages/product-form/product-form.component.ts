import {
  Component,
  OnInit,
  ElementRef,
  AfterViewInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidV4 } from 'uuid';
import { DataService } from 'src/app/services/data.service';
import { maxMonth } from 'src/app/shared/custom-validator/maxMonth.validator';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, AfterViewInit {
  //**Declaration */
  public tabLinks!: ElementRef[];
  public tabContents!: ElementRef[];
  public productForm!: FormGroup;
  @ViewChild('info__general') infoGeneral!: ElementRef;
  @ViewChild('info__attribute') infoAttribute!: ElementRef;
  @ViewChild('product_id') lb_productId!: ElementRef;
  public layout = new GridLayout(8, 4, this.renderer); // init layout
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
    //declare height row
    this.layout.widthColumn = [
      { min: '10rem', max: '15rem' },
      { min: '10rem', max: '20rem' },
      { min: '10rem', max: '20rem' },
      { min: '10rem', max: '1fr' },
      { min: '10rem', max: '1fr' },
      { min: '5rem', max: '15%' },
    ];
    this.layout.generateGridLayout(this.infoGeneral);
    this.layout.setPositionGirdItem(
      this.lb_productId,
      { startLine: 1, endLine: 2 },
      { startLine: 4, endLine: 5 }
    );
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
//**Class Grid layout */
class GridLayout {
  public numberOfRows: number;
  public numberOfColumns: number;
  public arrayUnitRow!: unitOfMeasure[];
  public arrayUnitColumn!: unitOfMeasure[];
  private renderer!: Renderer2;

  constructor(row: number, column: number, renderer: Renderer2) {
    this.numberOfRows = row;
    this.numberOfColumns = column;
    this.renderer = renderer;
  }
  generateGridLayout(girdContainer: ElementRef) {
    if (this.arrayUnitRow !== undefined) {
      let preParedStatement = '';
      this.arrayUnitRow.forEach((unitRow) => {
        if (typeof unitRow !== 'string' && this.isMinMax(unitRow)) {
          preParedStatement += `minmax(${unitRow.min}, ${unitRow.max}) `;
        } else {
          preParedStatement += `${unitRow} `;
        }
      });

      this.renderer.setStyle(
        girdContainer.nativeElement,
        'grid-template-rows',
        preParedStatement
      );
    } else {
      this.renderer.setStyle(
        girdContainer.nativeElement,
        'grid-template-rows',
        `repeat(${this.numberOfRows},1fr)`
      );
    }
    if (this.arrayUnitColumn !== undefined) {
      let preParedStatement: string = '';
      this.arrayUnitColumn.forEach((unitColumn) => {
        if (typeof unitColumn !== 'string' && this.isMinMax(unitColumn)) {
          preParedStatement += `minmax(${unitColumn.min}, ${unitColumn.max}) `;
        } else {
          preParedStatement += `${unitColumn} `;
        }
      });
      this.renderer.setStyle(
        girdContainer.nativeElement,
        'grid-template-columns',
        preParedStatement
      );
    } else {
      this.renderer.setStyle(
        girdContainer.nativeElement,
        'grid-template-columns',
        `repeat(${this.numberOfColumns},1fr)`
      );
    }
  }

  set heightRow(arrayUnitRow: unitOfMeasure[]) {
    this.arrayUnitRow = arrayUnitRow;
  }
  set widthColumn(arrayUnitColumn: unitOfMeasure[]) {
    this.arrayUnitColumn = arrayUnitColumn;
  }
  setPositionGirdItem(
    girdItem: ElementRef,
    rowLine: positionLine,
    columnLine: positionLine
  ) {
    this.renderer.setStyle(
      girdItem.nativeElement,
      'grid-row-start',
      `${rowLine.startLine}`
    );
    this.renderer.setStyle(
      girdItem.nativeElement,
      'grid-row-end',
      `${rowLine.endLine}`
    );
    this.renderer.setStyle(
      girdItem.nativeElement,
      'grid-column-start',
      `${columnLine.startLine}`
    );
    this.renderer.setStyle(
      girdItem.nativeElement,
      'grid-column-end',
      `${columnLine.endLine}`
    );
  }
  private isMinMax(obj: any): obj is minMax {
    return 'min' in obj && 'max' in obj;
  }
}

type unitOfMeasure = minMax | string;
interface minMax {
  min: string;
  max: string;
}
interface positionLine {
  startLine: number;
  endLine: number;
}
