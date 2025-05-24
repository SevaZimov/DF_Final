import { Component } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorite.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
  searchQuery = '';

  constructor(
    private searchService: SearchService,
    private favoritesService: FavoritesService,
    private cartService: CartService,
    private router: Router) { }


  goToHomePage(): void {
    this.router.navigate(['/shop'], {
      queryParams: {
        favorites: null,
        cart: null,
        search: null
      },
      queryParamsHandling: 'merge'
    });
    this.searchQuery = '';
    this.onSearch();
  }

isHomeActive(): boolean {
  return this.router.url === '/shop' && 
         !this.router.url.includes('favorites') && 
         !this.router.url.includes('cart') && 
         !this.router.url.includes('search');
}

  onSearch() {
    this.searchService.updateQuery(this.searchQuery);
  }

  toggleFavorites(): void {
    this.router.navigate([], {
      queryParams: { favorites: true, cart: null },
      queryParamsHandling: 'merge'
    });
  }

  toggleCart(): void {
    this.router.navigate([], {
      queryParams: { cart: true, favorites: null },
      queryParamsHandling: 'merge'
    });
  }

  clearFilters(): void {
    this.router.navigate([], {
      queryParams: { favorites: null, cart: null },
      queryParamsHandling: 'merge'
    });
  }

  get favoritesCount(): number {
    return this.favoritesService.getFavorites().length;
  }

  get cartItemsCount(): number {
    return this.cartService.getCartItems().length;
  }
  isFavoritesActive(): boolean {
  return this.router.url.includes('favorites=true');
}

isCartActive(): boolean {
  return this.router.url.includes('cart=true');
}

}