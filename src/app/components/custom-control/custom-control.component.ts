import * as wjGrid from '@grapecity/wijmo.grid';
import { ElementRef, Injector, Input } from '@angular/core';
import * as wijCore from '@grapecity/wijmo';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-custom-control',
  templateUrl: './custom-control.component.html',
  styleUrls: ['./custom-control.component.scss'],

})
export class CustomControlComponent extends wijCore.Control implements OnInit {

  constructor(_el: ElementRef, _injector: Injector) {
    super(_el.nativeElement, _injector);
  }

  ngOnInit(): void {
    const controlInstance = wijCore.Control.getControl(this.hostElement);

    controlInstance.addEventListener(this.hostElement, 'click', () => {
      alert('Hello world');
    })
  }

}
