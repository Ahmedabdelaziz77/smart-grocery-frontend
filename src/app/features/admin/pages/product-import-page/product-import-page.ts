import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminService } from '../../../../core/services/admin.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-product-import-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './product-import-page.html',
  styleUrl: './product-import-page.scss',
})
export class ProductImportPage {
  private readonly adminService = inject(AdminService);

  searchQuery = signal('');
  results = signal<any[]>([]);
  loading = signal(false);
  importingIds = signal<Set<string>>(new Set());

  onSearch(): void {
    const query = this.searchQuery().trim();
    if (!query) return;

    this.loading.set(true);

    this.adminService
      .searchExternal(query)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.results.set(data.content ?? data ?? []),
        error: (err) => {
          console.error('Search failed', err);
          this.results.set([]);
        }
      });
  }

  importProduct(product: any): void {
    const id = product.externalId || product.id;
    const current = new Set(this.importingIds());
    current.add(id);
    this.importingIds.set(current);

    this.adminService.importProduct(product).subscribe({
      next: () => {
        const updated = new Set(this.importingIds());
        updated.delete(id);
        this.importingIds.set(updated);
      },
      error: (err) => {
        console.error('Import failed', err);
        const updated = new Set(this.importingIds());
        updated.delete(id);
        this.importingIds.set(updated);
      }
    });
  }

  isImporting(product: any): boolean {
    const id = product.externalId || product.id;
    return this.importingIds().has(id);
  }
}
