import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-menu-errors-sidebar',
  templateUrl: './menu-errors-sidebar.component.html',
  styleUrls: ['./menu-errors-sidebar.component.scss'],
})
export class MenuErrorsSidebarComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  public productForm!: FormGroup;
  public obs!: Subscription;
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.obs = this.dataService.data.subscribe((response) => {
      this.productForm = response;
    });
  }
  ngAfterViewInit(): void {}
  ngOnDestroy(): void {
    this.obs.unsubscribe();
  }

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
}
