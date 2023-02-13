import { Component } from '@angular/core';
import { AuthService } from '@bluebits/users';

@Component({
    selector: 'admin-sidebar',
    templateUrl: './sidebar.component.html',
    styles: []
})
export class SidebarComponent {
    constructor(private authService: AuthService) {}

    logoutUser() {
        this.authService.logout();
    }
}
