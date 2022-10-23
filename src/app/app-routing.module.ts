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
const routes: Routes = [
  {
    path: 'vat-tu',
    title: 'Vật Tư',
    component: ProductFormComponent,
  },
  {
    path: 'lay-nha-cung-cap',
    title: 'Vật Tư',
    component: ProductFormComponent,
  },
  {
    path: 'lay-phan-loai',
    title: 'Vật Tư',
    component: ProductFormComponent,
  },
  {
    path: 'nhom-vat-tu',
    title: 'Vật Tư',
    component: ProductFormComponent,
  },
  {
    path: 'vat-tu-data',
    title: 'Dữ Liệu Vật Tư',
    component: ProductGridDataComponent,
  },
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
