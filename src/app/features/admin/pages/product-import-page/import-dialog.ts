import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

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
    MatDialogModule
  ],
  template: `
    <div class="dialog-shell">
      <div class="dialog-header">
        <div class="dialog-header__icon">
          <span class="material-icons">sell</span>
        </div>
        <div>
          <h2 class="dialog-title">Set Prices</h2>
          <p class="dialog-subtitle">
            {{ items.length === 1 ? 'Set a price before importing' : 'Set prices for ' + items.length + ' products' }}
          </p>
        </div>
      </div>

      <div class="dialog-body">
        @for (item of items; track item.externalId) {
        <div class="product-row">
          <div class="product-row__image">
            <img [src]="item.imageUrl" [alt]="item.name" />
          </div>

          <div class="product-row__info">
            <div class="product-row__name">{{ item.name }}</div>
          </div>

          <div class="price-field">
            <span class="price-field__prefix">$</span>
            <input
              class="price-field__input"
              type="number"
              min="0.01"
              step="0.01"
              [(ngModel)]="item.price"
              placeholder="0.00" />
          </div>
        </div>
        }
      </div>

      <div class="dialog-footer">
        <button class="cancel-btn" type="button" mat-dialog-close>Cancel</button>
        <button class="confirm-btn" type="button" (click)="onConfirm()" [disabled]="!allPricesValid()">
          <span class="material-icons confirm-btn__icon">file_download</span>
          Import {{ items.length === 1 ? 'Product' : items.length + ' Products' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-shell {
      padding: 24px;
      min-width: 460px;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 24px;
    }

    .dialog-header__icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      display: grid;
      place-items: center;
      flex-shrink: 0;

      .material-icons {
        font-size: 22px;
        color: #16a34a;
      }
    }

    .dialog-title {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.3px;
    }

    .dialog-subtitle {
      margin: 2px 0 0;
      font-size: 13px;
      color: #94a3b8;
    }

    .dialog-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 360px;
      overflow-y: auto;
      padding-right: 4px;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background: #e2e8f0;
      }
    }

    .product-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid #f1f5f9;
      background: #f8fafc;
      transition: border-color 0.15s ease;

      &:hover {
        border-color: #e2e8f0;
      }
    }

    .product-row__image {
      width: 42px;
      height: 42px;
      border-radius: 8px;
      overflow: hidden;
      background: #fff;
      border: 1px solid #e2e8f0;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }

    .product-row__info {
      flex: 1;
      min-width: 0;
    }

    .product-row__name {
      font-weight: 600;
      font-size: 13px;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .price-field {
      display: flex;
      align-items: center;
      width: 100px;
      height: 36px;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      background: #fff;
      overflow: hidden;
      flex-shrink: 0;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;

      &:focus-within {
        border-color: #22c55e;
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
      }
    }

    .price-field__prefix {
      padding: 0 0 0 10px;
      font-size: 14px;
      font-weight: 600;
      color: #94a3b8;
    }

    .price-field__input {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      padding: 0 8px;
      font-size: 14px;
      font-weight: 600;
      color: #0f172a;
      background: transparent;

      &::placeholder {
        color: #cbd5e1;
        font-weight: 400;
      }

      /* hide number spinner */
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      -moz-appearance: textfield;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 24px;
      padding-top: 18px;
      border-top: 1px solid #f1f5f9;
    }

    .cancel-btn {
      height: 40px;
      padding: 0 20px;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      background: #fff;
      color: #64748b;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        border-color: #cbd5e1;
        background: #f8fafc;
      }
    }

    .confirm-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      height: 40px;
      padding: 0 22px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease;

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.35);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .confirm-btn__icon {
      font-size: 17px;
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
