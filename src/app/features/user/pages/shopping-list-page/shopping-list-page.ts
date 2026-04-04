import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ShoppingListService } from '../../../../core/services/shopping-list.service';
import { ShoppingList } from '../../../../core/models/shopping-list.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-shopping-list-page',
  imports: [CommonModule, MatButtonModule, MatCardModule],
  templateUrl: './shopping-list-page.html',
  styleUrl: './shopping-list-page.scss',
})
export class ShoppingListPage implements OnInit {
  private readonly shoppingListService = inject(ShoppingListService);

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
          this.shoppingList.set(null);
        }
      });
  }

  updateQuantity(itemId: number, newQuantity: number): void {
    if (newQuantity < 1) return;

    this.shoppingListService
      .updateItem(itemId, { quantity: newQuantity })
      .subscribe({
        next: (list) => this.shoppingList.set(list),
        error: (err) => console.error('Failed to update quantity!!', err)
      });
  }

  removeItem(itemId: number): void {
    this.shoppingListService.removeItem(itemId).subscribe({
      next: () => this.loadShoppingList(),
      error: (err) => console.error('Failed to remove item!!', err)
    });
  }

  clearAll(): void {
    this.shoppingListService.clearAll().subscribe({
      next: () => this.loadShoppingList(),
      error: (err) => console.error('Failed to clear list!!', err)
    });
  }
}
