import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestBaseControlComponent } from './test-base-control.component';

describe('TestBaseControlComponent', () => {
  let component: TestBaseControlComponent;
  let fixture: ComponentFixture<TestBaseControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestBaseControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestBaseControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
