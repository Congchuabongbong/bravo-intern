import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlFlexContainerPanelComponent } from './control-flex-container-panel.component';

describe('ControlFlexContainerPanelComponent', () => {
  let component: ControlFlexContainerPanelComponent;
  let fixture: ComponentFixture<ControlFlexContainerPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlFlexContainerPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlFlexContainerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
