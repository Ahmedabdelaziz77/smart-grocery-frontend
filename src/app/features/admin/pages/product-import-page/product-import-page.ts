import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../../../core/services/admin.service';
import { ImportDialog, ImportDialogResult } from './import-dialog';
import { ToastService } from '../../../../shared/services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-product-import-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
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
  selectedIds = signal<Set<string>>(new Set());

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

  onSearch(): void {
    const query = this.searchQuery().trim();
    if (!query) return;

    this.loading.set(true);
    this.page.set(0);
    this.selectedIds.set(new Set());

    this.adminService
      .searchExternal(query)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.allResults.set(data.content ?? data ?? []),
        error: (err) => {
          console.error('search failed', err);
          this.toast.error('server is busy just click search again!');
          this.allResults.set([]);
        }
      });
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
        next: () => this.toast.success('product imported successfully!'),
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
