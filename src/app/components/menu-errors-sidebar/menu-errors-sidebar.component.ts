import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GridLayoutForm } from 'src/app/data-type';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-menu-errors-sidebar',
  templateUrl: './menu-errors-sidebar.component.html',
  styleUrls: ['./menu-errors-sidebar.component.scss'],
})
export class MenuErrorsSidebarComponent
  implements OnInit, AfterViewInit, OnDestroy {
  public productForm!: FormGroup;
  public obs!: Subscription;
  public formAttributeInfo!: GridLayoutForm.IControlGridLayoutForm;
  public formInfo!: GridLayoutForm.IControlGridLayoutForm;
  public idInfo: string = 'idProduct'
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.obs = this.dataService.data$.subscribe((response) => {
      this.productForm = response;
    });
    this.dataService.dataByEvent.subscribe((data) => {
      this.formInfo = data.formInfo;
      this.formAttributeInfo = data.formAttributeInfo;
    })
  }
  ngAfterViewInit(): void { }
  ngOnDestroy(): void {
    this.obs.unsubscribe();
  }
  public get infoF(): { [key: string]: AbstractControl } {
    return this.info.controls;
  }
  public get attributeF(): { [key: string]: AbstractControl } {
    return this.attribute.controls;
  }
  //**get information of product */
  get info() {
    return this.productForm.get('info') as FormGroup;
  }

  //**get information attribute of product */
  get attribute() {
    return this.productForm.get('attribute') as FormGroup;
  }

}
