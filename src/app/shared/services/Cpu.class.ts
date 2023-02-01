import { Injectable } from "@angular/core";


export class Cpu {
  public name!: string;

  constructor(_name: string) {
    this.name = _name;
  }

  getSpec() {
    console.log('Cpu speed 3.14ghz!');
  }
}
