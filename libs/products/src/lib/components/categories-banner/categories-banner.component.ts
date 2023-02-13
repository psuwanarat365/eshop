import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category } from '../../models/category';
import { CategoriesService } from '../../services/categories.service';

@Component({
    selector: 'products-categories-banner',
    templateUrl: './categories-banner.component.html',
    styles: []
})
export class CategoriesBannerComponent
    implements OnInit, OnDestroy
{
    categories: Category[] = [];
    endsubs$: Subject<any> = new Subject<void>();
    //
    constructor(
        private categoriesService: CategoriesService
    ) {}
    //
    ngOnInit(): void {
        this.categoriesService
            .getCategories()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((categories) => {
                // console.log(categories);
                this.categories = categories;
            });
    }
    //
    ngOnDestroy(): void {
        // console.log('categories form is destroyed');
        this.endsubs$.next(true);
        // found error "Expected 1 arguments, but got 0 .next()", just give fake .next(true)
        this.endsubs$.complete(); // this is the way to end subscription
    }
}
