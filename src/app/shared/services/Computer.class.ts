import { Inject, Injectable } from '@angular/core';
import { Cpu } from './Cpu.class';
@Injectable({ providedIn: 'root' })
export class Computer {
  public ram: number = 8;
  constructor(@Inject(Cpu) public cpu: Cpu) { }
}
