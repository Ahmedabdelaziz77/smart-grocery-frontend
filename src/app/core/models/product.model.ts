export interface Product {
  id: number;
  externalId: string;
  name: string;
  brand: string;
  category: string;
  description: string | null;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  estimatedPrice: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
