import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { MainContentComponent } from './layout/main-content/main-content.component';
import { BodyComponent } from './layout/body/body.component';
import { MenuItemSidebarComponent } from './components/menu-item-sidebar/menu-item-sidebar.component';
import { MenuErrorsSidebarComponent } from './components/menu-errors-sidebar/menu-errors-sidebar.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';
import { ControlLayoutComponent } from './components/control-layout/control-layout.component';
import { ControlFormFiledPanelComponent } from './components/control-form-filed-panel/control-form-filed-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    MainContentComponent,
    BodyComponent,
    MenuItemSidebarComponent,
    MenuErrorsSidebarComponent,
    ProductFormComponent,
    ControlLayoutComponent,
    ControlFormFiledPanelComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
