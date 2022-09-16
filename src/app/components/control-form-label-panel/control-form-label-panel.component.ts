
import { Component, ElementRef, Input, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { FormFieldData } from 'src/app/data-type';
import { GridLayoutService } from 'src/app/services/grid-layout.service';

@Component({
  selector: 'app-control-form-label-panel',
  templateUrl: './control-form-label-panel.component.html',
  styleUrls: ['./control-form-label-panel.component.scss'],
})
export class ControlFormLabelPanelComponent implements OnInit, AfterViewInit {
  @Input() label!: FormFieldData.ILabel;
  @Input() order!: number;
  constructor(private _element: ElementRef, private _gridLayoutService: GridLayoutService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this._gridLayoutService.setPositionGirdItem(this._element, this.label.position)
  }

}
