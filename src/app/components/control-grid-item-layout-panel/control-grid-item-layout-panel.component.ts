import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { GridLayoutData } from 'src/app/shared/data-type';
import { GridLayoutService } from 'src/app/shared/services/grid-layout.service';

@Component({
  selector: 'app-control-grid-item-layout-panel',
  templateUrl: './control-grid-item-layout-panel.component.html',
  styleUrls: ['./control-grid-item-layout-panel.component.scss']
})
export class ControlGridItemLayoutPanelComponent implements OnInit {
  @Input() position?: GridLayoutData.IPositionGridItem;
  @Input() width!: string;
  @Input() height!: string;
  @Input() minWidth!: string;
  @Input() minHeight!: string;
  @Input() maxWidth!: string;
  @Input() maxHeight!: string;
  @Input('idIp') id!: string;
  @Input('classIp') class!: string;
  @Input() displayName: string = 'block'
  @Input() overflow: string = 'visible';
  constructor(private _element: ElementRef, private _gridLayoutService: GridLayoutService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    if (this.position) {
      this._gridLayoutService.setPositionGirdItem(this._element, this.position)
    }
    //**general behavior grid layout pass type input decorator external component
    //**width */

    this._gridLayoutService.setDisplay(this._element, this.displayName);
    this._gridLayoutService.setOverflow(this._element, this.overflow);
    if (this.width) {
      this._gridLayoutService.setWidth(this._element, this.width);
    }
    if (this.minWidth) {
      this._gridLayoutService.setMinWidth(this._element, this.minWidth);
    }
    if (this.maxWidth) {
      this._gridLayoutService.setMaxWidth(this._element, this.maxWidth);
    }
    //**height */
    if (this.height) {
      this._gridLayoutService.setHeight(this._element, this.height);
    }
    if (this.minHeight) {
      this._gridLayoutService.setMinHeight(this._element, this.minHeight);
    }
    if (this.maxHeight) {
      this._gridLayoutService.setMaxHeight(this._element, this.maxHeight);
    }
    if (this.class) {
      this._gridLayoutService.setClass(this._element, this.class);
    }
    if (this.id) {
      this._gridLayoutService.setId(this._element, this.id);
    }
  }

}
