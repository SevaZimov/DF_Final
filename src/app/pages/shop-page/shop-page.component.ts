import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../interfaces/product';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './shop-page.component.html',
  styleUrls: ['./shop-page.component.css']
})
export class ShopPageComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Не удалось загрузить товары';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  getProductsByType(type: Product['type']) {
    return this.products.filter(product => product.type === type);
  }

  getAvailabilityStatus(product: Product) {
    return product.isIn ? 'В наличии' : 'Нет в наличии';
  }

  startEditing(product: Product): void {
    product.editing = true;
    product.originalData = { ...product };
  }

  saveChanges(product: Product): void {
    product.editing = false;
    delete product.originalData;
  }

  cancelEditing(product: Product): void {
    if (product.originalData) {
      Object.assign(product, product.originalData);
    }
    product.editing = false;
    delete product.originalData;
  }

  deleteProduct(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
  }
  addNewProduct(): void {
  const newProduct: Product = {
    id: Math.max(...this.products.map(p => p.id), 0) + 1,
    name: 'Новый товар',
    price: 0,
    isIn: false,
    releaseDate: new Date().toISOString().split('T')[0],
    type: 'keyboard',
    editing: true
  };
  this.products.unshift(newProduct);
}
}