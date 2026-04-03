import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';
import { ProductImportPage } from './pages/product-import-page/product-import-page';
import { ApprovedProductsPage } from './pages/approved-products-page/approved-products-page';
import { roleGuard } from '../../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: DashboardPage,
    canActivate: [roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'import',
    component: ProductImportPage,
    canActivate: [roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'products',
    component: ApprovedProductsPage,
    canActivate: [roleGuard],
    data: { role: 'ADMIN' }
  }
];
