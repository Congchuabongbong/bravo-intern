import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  Input,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit {
  public menuList!: {
    title: string;
    submenu: string[];
  }[];
  public btnSubMenu!: ElementRef[];

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.menuList = [
      {
        title: 'Công cụ nhập liệu',
        submenu: ['Vật tư', 'Dữ liệu', 'Select ComboBox'],
      },
    ];
  }
  ngAfterViewInit() { }
}
