import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../../data-type';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public menuList!: [MenuItem];
  constructor() {}

  ngOnInit(): void {
    this.menuList = [
      {
        title: '1. Công cụ nhập liệu',
        submenu: ['Nhóm vật tư', 'Vật tư', 'Lấy nhà cung cấp', 'Lấy phân loại'],
      },
    ];
  }
}
