import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GridLayoutFormData } from 'src/app/data-type';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-menu-errors-sidebar',
  templateUrl: './menu-errors-sidebar.component.html',
  styleUrls: ['./menu-errors-sidebar.component.scss'],
})
export class MenuErrorsSidebarComponent
  implements OnInit, OnDestroy {
  public productForm!: FormGroup;
  public productForm$!: Subscription;
  public formTabs!: GridLayoutFormData.IFormTab[];
  public formTabs$!: Subscription;

  constructor(private _dataService: DataService) { }
  ngOnInit(): void {
    this.productForm$ = this._dataService.data$.subscribe((form: FormGroup) => {
      this.productForm = form;
    });
    this.formTabs$ = this._dataService.dataByEvent.subscribe((formTabItem: GridLayoutFormData.IFormTab[]) => {
      this.formTabs = formTabItem
    });
  }
  ngOnDestroy(): void {
    this.productForm$.unsubscribe();
    this.formTabs$.unsubscribe();
  }
  public getFormControl(formGroupName: string, formControlName: string): FormControl {
    return this.productForm.get(formGroupName)?.get(formControlName) as FormControl;
  }
}
