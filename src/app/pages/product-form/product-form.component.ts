//*Import form core angular */
import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
//**import from source */
import { DataService } from 'src/app/services/data.service';
import { GridLayoutFormData } from 'src/app/data-type';
import { map, Observable, tap } from 'rxjs';
import { DynamicFormService } from 'src/app/services/dynamic-form.service';
interface formTabItem {
  nameTab: string;
  formTab: GridLayoutFormData.IControlGridLayoutFormData;
}
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  @ViewChild("tabForm", { read: ViewContainerRef, static: false }) tabForm!: ViewContainerRef;
  //**Declaration *
  public productForm!: FormGroup;
  public activeTab!: formTabItem;
  public formTabs$!: Observable<formTabItem[]>;

  //**constructor */
  constructor(
    private _dataService: DataService,
    private _dynamicFormService: DynamicFormService,
    private _http: HttpClient,
  ) { }

  // **life cycle hooks
  ngOnInit(): void {
    this.formTabs$ = this.getLayoutForm()
      .pipe(
        tap(GridLayoutFormData => {
          this.productForm = this._dynamicFormService.generateForm(GridLayoutFormData);
          this._dataService.sendData(this.productForm);
        }),
        map(GridLayoutFormData => Object.keys(GridLayoutFormData).map(key => ({ nameTab: key, formTab: GridLayoutFormData[key] }))),
        tap(formTabs => {
          this.activeTab = formTabs[0]
          this._dataService.sendDataByEventEmitter(formTabs);
        })
      )
  }
  //**Event binding */
  public onChangeFormTab(formTab: formTabItem): void {
    this.activeTab = formTab;
  }
  //** get layout 
  private getLayoutForm(): Observable<any> {
    return this._http.get('assets/data/layout-form.data.json');
  }

}

