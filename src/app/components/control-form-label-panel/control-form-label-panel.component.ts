
import { Component, ElementRef, Input, OnInit, AfterViewInit } from '@angular/core';
import { FormFieldData } from 'src/app/data-type';
import { GridLayoutService } from 'src/app/services/grid-layout.service';

@Component({
  selector: 'app-control-form-label-panel',
  templateUrl: './control-form-label-panel.component.html',
  styleUrls: ['./control-form-label-panel.component.scss'],
})
export class ControlFormLabelPanelComponent implements OnInit, AfterViewInit {
  // ** Declaration
  public _field!: FormFieldData.ControlFormType;
  public label!: FormFieldData.ILabel;
  @Input() public set field(field: FormFieldData.ControlFormType) {
    this.label = field.attribute.label
    this._field = field;
  }
  public get field() {
    return this._field;
  };
  // **constructor
  constructor(private _element: ElementRef, private _gridLayoutService: GridLayoutService) { }
  //** Lifecycle hooks*/
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    if (this.field) {
      this._gridLayoutService.setPositionGirdItem(this._element, this.label.position)
    }
  }
}
