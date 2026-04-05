import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AdminService } from '../../../../core/services/admin.service';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-approved-products-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './approved-products-page.html',
  styleUrl: './approved-products-page.scss',
})
export class ApprovedProductsPage implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly productService = inject(ProductService);
  private readonly toast = inject(ToastService);

  searchTerm = signal('');
  selectedCategory = signal('');

  categories = signal<string[]>([]);
  products = signal<Product[]>([]);
  loading = signal(false);

  page = signal(0);
  size = 8;
  totalPages = signal(0);
  isFirstPage = signal(true);
  isLastPage = signal(true);

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadProducts(page = 0): void {
    this.loading.set(true);

    const name = this.searchTerm().trim();
    const category = this.selectedCategory().trim();

    this.adminService
      .getApprovedProducts(page, this.size, name, category)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.products.set(response.content);
          this.page.set(response.page);
          this.totalPages.set(response.totalPages);
          this.isFirstPage.set(response.first);
          this.isLastPage.set(response.last);
        },
        error: (err) => {
          console.error('failed to load approved products', err);
          this.toast.handleError(err, 'failed to load approved products');
          this.products.set([]);
        }
      });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (err) => {
        console.error('Failed to load categories', err);
        this.categories.set([]);
      }
    });
  }

  onSearch(): void {
    this.loadProducts(0);
  }

  onCategoryChange(category: string): void {
    this.selectedCategory.set(category);
    this.loadProducts(0);
  }

  removeProduct(id: number): void {
    this.adminService.deleteProduct(id).subscribe({
      next: () => {
        this.toast.success('product removed');
        this.loadProducts(this.page());
      },
      error: (err) => this.toast.handleError(err, 'Failed to remove product')
    });
  }

  goToPreviousPage(): void {
    if (this.isFirstPage()) return;
    this.loadProducts(this.page() - 1);
  }

  goToNextPage(): void {
    if (this.isLastPage()) return;
    this.loadProducts(this.page() + 1);
  }
}
