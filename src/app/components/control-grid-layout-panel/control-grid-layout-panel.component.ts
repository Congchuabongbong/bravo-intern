import { ControlContainer, FormGroup } from '@angular/forms';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { GridLayoutData, GridLayoutFormData } from 'src/app/data-type';
import { UnitOfMeasure } from 'src/app/data-type/grid-layout.data.type';
import GridLayout from 'src/app/shared/grid-layout.class';
import { GridLayoutService } from 'src/app/services/grid-layout.service';

@Component({
  selector: 'app-control-grid-layout-panel',
  templateUrl: './control-grid-layout-panel.component.html',
  styleUrls: ['./control-grid-layout-panel.component.scss'],
})
export class ControlGridLayoutPanelComponent implements OnInit, AfterViewInit {
  @ViewChild('') subControlGridLayoutFormData !: ElementRef;
  //**Input and Out decorator here: */
  @Input('row') rowOfNumber: number = 1;
  @Input('column') columnOfNumber: number = 1;
  @Input() columnGap?: string;
  @Input() rowGap?: string;
  @Input() arrayUnitRow?: UnitOfMeasure[];
  @Input() arrayUnitColumn?: UnitOfMeasure[];
  @Input() positionLine?: GridLayoutData.IPositionGridItem;
  @Input() width?: string;
  @Input() height?: string;
  @Input() minWidth?: string;
  @Input() minHeight?: string;
  @Input() maxWidth?: string;
  @Input() maxHeight?: string;
  @Input('idIp') id?: string;
  @Input('classIp') class?: string;
  @Input('formFieldConfig') formFieldConfig?: GridLayoutFormData.IControlGridLayoutFormData;
  @Input() groupNameForm?: string;
  // **Declare property class here:
  public gridLayout!: GridLayout;
  public instanceForm!: any;
  //** constructor */
  constructor(private _element: ElementRef, private _renderer: Renderer2, private _controlContainer: ControlContainer, private _cd: ChangeDetectorRef, private _gridLayoutService: GridLayoutService) { }
  //** Lifecycle here: */
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    if (this.formFieldConfig) {
      //** this approach using component for grid layout form
      this.generateGridLayoutFormDataPanel();
      this.instanceForm = this._controlContainer.control as FormGroup;
      this._cd.detectChanges();
    } else {
      //** this approach using content projection for every thing elements is grid item 
      if (this.rowOfNumber && this.columnOfNumber) {
        this.gridLayout = new GridLayout(
          this._element,
          this.rowOfNumber,
          this.columnOfNumber,
          this._renderer
        );
        if (this.arrayUnitColumn) {
          this.gridLayout.widthColumn = this.arrayUnitColumn;
        }
        if (this.arrayUnitRow) {
          this.gridLayout.heightRow = this.arrayUnitRow;
        }
        this.gridLayout.generateGridLayout();
      }
    }
    //**general behavior grid layout pass type input decorator external component
    if (this.rowGap) {
      this._gridLayoutService.setRowGap(this._element, this.rowGap);
    }
    if (this.columnGap) {
      this._gridLayoutService.setColumnGap(this._element, this.columnGap)
    }
    if (this.width) {
      this._gridLayoutService.setWidthGridContainer(this._element, this.width);
    }
    if (this.height) {
      this._gridLayoutService.setHeightGridContainer(this._element, this.height);
    }
    if (this.class) {
      this._gridLayoutService.setClass(this._element, this.class);
    }
    if (this.id) {
      this._gridLayoutService.setId(this._element, this.id);
    }
    if (this.positionLine) {
      this.gridLayout.setPositionGirdItem(this._element, this.positionLine);
    }
  }
  //** generate grid layout form for approach component for grid layout form
  private generateGridLayoutFormDataPanel(): void {
    if (this.formFieldConfig) {
      this.gridLayout = new GridLayout(
        this._element,
        this.formFieldConfig.row.rowOfNumber,
        this.formFieldConfig.column.columnOfNumber,
        this._renderer
      );
      if (this.formFieldConfig.column.arrayUnitColumn) {
        this.gridLayout.widthColumn = this.formFieldConfig.column.arrayUnitColumn;
      }
      if (this.formFieldConfig.row.arrayUnitRow !== undefined) {
        this.gridLayout.heightRow = this.formFieldConfig.row.arrayUnitRow
      }
      this.gridLayout.generateGridLayout();
    }
  }
}
