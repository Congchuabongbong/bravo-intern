import {
  Component,
  OnInit,
  Input,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { HandleStringService } from 'src/app/shared/services/handle-string.service';


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
    private _handleStringService: HandleStringService,
    private _el: ElementRef
  ) { }

  ngOnInit(): void { }
  ngAfterViewInit(): void {
    this.btnSubMenu = this._el.nativeElement.querySelectorAll(
      '.sideNav__sub-menu--item'
    );
  }
  public convertStringToRoute(value: string): string {
    return this._handleStringService.handleSpecialCharacter(value);
  }
}
