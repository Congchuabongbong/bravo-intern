import { Component, ElementRef } from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends wjcCore.Control {
  title = 'bravo-intern';
  public isSideBar!: boolean;
  public sideBarEvent(event: boolean) {
    this.isSideBar = event;
  }
  constructor(elementRef: ElementRef) {
    super(elementRef.nativeElement);
    let body = document.querySelector('body') as any;
    wjcCore.removeChild(body.lastChild);
    wjcCore.removeChild(body.lastChild);
  }
}
