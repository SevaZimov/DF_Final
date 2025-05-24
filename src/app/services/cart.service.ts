import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<number[]>([]);
  currentCartItems = this.cartItems.asObservable();

  addToCart(productId: number) {
    const current = this.cartItems.value;
    this.cartItems.next([...current, productId]);
  }

  removeFromCart(productId: number) {
    const current = this.cartItems.value;
    this.cartItems.next(current.filter(id => id !== productId));
  }

  getCartItems(): number[] {
    return this.cartItems.value;
  }
}