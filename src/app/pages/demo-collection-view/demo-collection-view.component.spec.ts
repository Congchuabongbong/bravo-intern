import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoCollectionViewComponent } from './demo-collection-view.component';

describe('DemoCollectionViewComponent', () => {
  let component: DemoCollectionViewComponent;
  let fixture: ComponentFixture<DemoCollectionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoCollectionViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoCollectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
