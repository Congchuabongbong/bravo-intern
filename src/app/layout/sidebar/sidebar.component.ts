import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
} from '@angular/core';

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
        submenu: ['Vật tư', 'Dữ liệu', 'Select ComboBox', 'Demo CollectionsView', 'Demo Tracking', 'Test Excel'],
      },
    ];
  }
  ngAfterViewInit() { }
}
