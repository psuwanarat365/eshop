import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'orders-cart-icon',
    templateUrl: './cart-icon.component.html',
    styles: []
})
export class CartIconComponent implements OnInit {
    //
    cartCount = 0;
    constructor(private cartService: CartService) {}
    //
    ngOnInit(): void {
        // Observable if cart has changed
        this.cartService.cart$.subscribe((cart) => {
            // console.log(cart);
            // explain: if cart then do items.length otherwhile(??) return 0
            this.cartCount = cart?.items?.length ?? 0;
        });
        // this.cartCount =
        //     this.cartService.getCart().items.length;
    }
}
