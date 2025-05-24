import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites = new BehaviorSubject<number[]>([]);
  currentFavorites = this.favorites.asObservable();

  toggleFavorite(productId: number) {
    const current = this.favorites.value;
    if (current.includes(productId)) {
      this.favorites.next(current.filter(id => id !== productId));
    } else {
      this.favorites.next([...current, productId]);
    }
  }

  getFavorites(): number[] {
    return this.favorites.value;
  }
}