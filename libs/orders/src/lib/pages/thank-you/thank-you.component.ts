import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
    selector: 'orders-thank-you-page',
    templateUrl: './thank-you.component.html',
    styles: []
})
export class ThankYouComponent implements OnInit {
    constructor(
        private orderService: OrdersService,
        private cartService: CartService
    ) {}

    ngOnInit() {
        const orderData =
            this.orderService.getCacheOrderData();
        // console.log(orderData);
        this.orderService
            .createOrder(orderData)
            .subscribe(() => {
                this.cartService.emptyCart();
                this.orderService.removeCacheOrderData();
            });
    }
}

// this.ordersService.createOrder(order).subscribe(
//   () => {
//       // redirect to thank you page // payment
//       // console.log('succesfully added');
//       this.cartService.emptyCart();
//       this.router.navigate(['/success']);
//   },
//   () => {
//       //display some message to user
//   }
// );
