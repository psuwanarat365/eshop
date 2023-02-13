import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
// import { usersRoutes } from './lib.routes';
import { LoginComponent } from './pages/login/login.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromUsers from './state/users.reducer';
import { UsersEffects } from './state/users.effects';
import { UsersFacade } from './state/users.facade';

const routes: Route[] = [
    {
        path: 'login',
        component: LoginComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        InputTextModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forFeature(
            fromUsers.USERS_FEATURE_KEY,
            fromUsers.reducer
        ),
        EffectsModule.forFeature([UsersEffects])
    ],
    declarations: [LoginComponent],
    providers: [UsersFacade]
})
export class UsersModule {}
