import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../../../core/services/admin.service';
import { ImportDialog, ImportDialogResult } from './import-dialog';
import { ToastService } from '../../../../shared/services/toast.service';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-product-import-page',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './product-import-page.html',
  styleUrl: './product-import-page.scss',
})
export class ProductImportPage {
  private readonly adminService = inject(AdminService);
  private readonly dialog = inject(MatDialog);
  private readonly toast = inject(ToastService);

  searchQuery = signal('');
  allResults = signal<any[]>([]);
  loading = signal(false);
  hasSearched = signal(false);
  selectedIds = signal<Set<string>>(new Set());
  importedIds = signal<Set<string>>(new Set());

  readonly popularSearches = [
    'Chicken', 'Rice', 'Pasta', 'Eggs', 'Milk',
    'Salmon', 'Oats', 'Yogurt', 'Bread', 'Beans'
  ];

  // client-side pagination
  page = signal(0);
  pageSize = 8;

  totalPages = computed(() => Math.ceil(this.allResults().length / this.pageSize));
  isFirstPage = computed(() => this.page() === 0);
  isLastPage = computed(() => this.page() >= this.totalPages() - 1);

  pagedResults = computed(() => {
    const start = this.page() * this.pageSize;
    return this.allResults().slice(start, start + this.pageSize);
  });

  selectedCount = computed(() => this.selectedIds().size);

  quickSearch(term: string): void {
    this.searchQuery.set(term);
    this.onSearch();
  }

  onSearch(): void {
    const query = this.searchQuery().trim();
    if (!query) return;

    this.loading.set(true);
    this.page.set(0);
    this.selectedIds.set(new Set());

    forkJoin({
      results: this.adminService.searchExternal(query),
      importedIds: this.adminService.getApprovedExternalIds()
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ results, importedIds }) => {
          this.allResults.set(results.content ?? results ?? []);
          this.importedIds.set(importedIds);
          this.hasSearched.set(true);
        },
        error: (err) => {
          console.error('search failed', err);
          this.toast.error('server is busy just click search again!');
          this.allResults.set([]);
          this.hasSearched.set(true);
        }
      });
  }

  isImported(product: any): boolean {
    const id = product.externalId || product.id;
    return this.importedIds().has(id);
  }

  isSelected(product: any): boolean {
    const id = product.externalId || product.id;
    return this.selectedIds().has(id);
  }

  toggleSelection(product: any): void {
    const id = product.externalId || product.id;
    const current = new Set(this.selectedIds());

    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }

    this.selectedIds.set(current);
  }

  openSingleImport(product: any): void {
    const dialogRef = this.dialog.open(ImportDialog, {
      data: {
        products: [{
          externalId: product.externalId || product.id,
          name: product.name,
          imageUrl: product.imageUrl
        }]
      }
    });

    dialogRef.afterClosed().subscribe((result: ImportDialogResult | undefined) => {
      if (!result) return;

      const item = result.products[0];
      this.adminService.importProduct(item.externalId, item.estimatedPrice).subscribe({
        next: () => {
          this.toast.success('product imported successfully!');
          const updated = new Set(this.importedIds());
          updated.add(item.externalId);
          this.importedIds.set(updated);
        },
        error: (err) => this.toast.handleError(err, 'failed to import product!')
      });
    });
  }

  openBulkImport(): void {
    const selected = this.allResults().filter((p) => {
      const id = p.externalId || p.id;
      return this.selectedIds().has(id);
    });

    if (!selected.length) return;

    const dialogRef = this.dialog.open(ImportDialog, {
      data: {
        products: selected.map((p) => ({
          externalId: p.externalId || p.id,
          name: p.name,
          imageUrl: p.imageUrl
        }))
      }
    });

    dialogRef.afterClosed().subscribe((result: ImportDialogResult | undefined) => {
      if (!result) return;

      this.adminService.bulkImport(result.products).subscribe({
        next: () => {
          this.toast.success(`${result.products.length} products imported successfully!`);
          this.selectedIds.set(new Set());
          const updated = new Set(this.importedIds());
          result.products.forEach((p) => updated.add(p.externalId));
          this.importedIds.set(updated);
        },
        error: (err) => this.toast.handleError(err, 'Bulk import failed')
      });
    });
  }

  goToPreviousPage(): void {
    if (this.isFirstPage()) return;
    this.page.update((p) => p - 1);
  }

  goToNextPage(): void {
    if (this.isLastPage()) return;
    this.page.update((p) => p + 1);
  }
}
