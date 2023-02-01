import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, forwardRef, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomControlComponent } from './components/custom-control/custom-control.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { ControlFlexContainerPanelComponent } from './components/flex-control/control-flex-container-panel/control-flex-container-panel.component';
import { ControlFlexItemPanelComponent } from './components/flex-control/control-flex-item-panel/control-flex-item-panel.component';
import { ControlGridDataLayoutPanelComponent } from './components/flex-grid-data-control/control-grid-data-layout-panel/control-grid-data-layout-panel.component';
import { ControlGridTabDataLayoutPanelComponent } from './components/flex-grid-data-control/control-grid-tab-data-layout-panel/control-grid-tab-data-layout-panel.component';
import { ControlFormFieldPanelComponent } from './components/form-control/control-form-field-panel/control-form-field-panel.component';
import { ControlFormLabelPanelComponent } from './components/form-control/control-form-label-panel/control-form-label-panel.component';
import { CustomFormCheckboxComponent } from './components/form-control/custom-form-checkbox/custom-form-checkbox.component';
import { ControlGridLayoutPanelComponent } from './components/grid-control/control-grid-container-layout-panel/control-grid-layout-panel.component';
import { ControlGridItemLayoutPanelComponent } from './components/grid-control/control-grid-item-layout-panel/control-grid-item-layout-panel.component';
import { ItemComponent } from './components/item/item.component';
import { MenuErrorsSidebarComponent } from './components/menu-errors-sidebar/menu-errors-sidebar.component';
import { MenuItemSidebarComponent } from './components/menu-item-sidebar/menu-item-sidebar.component';
import { SelectControlPanelComponent } from './components/select-control-panel/select-control-panel.component';
import { BodyComponent } from './layout/body/body.component';
import { HeaderComponent } from './layout/header/header.component';
import { MainContentComponent } from './layout/main-content/main-content.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { DemoCollectionViewComponent } from './pages/demo-collection-view/demo-collection-view.component';
import { DemoTrackingChangesComponent } from './pages/demo-tracking-changes/demo-tracking-changes.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';
import { ProductGridDataComponent } from './pages/product-grid-data/product-grid-data.component';
import { TestBaseControlComponent } from './pages/test-base-control/test-base-control.component';
import { TestDecoratorsComponent } from './pages/test-decorators/test-decorators.component';
import { CustomPipePipe } from './shared/pipes/custom-pipe.pipe';
import { initDatabase } from './shared/services/rx-db.service';
import { Cpu } from './shared/services/Cpu.class';
import { Environment } from './shared/config/environment.class';
import { environment } from '../environments/environment.prod';


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
    DemoCollectionViewComponent,
    DemoTrackingChangesComponent,
    CustomPipePipe,
    TestDecoratorsComponent,
    ItemComponent
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, FormsModule, HttpClientModule, WjGridModule, WjInputModule, WjGridFilterModule],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: () => initDatabase,
    multi: true,
    deps: [
      /* your dependencies */
    ],
  },
  { provide: Cpu, useFactory: () => new Cpu('Intel i5') },
  { provide: Environment, useValue: environment }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
