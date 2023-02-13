import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// import { ordersRoutes } from './lib.routes';
import { CartService } from './services/cart.service';
import { CartIconComponent } from './components/cart-icon/cart-icon.component';
import { BadgeModule } from 'primeng/badge';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { ToastModule } from 'primeng/toast';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { AuthGuard } from '@bluebits/users';

const routes: Routes = [
    {
        path: 'cart',
        component: CartPageComponent
    },
    {
        path: 'checkout',
        canActivate: [AuthGuard],
        component: CheckoutPageComponent
    },
    {
        path: 'success',
        component: ThankYouComponent
    }
];

@NgModule({
    imports: [
        InputNumberModule,
        ButtonModule,
        CommonModule,
        BadgeModule,
        RouterModule.forChild(routes),
        FormsModule,
        DropdownModule,
        ReactiveFormsModule,
        InputTextModule,
        InputMaskModule,
        InputTextareaModule,
        InputSwitchModule,
        ToastModule
    ],
    declarations: [
        CartIconComponent,
        CartPageComponent,
        OrderSummaryComponent,
        CheckoutPageComponent,
        ThankYouComponent
    ],
    exports: [
        CartIconComponent,
        CartPageComponent,
        OrderSummaryComponent
    ]
})
export class OrdersModule {
    constructor(cartService: CartService) {
        cartService.initCartLocalStorage();
    }
}
