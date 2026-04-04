import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResponse, Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/products`;

  getProducts(page = 0, size = 10): Observable<PaginatedResponse<Product>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<PaginatedResponse<Product>>(this.api, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.api}/${id}`);
  }

  searchProducts(
    name: string,
    category: string,
    page = 0,
    size = 10
  ): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (name) {
      params = params.set('name', name);
    }

    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<PaginatedResponse<Product>>(
      `${this.api}/search`,
      { params }
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.api}/categories`);
  }
}
