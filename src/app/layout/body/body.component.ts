import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
})
export class BodyComponent implements OnInit {
  @Input() isSideBar!: boolean;
  public productForm!: FormGroup;
  constructor() {}

  ngOnInit(): void {}

  // public receiveForm(form: any) {
  //   this.productForm = form;
  //   console.log(this.productForm);
  // }
}
