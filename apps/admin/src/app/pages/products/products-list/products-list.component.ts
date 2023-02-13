import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '@bluebits/products';
import {
    ConfirmationService,
    MessageService
} from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'admin-products-list',
    templateUrl: './products-list.component.html',
    styles: []
})
export class ProductsListComponent
    implements OnInit, OnDestroy
{
    products = [];
    endsubs$: Subject<any> = new Subject<void>();

    constructor(
        private productsService: ProductsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this._getProducts();
    }
    // found error "Expected 1 arguments, but got 0 .next()", just give fake .next(true)
    ngOnDestroy(): void {
        // console.log('productlist is destroyed');
        this.endsubs$.next(true);
        this.endsubs$.complete(); // this is the way to end subscription
    }
    //
    private _getProducts() {
        this.productsService
            .getProducts()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((products) => {
                this.products = products;
            });
    }
    //
    updateProduct(productid: string) {
        this.router.navigateByUrl(
            `products/form/${productid}`
        );
    }

    deleteProduct(productId: string) {
        this.confirmationService.confirm({
            message: 'Do you want to Delete this Product?',
            header: 'Delete Product',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.productsService
                    .deleteProduct(productId)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe(
                        () => {
                            this._getProducts();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Product is deleted'
                            });
                        },
                        () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Product is not deleted'
                            });
                        }
                    );
            }
            // reject: () => {}
        });
    }
}
