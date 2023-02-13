import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';
import { OrdersService } from '@bluebits/orders';
import { ProductsService } from '@bluebits/products';
import { UsersService } from '@bluebits/users';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'admin-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent
    implements OnInit, OnDestroy
{
    //
    statistics = [];
    endsubs$: Subject<any> = new Subject<void>();
    //
    constructor(
        private userService: UsersService,
        private productService: ProductsService,
        private ordersService: OrdersService
    ) {}
    //

    ngOnInit(): void {
        combineLatest([
            this.ordersService.getOrdersCount(),
            this.productService.getProductsCount(),
            this.userService.getUsersCount(),
            this.ordersService.getTotalSales()
        ])
            .pipe(takeUntil(this.endsubs$))
            .subscribe((values) => {
                this.statistics = values;
            });
    }
    // found error "Expected 1 arguments, but got 0 .next()", just give fake .next(true)
    ngOnDestroy(): void {
        // console.log('dashboard is destroyed');
        this.endsubs$.next(true);
        this.endsubs$.complete(); // this is the way to end subscription
    }
}
