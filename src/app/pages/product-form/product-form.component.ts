import {
  Component,
  OnInit,
  ElementRef,
  AfterViewInit,
  Renderer2,
} from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
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
        id: [''],
        street: [''],
        pincode: [''],
      }),
      attribute: this.fb.group({
        city: [''],
        street: [''],
        pincode: [''],
      }),
    });
  }

  ngAfterViewInit(): void {
    this.tabLinks = this.el.nativeElement.querySelectorAll('.tab__link');
    this.tabContents = this.el.nativeElement.querySelectorAll('.tabContent');
    this.el.nativeElement.querySelector('#defaultOpen').click();
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
