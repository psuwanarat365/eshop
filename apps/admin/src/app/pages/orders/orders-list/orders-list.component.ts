import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import {
    Order,
    OrdersService,
    ORDER_STATUS
} from '@bluebits/orders';
import {
    ConfirmationService,
    MessageService
} from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'admin-orders-list',
    templateUrl: './orders-list.component.html',
    styles: []
})
export class OrdersListComponent
    implements OnInit, OnDestroy
{
    //
    orders: Order[] = [];
    orderStatus = ORDER_STATUS;
    endsubs$: Subject<any> = new Subject<void>();
    //
    constructor(
        private ordersService: OrdersService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this._getOrders();
    }

    // found error "Expected 1 arguments, but got 0 .next()", just give fake .next(true)
    ngOnDestroy(): void {
        // console.log('order-list is destroyed');
        this.endsubs$.next(true);
        this.endsubs$.complete(); // this is the way to end subscription
    }

    private _getOrders() {
        this.ordersService
            .getOrders()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((orders) => {
                this.orders = orders;
                // console.log(this.orders);
            });
    }

    showOrder(orderId) {
        this.router.navigateByUrl(`orders/${orderId}`);
    }

    deleteOrder(orderId: string) {
        this.confirmationService.confirm({
            message: 'Do you want to Delete this Order?',
            header: 'Delete Order',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.ordersService
                    .deleteOrder(orderId)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe(
                        () => {
                            this._getOrders();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Order is deleted!'
                            });
                        },
                        () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Order is not deleted!'
                            });
                        }
                    );
            }
        });
    }
}
