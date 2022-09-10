import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlLayoutComponent } from './control-layout.component';

describe('ControlLayoutComponent', () => {
  let component: ControlLayoutComponent;
  let fixture: ComponentFixture<ControlLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
