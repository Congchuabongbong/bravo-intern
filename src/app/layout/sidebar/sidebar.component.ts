import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  Input,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MenuItem } from '../../data-type';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit {
  public menuList!: [MenuItem];
  public btnSubMenu!: ElementRef[];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.menuList = [
      {
        title: 'Công cụ nhập liệu',
        submenu: ['Nhóm vật tư', 'Vật tư', 'Lấy nhà cung cấp', 'Lấy phân loại'],
      },
    ];
  }
  ngAfterViewInit() {}
}
