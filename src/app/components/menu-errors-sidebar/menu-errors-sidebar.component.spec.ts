import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuErrorsSidebarComponent } from './menu-errors-sidebar.component';

describe('MenuErrorsSidebarComponent', () => {
  let component: MenuErrorsSidebarComponent;
  let fixture: ComponentFixture<MenuErrorsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuErrorsSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuErrorsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
