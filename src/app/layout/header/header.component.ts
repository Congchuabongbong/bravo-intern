import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpLayoutService } from 'src/app/shared/services/http-layout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() sideBarEvent = new EventEmitter<boolean>();
  public isSideBar = false;
  constructor(private _httpLayoutService: HttpLayoutService) { }

  ngOnInit(): void { }
  public onClickMenu() {
    this.sideBarEvent.emit((this.isSideBar = !this.isSideBar));
  }
  public onSelectChange(event: any) {

    this._httpLayoutService.selectedLayoutChange(+event.target.value);

  };
}
