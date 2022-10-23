import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGridDataComponent } from './product-grid-data.component';

describe('ProductGridDataComponent', () => {
  let component: ProductGridDataComponent;
  let fixture: ComponentFixture<ProductGridDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductGridDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductGridDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
