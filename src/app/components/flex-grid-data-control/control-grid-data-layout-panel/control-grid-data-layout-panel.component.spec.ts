import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlGridDataLayoutPanelComponent } from './control-grid-data-layout-panel.component';

describe('ControlGridDataLayoutPanelComponent', () => {
  let component: ControlGridDataLayoutPanelComponent;
  let fixture: ComponentFixture<ControlGridDataLayoutPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlGridDataLayoutPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlGridDataLayoutPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
