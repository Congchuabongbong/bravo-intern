import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlGridTabDataLayoutPanelComponent } from './control-grid-tab-data-layout-panel.component';

describe('ControlGridTabDataLayoutPanelComponent', () => {
  let component: ControlGridTabDataLayoutPanelComponent;
  let fixture: ComponentFixture<ControlGridTabDataLayoutPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlGridTabDataLayoutPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlGridTabDataLayoutPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
