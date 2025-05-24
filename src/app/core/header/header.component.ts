import { Component } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isFavorite = false;
  cartItemsCount = 0;
  logoContent = `<svg width="227" height="226" viewBox="0 0 227 226" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.817383 122.437L113.676 150.543L226.535 122.437V194.112L113.676 225.717L0.817383 194.112V122.437Z" fill="#D1DEED"/>
<path d="M226.535 103.28L113.676 75.1744L0.817429 103.28V31.6049L113.676 7.62939e-06L226.535 31.6049V103.28Z" fill="#D1DEED"/>
<path d="M226.535 122.624L103.915 77.4601L0.817383 103.094L123.437 148.257L226.535 122.624Z" fill="#91A8D3"/>
</svg>`
  searchQuery = '';

  constructor(private searchService: SearchService) {}

  onSearch() {
    this.searchService.updateQuery(this.searchQuery);
  }

  // Избранное
  toggleFavorites() {
    this.isFavorite = !this.isFavorite;
  }

  // Корзина
  openCart() {
    console.log('Открыть корзину');
    // Переход на страницу корзины или открытие модального окна
  }
}