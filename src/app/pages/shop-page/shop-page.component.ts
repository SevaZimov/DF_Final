import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../interfaces/product';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './shop-page.component.html',
  styleUrls: ['./shop-page.component.css']
})
export class ShopPageComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  error: string | null = null;
  private searchSub!: Subscription;
  searchQuery = '';

  constructor(
    private productService: ProductService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.setupSearch();
  }

  ngOnDestroy() {
    this.searchSub.unsubscribe();
  }

  private loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Не удалось загрузить товары';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  private setupSearch() {
    this.searchSub = this.searchService.currentQuery
      .subscribe(query => {
        this.searchQuery = query;
        this.filterProducts();
      });
  }

  private filterProducts() {
    if (!this.searchQuery) {
      this.filteredProducts = [...this.products];
      return;
    }

    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  getProductsByType(type: Product['type']): Product[] {
    return this.filteredProducts.filter(product => product.type === type);
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