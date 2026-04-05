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

  readonly navItems = computed(() => {
      if (this.role() === 'ADMIN') {
        return [
          { label: 'Dashboard', route: '/admin/dashboard' },
          { label: 'Product Import', route: '/admin/import' },
          { label: 'Approved Products', route: '/admin/products' }
        ];
      }

      return [
        { label: 'Grocery Items', route: '/groceries' },
        { label: 'My Shopping List', route: '/shopping-list' }
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
