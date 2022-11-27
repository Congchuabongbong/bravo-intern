import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoTrackingChangesComponent } from './demo-tracking-changes.component';

describe('DemoTrackingChangesComponent', () => {
  let component: DemoTrackingChangesComponent;
  let fixture: ComponentFixture<DemoTrackingChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoTrackingChangesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoTrackingChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
