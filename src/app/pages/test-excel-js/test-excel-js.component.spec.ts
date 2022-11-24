import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestExcelJsComponent } from './test-excel-js.component';

describe('TestExcelJsComponent', () => {
  let component: TestExcelJsComponent;
  let fixture: ComponentFixture<TestExcelJsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestExcelJsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestExcelJsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
