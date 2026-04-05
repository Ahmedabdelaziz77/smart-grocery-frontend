import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly currentUser = this.authService.currentUser;
  readonly role = this.authService.role;

  readonly userInitial = computed(() => {
    const name = this.currentUser()?.fullName;
    return name ? name.charAt(0).toUpperCase() : '?';
  });

  readonly navItems = computed(() => {
      if (this.role() === 'ADMIN') {
        return [
          { label: 'Dashboard', route: '/admin/dashboard', icon: 'dashboard' },
          { label: 'Product Import', route: '/admin/import', icon: 'cloud_download' },
          { label: 'Approved Products', route: '/admin/products', icon: 'inventory_2' }
        ];
      }

      return [
        { label: 'Grocery Items', route: '/groceries', icon: 'shopping_cart' },
        { label: 'My Shopping List', route: '/shopping-list', icon: 'list_alt' }
      ];
    });

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.toast.info('You have been logged out');
        this.router.navigate(['/auth']);
      },
      error: () => {
        this.router.navigate(['/auth']);
      }
    });
  }

}
