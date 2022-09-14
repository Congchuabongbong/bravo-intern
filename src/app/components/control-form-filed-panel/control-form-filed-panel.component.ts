import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-control-form-filed-panel',
  templateUrl: './control-form-filed-panel.component.html',
  styleUrls: ['./control-form-filed-panel.component.scss'],
})
export class ControlFormFiledPanelComponent implements OnInit, AfterViewInit {
  @Input() filed!: any;
  constructor(private _el: ElementRef, private _renderer: Renderer2) {}
  ngOnInit(): void {}
  ngAfterViewInit(): void {}
}
