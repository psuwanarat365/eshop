import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { CartItemDetailed } from '../../models/cart';
import { OrdersService } from '../../services/orders.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'orders-cart-page',
    templateUrl: './cart-page.component.html',
    styles: []
})
export class CartPageComponent
    implements OnInit, OnDestroy
{
    //
    cartItemsDetailed: CartItemDetailed[] = [];
    cartCount = 0;
    endSubs$: Subject<any> = new Subject();

    constructor(
        private router: Router,
        private cartService: CartService,
        private ordersService: OrdersService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this._getCartDetails();
    }

    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _getCartDetails() {
        this.cartService.cart$
            .pipe(takeUntil(this.endSubs$))
            .subscribe((respCart) => {
                this.cartItemsDetailed = [];
                this.cartCount =
                    respCart?.items.length ?? 0;
                respCart.items.forEach((cartItem) => {
                    // console.log(cartItem);
                    this.ordersService
                        .getProduct(cartItem.productId)
                        .subscribe((respProduct) => {
                            // console.log(products);
                            this.cartItemsDetailed.push({
                                product: respProduct,
                                quantity: cartItem.quantity
                            });
                        });
                });
            });
    }

    backToShop() {
        this.router.navigate(['/products']);
    }

    deleteCartItem(cartItem: CartItemDetailed) {
        this.cartService.deleteCartItem(
            cartItem.product.id
        );
        this.messageService.add({
            severity: 'error',
            summary: '',
            detail: `Delete item success!`
        });
    }

    updateCartItemQuantity(
        event,
        cartItem: CartItemDetailed
    ) {
        // console.log(event.value);
        this.cartService.setCartItem(
            {
                productId: cartItem.product.id,
                quantity: event.value
            },
            true
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Update item success!`
        });
    }
}
