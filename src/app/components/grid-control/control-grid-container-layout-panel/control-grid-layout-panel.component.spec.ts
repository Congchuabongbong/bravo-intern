import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlGridLayoutPanelComponent } from './control-grid-layout-panel.component';

describe('ControlGridLayoutPanelComponent', () => {
  let component: ControlGridLayoutPanelComponent;
  let fixture: ComponentFixture<ControlGridLayoutPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlGridLayoutPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlGridLayoutPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
