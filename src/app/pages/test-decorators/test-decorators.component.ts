import { Component, Inject, OnInit, Injectable, InjectionToken } from '@angular/core';
import { Computer } from 'src/app/shared/services/Computer.class';

import Swal from 'sweetalert2';
import { Environment } from '../../shared/config/environment.class';

@Component({
  selector: 'app-test-decorators',
  templateUrl: './test-decorators.component.html',
  styleUrls: ['./test-decorators.component.scss'],

})

export class TestDecoratorsComponent implements OnInit {

  constructor(private computer: Computer, private environment: Environment) { }

  ngOnInit(): void {
    console.log(this.environment.baseUrl);;

  }


}
