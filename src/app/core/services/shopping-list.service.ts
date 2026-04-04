import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AddShoppingListItemRequest,
  ShoppingList,
  UpdateShoppingListItemRequest
} from '../models/shopping-list.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/shopping-list`;

  getShoppingList(): Observable<ShoppingList> {
    return this.http.get<ShoppingList>(this.api);
  }

  addItem(payload: AddShoppingListItemRequest): Observable<ShoppingList> {
    return this.http.post<ShoppingList>(`${this.api}/items`, payload);
  }

  updateItem(itemId: number, payload: UpdateShoppingListItemRequest): Observable<ShoppingList> {
    return this.http.put<ShoppingList>(`${this.api}/items/${itemId}`, payload);
  }

  removeItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/items/${itemId}`);
  }

  clearAll(): Observable<void> {
    return this.http.delete<void>(`${this.api}/items`);
  }
}
