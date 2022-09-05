import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemSidebarComponent } from './menu-item-sidebar.component';

describe('MenuItemSidebarComponent', () => {
  let component: MenuItemSidebarComponent;
  let fixture: ComponentFixture<MenuItemSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuItemSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItemSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
