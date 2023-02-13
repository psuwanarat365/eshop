import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import {
    CategoriesService,
    Category
} from '@bluebits/products';
import {
    ConfirmationService,
    MessageService
} from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'admin-categories-list',
    templateUrl: './categories-list.component.html',
    styles: []
})
export class CategoriesListComponent
    implements OnInit, OnDestroy
{
    //
    categories: Category[] = [];
    endsubs$: Subject<any> = new Subject<void>();

    constructor(
        private categoriesService: CategoriesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnInit(): void {
        this._getCategories();
    }
    // found error "Expected 1 arguments, but got 0 .next()", just give fake .next(true)
    ngOnDestroy(): void {
        // console.log('categories is destroyed');
        this.endsubs$.next(true);
        this.endsubs$.complete(); // this is the way to end subscription
    }

    deleteCategory(categoryId: string) {
        this.confirmationService.confirm({
            message: 'Do you want to Delete this Category?',
            header: 'Delete Category',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.categoriesService
                    .deleteCategory(categoryId)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe(
                        () => {
                            this._getCategories();
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Category is deleted'
                            });
                        },
                        () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Category is not deleted'
                            });
                        }
                    );
            }
            // reject: () => {}
        });
    }

    updateCategory(categoryid: string) {
        this.router.navigateByUrl(
            `categories/form/${categoryid}`
        );
    }

    private _getCategories() {
        this.categoriesService
            .getCategories()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((cats) => {
                this.categories = cats;
            });
    }
}