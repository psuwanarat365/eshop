import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@bluebits/users';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Cart } from '../../models/cart';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { StripeService } from 'ngx-stripe';

@Component({
    selector: 'orders-checkout-page',
    templateUrl: './checkout-page.component.html'
})
export class CheckoutPageComponent
    implements OnInit, OnDestroy
{
    constructor(
        private router: Router,
        private usersService: UsersService,
        private formBuilder: FormBuilder,
        private cartService: CartService,
        private ordersService: OrdersService,
        private stripeService: StripeService
    ) {}
    //
    checkoutFormGroup: FormGroup;
    isSubmitted = false;
    orderItems: OrderItem[] = [];
    userId: string;
    countries = [];
    unsubscribe$: Subject<any> = new Subject();
    //

    //
    ngOnInit(): void {
        this._initCheckoutForm();
        this._autoFillUserData();
        this._getCartItems();
        this._getCountries();
    }

    ngOnDestroy() {
        this.unsubscribe$.next(true);
        this.unsubscribe$.complete();
    }

    private _initCheckoutForm() {
        this.checkoutFormGroup = this.formBuilder.group({
            name: ['', Validators.required],
            email: [
                '',
                [Validators.email, Validators.required]
            ],
            phone: ['', Validators.required],
            city: ['', Validators.required],
            country: ['', Validators.required],
            zip: ['', Validators.required],
            apartment: ['', Validators.required],
            street: ['', Validators.required]
        });
    }

    private _autoFillUserData() {
        this.usersService
            .observeCurrentUser()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((user) => {
                if (user) {
                    this.userId = user.id;
                    this.checkoutForm['name'].setValue(
                        user.name
                    );
                    this.checkoutForm['email'].setValue(
                        user.email
                    );
                    this.checkoutForm['phone'].setValue(
                        user.phone
                    );
                    this.checkoutForm['city'].setValue(
                        user.city
                    );
                    this.checkoutForm['street'].setValue(
                        user.street
                    );
                    this.checkoutForm['country'].setValue(
                        user.country
                    );
                    this.checkoutForm['zip'].setValue(
                        user.zip
                    );
                    this.checkoutForm['apartment'].setValue(
                        user.apartment
                    );
                }
            });
    }

    private _getCartItems() {
        const cart: Cart = this.cartService.getCart();

        this.orderItems = cart.items.map((item) => {
            return {
                product: item.productId,
                quantity: item.quantity
            };
        });

        // console.log(this.orderItems);
    }

    private _getCountries() {
        this.countries = this.usersService.getCountries();
    }

    backToCart() {
        this.router.navigate(['/cart']);
    }

    placeOrder() {
        this.isSubmitted = true;
        if (this.checkoutFormGroup.invalid) {
            return;
        }

        const order: Order = {
            // copy these field from models/order.ts

            orderItems: this.orderItems,
            shippingAddress1:
                this.checkoutForm['street'].value,
            shippingAddress2:
                this.checkoutForm['apartment'].value,
            city: this.checkoutForm['city'].value,
            zip: this.checkoutForm['zip'].value,
            country: this.checkoutForm['country'].value,
            phone: this.checkoutForm['phone'].value,
            // status: Object.keys(ORDER_STATUS)[0] ,
            status: 0,
            user: this.userId,
            dateOrdered: `${Date.now()}`
            // we don't need to send totalPrice from frontend
            //because it is dangerous, hacker can generate feak
            // price and POST from frontend to our backend
            // totalPrice:
            //     this.checkoutForm['totalPrice'].value,
        };

        this.ordersService.cacheOrderData(order);

        // not very good to have subscribe under subscribe
        // it better to do something before return type of id
        // on orders.service.ts > createCheckoutSession using pipe()
        this.ordersService
            .createCheckoutSession(this.orderItems)
            .subscribe((error) => {
                if (error) {
                    console.log(
                        'error in redirect to payment'
                    );
                }
            });
    }

    get checkoutForm() {
        return this.checkoutFormGroup.controls;
    }
}
