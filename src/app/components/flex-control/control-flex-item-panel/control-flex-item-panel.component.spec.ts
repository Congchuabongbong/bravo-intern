import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlFlexItemPanelComponent } from './control-flex-item-panel.component';

describe('ControlFlexItemPanelComponent', () => {
  let component: ControlFlexItemPanelComponent;
  let fixture: ComponentFixture<ControlFlexItemPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlFlexItemPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlFlexItemPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
