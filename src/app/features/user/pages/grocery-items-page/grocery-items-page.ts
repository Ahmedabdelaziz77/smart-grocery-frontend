import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { ShoppingListService } from '../../../../core/services/shopping-list.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-grocery-items-page',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule
  ],
  templateUrl: './grocery-items-page.html',
  styleUrl: './grocery-items-page.scss',
})
export class GroceryItemsPage implements OnInit {
  readonly searchTerm = signal('');
  readonly selectedCategory = signal('');

  private readonly productService = inject(ProductService);
  private readonly shoppingListService = inject(ShoppingListService);
  private readonly toast = inject(ToastService);

  readonly categories = signal<string[]>([]);
  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);

  readonly page = signal(0);
  readonly size = 8;
  readonly totalPages = signal(0);
  readonly totalElements = signal(0);
  readonly isFirstPage = signal(true);
  readonly isLastPage = signal(true);

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadProducts(page = 0): void {
    this.loading.set(true);

    const name = this.searchTerm().trim();
    const category = this.selectedCategory().trim();

    const request$ =
      name || category
        ? this.productService.searchProducts(name, category, page, this.size)
        : this.productService.getProducts(page, this.size);

    request$
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.products.set(response.content);
          this.page.set(response.page);
          this.totalPages.set(response.totalPages);
          this.totalElements.set(response.totalElements);
          this.isFirstPage.set(response.first);
          this.isLastPage.set(response.last);
        },
        error: (err) => {
          console.error('Failed to load products!!', err);
          this.toast.handleError(err, 'Failed to load products');
          this.products.set([]);
        }
      });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (error) => {
        console.error('Failed to load categories', error);
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

  goToPreviousPage(): void {
    if (this.isFirstPage()) {
      return;
    }

    this.loadProducts(this.page() - 1);
  }

  goToNextPage(): void {
    if (this.isLastPage()) {
      return;
    }

    this.loadProducts(this.page() + 1);
  }

  addToList(productId: number): void {
    this.shoppingListService.addItem({ productId, quantity: 1 }).subscribe({
      next: () => this.toast.success('item added to shopping list'),
      error: (err) => this.toast.handleError(err, 'Failed to add item to shopping list')
    });
  }
}
