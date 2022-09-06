import {
  Component,
  OnInit,
  ElementRef,
  AfterViewInit,
  Renderer2,
} from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  //**constructor */
  constructor(
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
        typeProduct: ['', [Validators.required]],
        groupProduct: ['', [Validators.required]],
        isAutoItemCodeProduct: [false],
        itemCodeProduct: ['', [Validators.required]],
        noteProduct: [''],
        thumbnailProduct: [''],
      }),
      attribute: this.fb.group({
        lengthProduct: ['', [Validators.required]],
        widthProduct: ['', [Validators.required]],
        heightProduct: ['', [Validators.required]],
        weightProduct: ['', [Validators.required]],
        standardGroupQc: ['', [Validators.required]],
        typeOfPurchase: ['', [Validators.required]],
        shortCode: ['', [Validators.required]],
        isSerial: [false],
        isInventoryByLocation: [false],
        isIroningUniform: [false],
        isStampScale: [false],
        isUsingItem: [false],
        dueDateProduct: ['', [Validators.required]],
      }),
    });
  }

  ngAfterViewInit(): void {
    this.tabLinks = this.el.nativeElement.querySelectorAll('.tab__link');
    this.tabContents = this.el.nativeElement.querySelectorAll('.tabContent');
    setTimeout(() => {
      this.el.nativeElement.querySelector('#defaultOpen').click();
    });
  }

  //**open tab  */
  public openTab(evt: any, tabName: string): void {
    let currentTab = this.el.nativeElement.querySelector(`#${tabName}`);
    this.tabContents.forEach((tabContent) => {
      this.renderer.setStyle(tabContent, 'display', 'none');
    });
    this.tabLinks.forEach((tabLink) => {
      this.renderer.removeClass(tabLink, 'active');
    });
    evt.classList.add('active');
    this.renderer.setStyle(currentTab, 'display', 'grid');
  }
}
