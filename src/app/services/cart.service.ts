import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  

  cartItems: CartItem[]=[];
  totalPrice: Subject<number>= new BehaviorSubject<number>(0);
  totalQuantity: Subject<number>= new BehaviorSubject<number>(0);
  constructor() { }

  addToCart(theCartItem:CartItem){
    let alreadyexsitedInCart: boolean=false;
    let exitingCartItem: CartItem= undefined;
    if(this.cartItems.length>0){
      
      exitingCartItem=this.cartItems.find(tempCartItem=>tempCartItem.id===theCartItem.id)
      alreadyexsitedInCart=(exitingCartItem!=null);
    }

    if(alreadyexsitedInCart){
      exitingCartItem.quantity++;
    
    }
    else{
      this.cartItems.push(theCartItem);
    }
    this.computeCartTotals()
  }
  computeCartTotals() {
  let totalPriceValue:number=0;
  let totalQauntityValue:number=0;

  for(let cartItem of this.cartItems){
    totalPriceValue+=cartItem.quantity*cartItem.unitPrice;
    totalQauntityValue+=cartItem.quantity;    
  }
  this.totalPrice.next(totalPriceValue);
  this.totalQuantity.next(totalQauntityValue)
  this.logCart(totalPriceValue,totalQauntityValue)
  }
  logCart(totalPriceValue: number, totalQauntityValue: number) {
   console.log('Current cart');
   this.cartItems.forEach(cart => {
     const subtotalPrice=cart.quantity*cart.unitPrice;
     console.log(`name: ${cart.name}, quantity:${cart.quantity},unitPrice ${cart.unitPrice}, subTotalPrice=${subtotalPrice}`)
   });
   console.log(`totalPrice":${totalPriceValue}, totalQuantity:${totalQauntityValue}`);
  }
  decrement(cartItem: CartItem) {
    cartItem.quantity--;
    if(cartItem.quantity==0){
      this.remove(cartItem);
    }
    else{
      this.computeCartTotals();
    }
  }
  remove(cartItem: CartItem) {
    const itemIndex= this.cartItems.findIndex(tempCartItem=>tempCartItem.id==cartItem.id);
    if(itemIndex>-1){
      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals();
    }
  }

}
