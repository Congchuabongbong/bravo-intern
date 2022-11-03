import {
  Component,
  ElementRef,
  Input,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormFieldData } from 'src/app/shared/data-type';
import { GridLayoutService } from 'src/app/shared/services/grid-layout.service';

@Component({
  selector: 'app-control-form-field-panel',
  templateUrl: './control-form-field-panel.component.html',
  styleUrls: ['./control-form-field-panel.component.scss'],
})
export class ControlFormFieldPanelComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() field!: FormFieldData.ControlFormType;
  public formGroup!: any;

  //** constructor*/
  constructor(private _element: ElementRef, private _gridLayoutService: GridLayoutService, private _controlContainer: ControlContainer) {
  }

  //**Life cycle hooks */
  ngOnInit(): void {
    this.formGroup = this._controlContainer.control;
    if (this.field) {
      this._gridLayoutService.setPositionGirdItem(this._element, this.field.attribute.position)
    }
  }
  ngAfterViewInit(): void {
  }
  ngOnDestroy(): void {
  }
  //**Check instance of FormFieldData type*/
  public isInput(obj: any): obj is FormFieldData.IInput {
    return 'attribute' in obj && 'type' in obj;
  }
  public isSelect(obj: any): obj is FormFieldData.ISelect {
    return 'attribute' in obj && 'options' in obj;
  }
  public isTextarea(obj: any): obj is FormFieldData.ISelect {
    return 'attribute' in obj;
  }

}
