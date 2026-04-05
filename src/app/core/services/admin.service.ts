import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  searchExternal(query: string, page = 1, size = 50): Observable<any> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page)
      .set('size', size);

    return this.http.get(`${this.api}/search`, { params });
  }

  getApprovedProducts(page = 0, size = 10, name = '', category = ''): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (name) {
      params = params.set('name', name);
    } else {
      params = params.set('name', '');
    }

    if (category) {
      params = params.set('category', category);
    } else {
      params = params.set('category', '');
    }

    return this.http.get<PaginatedResponse<Product>>(`${this.api}/approved`, { params });
  }

  getApprovedExternalIds(): Observable<Set<string>> {
    const params = new HttpParams()
      .set('page', 0)
      .set('size', 1000)
      .set('name', '')
      .set('category', '');

    return this.http.get<PaginatedResponse<Product>>(`${this.api}/approved`, { params }).pipe(
      map((response) => {
        const ids = new Set<string>();
        response.content.forEach((p) => {
          if (p.externalId) ids.add(p.externalId);
        });
        return ids;
      })
    );
  }

  importProduct(externalId: string, estimatedPrice: number): Observable<Product> {
    return this.http.post<Product>(`${this.api}/import`, { externalId, estimatedPrice });
  }

  bulkImport(products: { externalId: string; estimatedPrice: number }[]): Observable<any> {
    return this.http.post(`${this.api}/import/bulk`, { products });
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
