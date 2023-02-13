import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { User, UsersService } from '@bluebits/users';
import {
    ConfirmationService,
    MessageService
} from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'admin-users-list',
    templateUrl: './users-list.component.html',
    styles: []
})
export class UsersListComponent
    implements OnInit, OnDestroy
{
    //
    users: User[] = [];
    endsubs$: Subject<any> = new Subject<void>();
    //
    constructor(
        private usersService: UsersService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this._getUsers();
    }
    // found error "Expected 1 arguments, but got 0 .next()", just give fake .next(true)
    ngOnDestroy(): void {
        // console.log('userslist is destroyed');
        this.endsubs$.next(true);
        this.endsubs$.complete(); // this is the way to end subscription
    }
    deleteUser(userId: string) {
        this.confirmationService.confirm({
            message: 'Do you want to Delete this User?',
            header: 'Delete User',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.usersService
                    .deleteUser(userId)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe(
                        () => {
                            this._getUsers(); //refresh user list after delete a user
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'User is deleted'
                            });
                        },
                        () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'User is not deleted'
                            });
                        }
                    );
            },
            reject: () => {}
        });
    }

    updateUser(userid: string) {
        this.router.navigateByUrl(`users/form/${userid}`);
    }

    getCountryName(countryKey: string) {
        if (countryKey) {
            return this.usersService.getCountry(countryKey);
        }
    }

    private _getUsers() {
        this.usersService
            .getUsers()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((users) => {
                this.users = users;
            });
    }
}
