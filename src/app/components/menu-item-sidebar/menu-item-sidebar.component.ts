import {
  Component,
  OnInit,
  Input,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { HandleStringService } from 'src/app/services/handle-string.service';


@Component({
  selector: 'app-menu-item-sidebar',
  templateUrl: './menu-item-sidebar.component.html',
  styleUrls: ['./menu-item-sidebar.component.scss'],
})
export class MenuItemSidebarComponent implements OnInit, AfterViewInit {
  @Input() menuList!: {
    title: string;
    submenu: string[];
  }[];
  public btnSubMenu!: ElementRef[];
  constructor(
    private handleStringService: HandleStringService,
    private el: ElementRef
  ) { }

  ngOnInit(): void { }
  ngAfterViewInit(): void {
    this.btnSubMenu = this.el.nativeElement.querySelectorAll(
      '.sideNav__sub-menu--item'
    );
  }
  public convertStringToRoute(value: string): string {
    return this.handleStringService.handleSpecialCharacter(value);
  }
}
