//*Import form core angular */
import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
//**import from source */
import { DataService } from 'src/app/shared/services/data.service';
import { GridLayoutFormData } from 'src/app/shared/data-type';
import { map, Observable, tap } from 'rxjs';
import { DynamicFormService } from 'src/app/shared/services/dynamic-form.service';
import { RxDbService } from 'src/app/shared/services/rx-db.service';
import { HttpLayoutService } from 'src/app/shared/services/http-layout.service';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  @ViewChild("tabForm", { read: ViewContainerRef, static: true }) tabForm!: ViewContainerRef;
  //**Declaration *
  public productForm!: FormGroup;
  public activeTab!: GridLayoutFormData.IFormTab;
  public formTabs$!: Observable<GridLayoutFormData.IFormTab[]>;

  //**constructor */
  constructor(
    private _dataService: DataService,
    private _dynamicFormService: DynamicFormService,
    private _rxDb: RxDbService,
    private httpLayoutService: HttpLayoutService
  ) { }

  // **life cycle hooks
  ngOnInit(): void {
    this.formTabs$ = this.httpLayoutService.formTabs$
      .pipe(
        tap(GridLayoutFormData => {
          this.productForm = this._dynamicFormService.generateForm(GridLayoutFormData);
          this._dataService.sendData(this.productForm);
          // this._rxDb.db.gridLayoutForm.insert({ name: "product form", layoutConfig: JSON.stringify(GridLayoutFormData) });
        }),
        map(GridLayoutFormData => Object.keys(GridLayoutFormData).map(key => ({ key, name: GridLayoutFormData[key].nameTab, formTab: GridLayoutFormData[key] }))),
        tap(formTabs => {
          this.activeTab = formTabs[0]
          this._dataService.sendDataByEventEmitter(formTabs);
        })
      )
  }
  //**Event binding */
  public onChangeFormTab(formTab: GridLayoutFormData.IFormTab): void {
    this.activeTab = formTab;
  }

}

