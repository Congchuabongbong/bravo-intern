import { ControlContainer, FormGroup } from '@angular/forms';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
  Input,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { GridLayoutData, GridLayoutFormData } from 'src/app/shared/data-type';
import GridLayout from 'src/app/shared/utils/grid-layout.class.util';
import { GridLayoutService } from 'src/app/shared/services/grid-layout.service';
import { IStyleOptions } from 'src/app/shared/data-type/grid-layout.data.type';

@Component({
  selector: 'app-control-grid-container-layout-panel',
  templateUrl: './control-grid-layout-panel.component.html',
  styleUrls: ['./control-grid-layout-panel.component.scss'],
})
export class ControlGridLayoutPanelComponent implements OnInit, AfterViewInit {
  //**Input and Out decorator here: */
  @Input()
  get layoutConfig() {
    return this._layoutConfig;

  }
  set layoutConfig(value: GridLayoutData.IGridLayout) {
    this._layoutConfig = value;
    this.generateGridLayout();
  };
  @Input('formFieldConfig') formFieldConfig!: GridLayoutFormData.IControlGridLayoutFormData;
  @Input() columnGap!: string;
  @Input() rowGap!: string;
  @Input() positionLine!: GridLayoutData.IPositionGridItem;
  @Input() width: string = '100%';
  @Input() height: string = '100%';
  @Input() minWidth!: string;
  @Input() minHeight!: string;
  @Input() maxWidth!: string;
  @Input() maxHeight!: string;
  @Input('idIp') id!: string;
  @Input('classIp') class!: string;
  @Input() groupNameForm!: string;
  @Input() displayName: string = 'grid'
  @Input() overflow: string = 'visible'
  @Input() styleOptions!: IStyleOptions;
  // **Declare property class here:
  public gridLayout!: GridLayout;
  public instanceForm!: any;
  public _controlContainer !: ControlContainer;
  private _layoutConfig!: GridLayoutData.IGridLayout;
  //** constructor */
  constructor(private _element: ElementRef, private _renderer: Renderer2, private _cd: ChangeDetectorRef, private _gridLayoutService: GridLayoutService, private injector: Injector) {
  }


  //** Lifecycle here: */
  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    // if (this.layoutConfig && changes['layoutConfig']) {
    //   //** this approach using content projection for every thing elements is grid item
    //   if (this.layoutConfig) {

    //   }
    // }
  }
  ngAfterViewInit(): void {
    if (this.formFieldConfig) {
      this._controlContainer = this.injector.get<ControlContainer>(ControlContainer); //dynamic add dependency injection service */
      //** this approach using component for grid layout form
      this.generateGridLayoutFormDataPanel();
      this.instanceForm = this._controlContainer.control as FormGroup;
      this._cd.detectChanges();
    }

    //**general behavior grid layout pass type input decorator external component
    this._gridLayoutService.setDisplay(this._element, this.displayName);
    this.overflow && this._gridLayoutService.setOverflow(this._element, this.overflow);
    this.rowGap && this._gridLayoutService.setRowGap(this._element, this.rowGap);
    this.columnGap && this._gridLayoutService.setColumnGap(this._element, this.columnGap)
    //**width */
    this.width && this._gridLayoutService.setWidth(this._element, this.width);
    this.minWidth && this._gridLayoutService.setMinWidth(this._element, this.minWidth);
    this.maxWidth && this._gridLayoutService.setMaxWidth(this._element, this.maxWidth);
    //**height */
    this.height && this._gridLayoutService.setHeight(this._element, this.height);
    this.minHeight && this._gridLayoutService.setMinHeight(this._element, this.minHeight);
    this.maxHeight && this._gridLayoutService.setMaxHeight(this._element, this.maxHeight);
    this.class && this._gridLayoutService.setClass(this._element, this.class);
    this.id && this._gridLayoutService.setId(this._element, this.id);
    this.positionLine && this.gridLayout.setPositionGirdItem(this._element, this.positionLine);

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
  //**Generate Layout */
  private generateGridLayout(): void {
    this.gridLayout = new GridLayout(
      this._element,
      this.layoutConfig.row.rowOfNumber,
      this.layoutConfig.column.columnOfNumber,
      this._renderer
    );
    if (this.layoutConfig.column.arrayUnitColumn) {
      this.gridLayout.widthColumn = this.layoutConfig.column.arrayUnitColumn;
    }
    if (this.layoutConfig.row.arrayUnitRow) {
      this.gridLayout.heightRow = this.layoutConfig.row.arrayUnitRow;
    }
    this.gridLayout.generateGridLayout();
  }
}
