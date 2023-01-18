import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDecoratorsComponent } from './test-decorators.component';

describe('TestDecoratorsComponent', () => {
  let component: TestDecoratorsComponent;
  let fixture: ComponentFixture<TestDecoratorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestDecoratorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestDecoratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
