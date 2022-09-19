import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { MainContentComponent } from './layout/main-content/main-content.component';
import { BodyComponent } from './layout/body/body.component';
import { MenuItemSidebarComponent } from './components/menu-item-sidebar/menu-item-sidebar.component';
import { MenuErrorsSidebarComponent } from './components/menu-errors-sidebar/menu-errors-sidebar.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';
import { ControlFormFieldPanelComponent } from './components/control-form-field-panel/control-form-field-panel.component';
import { ControlGridLayoutPanelComponent } from './components/control-grid-layout-panel/control-grid-layout-panel.component';
import { ControlFormLabelPanelComponent } from './components/control-form-label-panel/control-form-label-panel.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';

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
    ControlFormFieldPanelComponent,
    ControlGridLayoutPanelComponent,
    ControlFormLabelPanelComponent,
    ErrorMessageComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
