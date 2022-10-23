import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-control-grid-data-layout-panel',
  templateUrl: './control-grid-data-layout-panel.component.html',
  styleUrls: ['./control-grid-data-layout-panel.component.scss']
})
export class ControlGridDataLayoutPanelComponent implements OnInit {
  @Input('dataSource') itemsSource!: any[];
  @Input() columnConfig!: {};
  @Input() layoutConfig!: {};
  constructor() { }

  ngOnInit(): void {
  }

}
