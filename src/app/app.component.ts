import { Component, ElementRef, OnInit } from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import { Computer } from './shared/services/Computer.class';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends wjcCore.Control implements OnInit {
  title = 'bravo-intern';
  public isSideBar!: boolean;
  public sideBarEvent(event: boolean) {
    this.isSideBar = event;
  }
  constructor(elementRef: ElementRef, private computer: Computer) {
    super(elementRef.nativeElement);
    let body = document.querySelector('body') as any;
    wjcCore.removeChild(body.lastChild);
    wjcCore.removeChild(body.lastChild);
  }
  ngOnInit(): void {
    this.computer.ram = 10;
    console.log(this.computer.ram);
  }
}
