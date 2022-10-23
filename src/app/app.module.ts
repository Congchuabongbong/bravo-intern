import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
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
import { ControlGridLayoutPanelComponent } from './components/control-grid-container-layout-panel/control-grid-layout-panel.component';
import { ControlFormLabelPanelComponent } from './components/control-form-label-panel/control-form-label-panel.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { CustomFormCheckboxComponent } from './components/custom-form-checkbox/custom-form-checkbox.component';
import { initDatabase, RxDbService } from './shared/services/rx-db.service';
import { ProductGridDataComponent } from './pages/product-grid-data/product-grid-data.component';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { ControlGridItemLayoutPanelComponent } from './components/control-grid-item-layout-panel/control-grid-item-layout-panel.component';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';

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
    CustomFormCheckboxComponent,
    ProductGridDataComponent,
    ControlGridItemLayoutPanelComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, FormsModule, HttpClientModule, WjGridModule,
    WjInputModule,WjGridFilterModule],
  providers: [RxDbService, {
    provide: APP_INITIALIZER,
    useFactory: () => initDatabase,
    multi: true,
    deps: [
      /* your dependencies */
    ],
  },],
  bootstrap: [AppComponent],
})
export class AppModule { }
