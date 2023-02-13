import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    Order,
    OrdersService,
    ORDER_STATUS
} from '@bluebits/orders';
import { MessageService } from 'primeng/api';

import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'admin-orders-detail',
    templateUrl: './orders-detail.component.html',
    styles: []
})
export class OrdersDetailComponent
    implements OnInit, OnDestroy
{
    //
    order: Order;
    orderStatuses = [];
    selectedStatus: any;
    endsubs$: Subject<any> = new Subject<void>();

    constructor(
        private ordersService: OrdersService,
        private messageService: MessageService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this._mapOrderStatus();
        this._getOrder();
    }
    // found error "Expected 1 arguments, but got 0 .next()", just give fake .next(true)
    ngOnDestroy(): void {
        console.log('orders-detail is destroyed');
        this.endsubs$.next(true);
        this.endsubs$.complete(); // this is the way to end subscription
    }

    // update ORDER_STATUS from JSON dictionary to array
    private _mapOrderStatus() {
        this.orderStatuses = Object.keys(ORDER_STATUS).map(
            (key) => {
                // console.log(ORDER_STATUS[key]);
                return {
                    id: key,
                    name: ORDER_STATUS[key].label
                };
            }
        );

        // console.log(Object.keys(ORDER_STATUS));
        console.log(this.orderStatuses);
    }

    private _getOrder() {
        this.route.params.subscribe((params) => {
            if (params['id']) {
                this.ordersService
                    .getOrder(params['id'])
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((order) => {
                        this.order = order;
                        this.selectedStatus = order.status;
                    });
            }
        });
    }

    onStatusChange(event) {
        // console.log(event);
        this.ordersService
            .updateOrder(
                { status: event.value },
                this.order.id
            )
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                () => {
                    // console.log(order);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Order is updated`
                    });
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Order is not updated`
                    });
                }
            );
    }
}
