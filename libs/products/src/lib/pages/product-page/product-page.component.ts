import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem, CartService } from '@bluebits/orders';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';

@Component({
    selector: 'products-product-page',
    templateUrl: './product-page.component.html',
    styles: []
})
export class ProductPageComponent
    implements OnInit, OnDestroy
{
    //
    product: Product;
    endsubs$: Subject<any> = new Subject();
    quantity = 1;
    //
    constructor(
        private prodService: ProductsService,
        private route: ActivatedRoute,
        private cartService: CartService,
        private messageService: MessageService
    ) {}
    //
    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            if (params['productid']) {
                this._getProduct(params['productid']);
            }
        });
    }
    //
    ngOnDestroy(): void {
        // console.log('categories form is destroyed');
        this.endsubs$.next(true);
        // found error "Expected 1 arguments, but got 0 .next()", just give fake .next(true)
        this.endsubs$.complete(); // this is the way to end subscription
    }

    addProductToCart() {
        const cartItem: CartItem = {
            productId: this.product.id,
            quantity: this.quantity
        };

        this.cartService.setCartItem(cartItem);
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Add to Cart Success`
        });
    }

    private _getProduct(id: string) {
        this.prodService
            .getProduct(id)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((resProduct) => {
                this.product = resProduct;
            });
    }
}
