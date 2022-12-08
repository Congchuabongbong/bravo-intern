import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Excel from 'exceljs';
import * as FileSaver from 'file-saver';
import { BravoSvgEngine } from 'src/app/shared/libs/dom-to-svg/bravo.svg.engine';


@Component({
  selector: 'app-test-excel-js',
  templateUrl: './test-excel-js.component.html',
  styleUrls: ['./test-excel-js.component.scss']
})
export class TestExcelJsComponent implements OnInit {
  @ViewChild('container', { static: true }) container!: ElementRef;
  public svgEngine!: BravoSvgEngine;
  constructor() { }



  ngOnInit(): void {

  }
  public onDrawSvg() {

  }
}
