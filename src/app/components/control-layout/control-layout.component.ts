import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-control-layout',
  templateUrl: './control-layout.component.html',
  styleUrls: ['./control-layout.component.scss'],
})
export class ControlLayoutComponent implements OnInit, AfterViewInit {
  @ViewChild('gridLayout') gridLayout!: ElementRef;
  @Input() tabName!: string;

  constructor(private renderer: Renderer2, private element: ElementRef) {}
  ngAfterViewInit(): void {
    console.log(this.gridLayout);
    this.renderer.setAttribute(
      this.gridLayout.nativeElement,
      'tabName',
      this.tabName
    );
  }

  ngOnInit(): void {}
}
