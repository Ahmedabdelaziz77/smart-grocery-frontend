import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShoppingListService } from '../../../../core/services/shopping-list.service';
import { ShoppingList } from '../../../../core/models/shopping-list.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-shopping-list-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './shopping-list-page.html',
  styleUrl: './shopping-list-page.scss',
})
export class ShoppingListPage implements OnInit {
  private readonly shoppingListService = inject(ShoppingListService);
  private readonly toast = inject(ToastService);

  readonly shoppingList = signal<ShoppingList | null>(null);
  readonly loading = signal(false);

  readonly items = computed(() => this.shoppingList()?.items ?? []);
  readonly totalItems = computed(() => this.items().length);
  readonly subtotal = computed(() => this.shoppingList()?.totalEstimatedPrice ?? 0);

  ngOnInit(): void {
    this.loadShoppingList();
  }

  loadShoppingList(): void {
    this.loading.set(true);

    this.shoppingListService
      .getShoppingList()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (list) => this.shoppingList.set(list),
        error: (err) => {
          console.error('Failed to load shopping list!!', err);
          this.toast.handleError(err, 'Failed to load shopping list');
          this.shoppingList.set(null);
        }
      });
  }

  updateQuantity(itemId: number, newQuantity: number): void {
    if (newQuantity < 1) return;

    this.shoppingListService
      .updateItem(itemId, { quantity: newQuantity })
      .subscribe({
        next: (list) => {
          this.shoppingList.set(list);
          this.toast.success('quantity updated!');
        },
        error: (err) => this.toast.handleError(err, 'Failed to update quantity')
      });
  }

  removeItem(itemId: number): void {
    this.shoppingListService.removeItem(itemId).subscribe({
      next: () => {
        this.toast.success('item removed');
        this.loadShoppingList();
      },
      error: (err) => this.toast.handleError(err, 'failed to remove item')
    });
  }

  clearAll(): void {
    this.shoppingListService.clearAll().subscribe({
      next: () => {
        this.toast.success('Shopping list cleared');
        this.loadShoppingList();
      },
      error: (err) => this.toast.handleError(err, 'failed to clear shopping list')
    });
  }
}
