import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() sideBarEvent = new EventEmitter<boolean>();
  public isSideBar = false;
  constructor() {}

  ngOnInit(): void {}
  onClickMenu() {
    this.sideBarEvent.emit((this.isSideBar = !this.isSideBar));
  }
}
