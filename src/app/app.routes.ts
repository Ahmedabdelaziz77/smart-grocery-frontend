import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
   {
    path: 'auth',
    canActivate : [guestGuard],
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: '',
    component: Shell,
    canActivate : [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'groceries'
      },
      {
        path: '',
        loadChildren: () =>
          import('./features/user/user.routes').then((m) => m.USER_ROUTES)
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
