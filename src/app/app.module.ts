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
import { ControlFormFieldPanelComponent } from './components/form-control/control-form-field-panel/control-form-field-panel.component';
import { ControlGridLayoutPanelComponent } from './components/grid-control/control-grid-container-layout-panel/control-grid-layout-panel.component';
import { ControlFormLabelPanelComponent } from './components/form-control/control-form-label-panel/control-form-label-panel.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { CustomFormCheckboxComponent } from './components/form-control/custom-form-checkbox/custom-form-checkbox.component';
import { initDatabase, RxDbService } from './shared/services/rx-db.service';
import { ProductGridDataComponent } from './pages/product-grid-data/product-grid-data.component';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjInputModule } from '@grapecity/wijmo.angular2.input'; import { ControlGridItemLayoutPanelComponent } from './components/grid-control/control-grid-item-layout-panel/control-grid-item-layout-panel.component';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';
import { ControlGridDataLayoutPanelComponent } from './components/flex-grid-data-control/control-grid-data-layout-panel/control-grid-data-layout-panel.component';
import { ControlGridTabDataLayoutPanelComponent } from './components/flex-grid-data-control/control-grid-tab-data-layout-panel/control-grid-tab-data-layout-panel.component';
import { CustomControlComponent } from './components/custom-control/custom-control.component';
import { ControlFlexContainerPanelComponent } from './components/flex-control/control-flex-container-panel/control-flex-container-panel.component';
import { ControlFlexItemPanelComponent } from './components/flex-control/control-flex-item-panel/control-flex-item-panel.component';
import { TestBaseControlComponent } from './pages/test-base-control/test-base-control.component';
import { SelectControlPanelComponent } from './components/select-control-panel/select-control-panel.component';
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
    ControlGridDataLayoutPanelComponent,
    ControlGridTabDataLayoutPanelComponent,
    CustomControlComponent,
    ControlFlexContainerPanelComponent,
    ControlFlexItemPanelComponent,
    TestBaseControlComponent,
    SelectControlPanelComponent,

  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, FormsModule, HttpClientModule, WjGridModule, WjInputModule, WjGridFilterModule],
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
