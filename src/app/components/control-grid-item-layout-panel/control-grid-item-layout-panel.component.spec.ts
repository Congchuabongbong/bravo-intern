import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlGridItemLayoutPanelComponent } from './control-grid-item-layout-panel.component';

describe('ControlGridItemLayoutPanelComponent', () => {
  let component: ControlGridItemLayoutPanelComponent;
  let fixture: ComponentFixture<ControlGridItemLayoutPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlGridItemLayoutPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlGridItemLayoutPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
