import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { GridLayoutData } from 'src/app/data-type';
import { UnitOfMeasure } from 'src/app/data-type/grid-layout-data.type';
import GridLayout from 'src/app/shared/grid-layout.class';

@Component({
  selector: 'app-control-grid-layout-panel',
  templateUrl: './control-grid-layout-panel.component.html',
  styleUrls: ['./control-grid-layout-panel.component.scss'],
})
export class ControlGridLayoutPanelComponent implements OnInit, AfterViewInit {
  @Input('row') rowOfNumber!: number;
  @Input('column') columnOfNumber!: number;
  @Input() columnGap!: string;
  @Input() rowGap!: string;
  @Input() arrayUnitRow?: UnitOfMeasure[];
  @Input() arrayUnitColumn?: UnitOfMeasure[];
  @Input() positionLine?: GridLayoutData.IPositionGridItem;
  @Input() width!: string;
  @Input() height!: string;
  @Input() minWidth!: string;
  @Input() minHeight!: string;
  @Input() maxWidth!: string;
  @Input() maxHeight!: string;
  @Output() currentTab = new EventEmitter<ElementRef>();
  public gridLayout!: GridLayout;
  constructor(private _element: ElementRef, private _renderer: Renderer2) { }

  ngOnInit(): void {
    this.currentTab.emit(this._element.nativeElement);
  }
  ngAfterViewInit(): void {
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
      if (this.rowGap) {
        this.gridLayout.setRowGap(this.rowGap);
      }
      if (this.columnGap) {
        this.gridLayout.setColumnGap(this.columnGap)
      }
      if (this.positionLine) {
        this.gridLayout.setPositionGirdItem(this._element, this.positionLine);
      }
      if (this.width) {
        this.gridLayout.setWidthGridContainer(this.width);
      }
      if (this.height) {
        this.gridLayout.setHeightGridContainer(this.height);
      }
    }
  }
}
