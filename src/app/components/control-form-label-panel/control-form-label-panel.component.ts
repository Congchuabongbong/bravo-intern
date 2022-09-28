
import { Component, ElementRef, Input, OnInit, AfterViewInit } from '@angular/core';
import { FormFieldData } from 'src/app/data-type';
import { GridLayoutService } from 'src/app/services/grid-layout.service';

@Component({
  selector: 'app-control-form-label-panel',
  templateUrl: './control-form-label-panel.component.html',
  styleUrls: ['./control-form-label-panel.component.scss'],
})
export class ControlFormLabelPanelComponent implements OnInit, AfterViewInit {
  @Input() field!: FormFieldData.ControlFormType;
  constructor(private _element: ElementRef, private _gridLayoutService: GridLayoutService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    if (this.field) {
      this._gridLayoutService.setPositionGirdItem(this._element, this.field.attribute.label.position)
    }
  }

}
