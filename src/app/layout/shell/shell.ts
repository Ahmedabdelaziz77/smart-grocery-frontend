import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  navItems = [
    { label: 'Dashboard', route: '/admin/dashboard' },
    { label: 'Product Import', route: '/admin/import' },
    { label: 'Approved Products', route: '/admin/products' },
    { label: 'Grocery Items', route: '/groceries' },
    { label: 'My Shopping List', route: '/shopping-list' }
  ];

}
