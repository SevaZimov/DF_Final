import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../interfaces/product';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';
import { FavoritesService } from '../../services/favorite.service';
import { CartService } from '../../services/cart.service';
import { Params } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';

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
  showOnlyFavorites = false;
  showOnlyCart = false;
  favorites: number[] = [];
  cartItems: number[] = [];
  private favoritesSub!: Subscription;
  private cartSub!: Subscription;

  constructor(
    private productService: ProductService,
    private searchService: SearchService,
    private favoritesService: FavoritesService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.setupSearch();
    this.loadFavorites();
    this.loadCart();
    this.setupRouteParams();
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
    this.favoritesSub?.unsubscribe();
    this.cartSub?.unsubscribe();
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

  private loadFavorites() {
    this.favoritesSub = this.favoritesService.currentFavorites.subscribe(favs => {
      this.favorites = favs;
    });
  }

  private loadCart() {
    this.cartSub = this.cartService.currentCartItems.subscribe(items => {
      this.cartItems = items;
    });
  }

  private setupRouteParams() {
    this.route.queryParams.subscribe((params: Params) => {
      this.showOnlyFavorites = params['favorites'] === 'true';
      this.showOnlyCart = params['cart'] === 'true';
    });
  }

  private filterProducts() {
  this.filteredProducts = [...this.products];
  
  if (this.searchQuery) {
    this.filteredProducts = this.filteredProducts.filter(product =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}

  toggleFavorite(productId: number) {
    this.favoritesService.toggleFavorite(productId);
  }

  toggleCart(productId: number) {
    if (this.isInCart(productId)) {
      this.cartService.removeFromCart(productId);
    } else {
      this.cartService.addToCart(productId);
    }
  }

  isFavorite(productId: number): boolean {
    return this.favorites.includes(productId);
  }

  isInCart(productId: number): boolean {
    return this.cartItems.includes(productId);
  }

  getProductsByType(type: Product['type']): Product[] {
  let products = this.filteredProducts.filter(p => p.type === type);
  if (this.showOnlyFavorites) {
    products = products.filter(p => this.isFavorite(p.id));
  }
  
  if (this.showOnlyCart) {
    products = products.filter(p => this.isInCart(p.id));
  }
  return products;
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
  this.filterProducts();
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
  this.filteredProducts = this.filteredProducts.filter(p => p.id !== id);
  this.filterProducts();
}

  addNewProduct(): void {
  const newId = this.generateUniqueId();
  
  const newProduct: Product = {
    id: newId,
    name: 'Новый товар',
    price: 0,
    isIn: false,
    releaseDate: new Date().toISOString().split('T')[0],
    type: 'keyboard',
    editing: true,
    imageUrl: 'assets/images/placeholder.jpg'
  };
  this.products.unshift(newProduct);
  this.filteredProducts.unshift(newProduct);
  this.filterProducts();
}

private generateUniqueId(): number {
  const maxId = Math.max(...this.products.map(p => p.id), 0);
  return maxId + 1;
}
}