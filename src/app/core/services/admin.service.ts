import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResponse, Product } from '../models/product.model';

export interface DashboardData {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  recentlyApproved: Product[];
  productsByCategory: CategoryCount[];
}

export interface CategoryCount {
  category: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/admin/products`;

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.api}/dashboard`);
  }

  searchExternal(query: string, page = 1, size = 10): Observable<any> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page)
      .set('size', size);

    return this.http.get(`${this.api}/search`, { params });
  }

  getApprovedProducts(page = 0, size = 10): Observable<PaginatedResponse<Product>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<PaginatedResponse<Product>>(`${this.api}/approved`, { params });
  }

  importProduct(product: any): Observable<Product> {
    return this.http.post<Product>(`${this.api}/import`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
