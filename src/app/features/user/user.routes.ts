import { Routes } from '@angular/router';
import { GroceryItemsPage } from './pages/grocery-items-page/grocery-items-page';
import { ProductDetailPage } from './pages/product-detail-page/product-detail-page';
import { ShoppingListPage } from './pages/shopping-list-page/shopping-list-page';
import { roleGuard } from '../../core/guards/role.guard';

export const USER_ROUTES: Routes = [
  {
    path: 'groceries',
    component: GroceryItemsPage,
    canActivate : [roleGuard],
    data : {role : 'USER'}
  },
  {
    path: 'groceries/:id',
    component: ProductDetailPage,
    canActivate : [roleGuard],
    data : {role : 'USER'}
  },
  {
    path: 'shopping-list',
    component: ShoppingListPage,
    canActivate : [roleGuard],
    data : {role : 'USER'}
  }
];
