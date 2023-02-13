import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';

@Component({
    selector: 'products-featured-product',
    templateUrl: './featured-products.component.html',
    styles: []
})
export class FeaturedProductsComponent
    implements OnInit, OnDestroy
{
    featuredProducts: Product[] = [];
    endsubs$: Subject<any> = new Subject<void>();

    constructor(private prodService: ProductsService) {}
    //
    ngOnInit(): void {
        this._getFeaturedProducts();
    }
    //
    ngOnDestroy(): void {
        // console.log('featured-products form is destroyed');
        this.endsubs$.next(true);
        // found error "Expected 1 arguments, but got 0 .next()", just give fake .next(true)
        this.endsubs$.complete(); // this is the way to end subscription
    }

    private _getFeaturedProducts() {
        this.prodService
            .getFeaturedProducts(4)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((products) => {
                this.featuredProducts = products;
            });
    }
}
