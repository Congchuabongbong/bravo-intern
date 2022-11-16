import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlFormLabelPanelComponent } from './control-form-label-panel.component';

describe('ControlFormLabelPanelComponent', () => {
  let component: ControlFormLabelPanelComponent;
  let fixture: ComponentFixture<ControlFormLabelPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlFormLabelPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlFormLabelPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
