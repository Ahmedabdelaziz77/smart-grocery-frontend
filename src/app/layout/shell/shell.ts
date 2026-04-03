import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {

  private readonly authService = inject(AuthService);

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

}
