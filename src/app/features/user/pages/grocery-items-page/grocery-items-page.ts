import { Component, signal } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-grocery-items-page',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './grocery-items-page.html',
  styleUrl: './grocery-items-page.scss',
})
export class GroceryItemsPage {
  readonly searchTerm = signal('');
  readonly selectedCategory = signal('');

  readonly categories = [
    'Vegetables',
    'Fruits',
    'Dairy',
    'Bakery',
    'Snacks'
  ];

  readonly products: Product[] = [
    {
      id: 1,
      name: 'Organic Bananas',
      brand: 'Fresh Farm',
      category: 'Fruits',
      description: 'Sweet organic bananas rich in potassium.',
      imageUrl: 'https://via.placeholder.com/300x200?text=Bananas',
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      estimatedPrice: 2.99
    }
  ];
}
