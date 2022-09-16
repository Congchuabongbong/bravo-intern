import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlFormFieldPanelComponent } from './control-form-field-panel.component';

describe('ControlFormFiledPanelComponent', () => {
  let component: ControlFormFieldPanelComponent;
  let fixture: ComponentFixture<ControlFormFieldPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ControlFormFieldPanelComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ControlFormFieldPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
