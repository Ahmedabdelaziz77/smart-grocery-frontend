export interface ShoppingListItem {
  id: number;

  productId: number;
  productName: string;
  brand: string;
  category: string;

  imageUrl: string;
  estimatedPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface ShoppingList {
  id: number;

  name: string;
  items: ShoppingListItem[];
  totalEstimatedPrice: number;
}

export interface AddShoppingListItemRequest {
  productId: number;

  quantity: number;
}

export interface UpdateShoppingListItemRequest {
  quantity: number;
}
