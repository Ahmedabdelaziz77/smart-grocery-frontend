import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { ShoppingListService } from '../../../../core/services/shopping-list.service';
import { Product } from '../../../../core/models/product.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-product-detail-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail-page.html',
  styleUrl: './product-detail-page.scss',
})
export class ProductDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly shoppingListService = inject(ShoppingListService);
  private readonly toast = inject(ToastService);

  readonly product = signal<Product | null>(null);
  readonly loading = signal(false);
  readonly quantity = signal(1);

  readonly totalPrice = computed(() => {
    const current = this.product();
    if (!current) {
      return 0;
    }

    return current.estimatedPrice * this.quantity();
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      return;
    }

    this.loadProduct(id);
  }

  loadProduct(id: number): void {
    this.loading.set(true);

    this.productService
      .getProductById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (product) => this.product.set(product),
        error: (err) => {
          console.error('failed to load product details!!', err);
          this.toast.handleError(err, 'failed to load product details');
          this.product.set(null);
        }
      });
  }

  decreaseQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update((value) => value - 1);
    }
  }

  increaseQuantity(): void {
    this.quantity.update((value) => value + 1);
  }

  addToList(): void {
    const current = this.product();
    if (!current) return;

    this.shoppingListService
      .addItem({ productId: current.id, quantity: this.quantity() })
      .subscribe({
        next: () => this.toast.success('added to shopping list!'),
        error: (err) => this.toast.handleError(err, 'failed to add item to shopping list')
      });
  }
}
