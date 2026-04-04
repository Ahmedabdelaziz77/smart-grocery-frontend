import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AdminService, DashboardData } from '../../../../core/services/admin.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule, MatCardModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  private readonly adminService = inject(AdminService);

  dashboard = signal<DashboardData | null>(null);
  loading = signal(false);

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);

    this.adminService
      .getDashboard()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.dashboard.set(data),
        error: (err) => {
          console.error('Failed to load dashboard', err);
          this.dashboard.set(null);
        }
      });
  }
}
