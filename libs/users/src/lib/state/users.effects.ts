import { Injectable } from '@angular/core';
import {
    createEffect,
    Actions,
    ofType
} from '@ngrx/effects';

import * as UsersFeature from './users.reducer';
import * as UsersActions from './users.actions';

import { catchError, concatMap, map } from 'rxjs/operators';
import { LocalstorageService } from '../services/localstorage.service';
import { of } from 'rxjs';
import { UsersService } from '../services/users.service';

// https://v7.ngrx.io/guide/effects

@Injectable()
export class UsersEffects {
    buildUserSession$ = createEffect(() =>
        this.action$.pipe(
            ofType(UsersActions.buildUserSession),
            concatMap(() => {
                if (
                    this.localstorageService.isValidToken()
                ) {
                    const userId =
                        this.localstorageService.getUserIdFromToken();
                    if (userId) {
                        // เพราะ getUser จะได้ observable จึงต้องแปลง pipe(map) ไปเป็น prop ({user: user})
                        return this.usersService
                            .getUser(userId)
                            .pipe(
                                map((user) => {
                                    return UsersActions.buildUserSessionSuccess(
                                        { user: user }
                                    );
                                }),
                                catchError(() =>
                                    of(
                                        UsersActions.buildUserSessionFailed()
                                    )
                                )
                            );
                    } else {
                        return of(
                            UsersActions.buildUserSessionFailed()
                        );
                    }
                } else {
                    return of(
                        UsersActions.buildUserSessionFailed()
                    );
                }
            })
        )
    );

    constructor(
        private action$: Actions,
        private localstorageService: LocalstorageService,
        private usersService: UsersService
    ) {}
}
