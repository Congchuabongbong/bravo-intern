import { Injectable, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  RouterModule,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
} from '@angular/router';
import { ProductFormComponent } from './pages/product-form/product-form.component';
import { ProductGridDataComponent } from './pages/product-grid-data/product-grid-data.component';
import { TestBaseControlComponent } from './pages/test-base-control/test-base-control.component';
import { DemoCollectionViewComponent } from './pages/demo-collection-view/demo-collection-view.component';
import { DemoTrackingChangesComponent } from './pages/demo-tracking-changes/demo-tracking-changes.component';
import { TestDecoratorsComponent } from './pages/test-decorators/test-decorators.component';

const routes: Routes = [
  {
    path: 'vat-tu',
    title: 'Vật Tư',
    component: ProductFormComponent,
  },
  {
    path: 'du-lieu',
    title: 'Dữ Liệu Vật Tư',
    component: ProductGridDataComponent,
  },
  {
    path: 'select-combobox',
    title: 'Tess Base Control',
    component: TestBaseControlComponent,
  },
  {
    path: 'demo-collectionsview',
    title: 'Demo CollectionView',
    component: DemoCollectionViewComponent,
  },
  {
    path: 'demo-tracking',
    title: 'Demo Tracking Changes Component',
    component: DemoTrackingChangesComponent,
  },
  {
    path: 'custom-decorators',
    title: 'Demo Custom Decorators',
    component: TestDecoratorsComponent,
  }
];

@Injectable({ providedIn: 'root' })
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`Bravo | ${title}`);
    }
  }
}
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: TitleStrategy, useClass: TemplatePageTitleStrategy }],
})
export class AppRoutingModule { }
