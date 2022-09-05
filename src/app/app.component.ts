import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bravo-intern';
  public isSideBar!: boolean;
  public sideBarEvent(event: boolean) {
    this.isSideBar = event;
  }
}
