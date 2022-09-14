import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlFormFiledPanelComponent } from './control-form-filed-panel.component';

describe('ControlFormFiledPanelComponent', () => {
  let component: ControlFormFiledPanelComponent;
  let fixture: ComponentFixture<ControlFormFiledPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlFormFiledPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlFormFiledPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
