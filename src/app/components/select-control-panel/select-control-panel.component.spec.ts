import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectControlPanelComponent } from './select-control-panel.component';

describe('SelectControlPanelComponent', () => {
  let component: SelectControlPanelComponent;
  let fixture: ComponentFixture<SelectControlPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectControlPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
