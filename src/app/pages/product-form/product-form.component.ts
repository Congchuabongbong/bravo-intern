//*Import form core angular */
import {
  Component,
  OnInit,
  ElementRef
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
//**import from source */
import { DataService } from 'src/app/services/data.service';
import { GridLayoutForm } from 'src/app/data-type';
import { map, Observable, tap } from 'rxjs';
import { DynamicFormService } from 'src/app/services/dynamic-form.service';
interface formTabItem {
  nameTab: string;
  formTab: GridLayoutForm.IControlGridLayoutForm;
}
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  //**Declaration */
  public tabLinks!: ElementRef[];
  public tabContents!: ElementRef[];
  public productForm!: FormGroup;
  public activeTab!: formTabItem;
  public formTabs$!: Observable<formTabItem[]>;
  //**constructor */
  constructor(
    private _dataService: DataService,
    private _fb: FormBuilder,
    private _dynamicFormService: DynamicFormService,
    private _http: HttpClient,
  ) { }
  // **life cycle hooks
  ngOnInit(): void {
    this.formTabs$ = this.getLayoutForm()
      .pipe(
        tap(gridLayoutForm => {
          const entries = Object.keys(gridLayoutForm).map(key => [key, this._dynamicFormService.generateFormGroup(gridLayoutForm[key])]);
          const initFormModel = Object.fromEntries(entries);
          this.productForm = this._fb.group(initFormModel);
          this._dataService.sendData(this.productForm);
        }),
        map(gridLayoutForm => Object.keys(gridLayoutForm).map(key => ({ nameTab: key, formTab: gridLayoutForm[key] }))),
        tap(formTabs => {
          this.activeTab = formTabs[0]
          this._dataService.sendDataByEventEmitter(formTabs);
        })
      )
  }
  //**Event binding */
  public onchangeFormTab(formTab: formTabItem): void {
    this.activeTab = formTab;
  }
  //** get layout 
  private getLayoutForm(): Observable<any> {
    return this._http.get('assets/data/layout-form.data.json');
  }

}

