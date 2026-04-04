import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface ImportDialogData {
  products: { externalId: string; name: string; imageUrl: string }[];
}

export interface ImportDialogResult {
  products: { externalId: string; estimatedPrice: number }[];
}

@Component({
  selector: 'app-import-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Set Prices to Import</h2>

    <mat-dialog-content>
      <div class="product-list">
        @for (item of items; track item.externalId) {
        <div class="product-row">
          <div class="product-row__image">
            <img [src]="item.imageUrl" [alt]="item.name" />
          </div>
          <div class="product-row__name">{{ item.name }}</div>
          <mat-form-field appearance="outline" class="price-input">
            <mat-label>Price ($)</mat-label>
            <input matInput type="number" min="0.01" step="0.01"
                   [(ngModel)]="item.price" placeholder="0.00" />
          </mat-form-field>
        </div>
        }
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button class="confirm-btn" (click)="onConfirm()" [disabled]="!allPricesValid()">
        Import {{ items.length === 1 ? 'Product' : items.length + ' Products' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .product-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
      min-width: 420px;
      max-height: 400px;
      overflow-y: auto;
    }

    .product-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .product-row__image {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      overflow: hidden;
      background: #f3f4f6;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .product-row__name {
      flex: 1;
      font-weight: 600;
      font-size: 14px;
      color: #111827;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .price-input {
      width: 120px;
      flex-shrink: 0;

      ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }
    }

    .confirm-btn {
      background: #22c55e !important;
      color: #fff !important;
    }
  `]
})
export class ImportDialog {
  private readonly dialogRef = inject(MatDialogRef<ImportDialog>);
  private readonly data: ImportDialogData = inject(MAT_DIALOG_DATA);

  items = this.data.products.map((p) => ({
    ...p,
    price: 0
  }));

  allPricesValid(): boolean {
    return this.items.every((item) => item.price > 0);
  }

  onConfirm(): void {
    if (!this.allPricesValid()) return;

    const result: ImportDialogResult = {
      products: this.items.map((item) => ({
        externalId: item.externalId,
        estimatedPrice: item.price
      }))
    };

    this.dialogRef.close(result);
  }
}
