import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../models/category';
import { Product } from '../../models/product';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';
import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'products-list',
    templateUrl: './products-list.component.html',
    styles: []
})
export class ProductsListComponent implements OnInit {
    // variable declaration
    products: Product[] = [];
    categories: Category[] = [];
    isCategoryPage: boolean;
    endsubs$: Subject<any> = new Subject<void>();
    //
    constructor(
        private prodService: ProductsService,
        private catService: CategoriesService,
        private route: ActivatedRoute
    ) {}
    //
    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            // inline if-else
            params['categoryid']
                ? this._getProducts([params['categoryid']])
                : this._getProducts();
            // inline if-else
            params['categoryid']
                ? (this.isCategoryPage = true)
                : (this.isCategoryPage = false);
        });
        // this._getProducts();
        this._getCategories();
    }
    //
    private _getProducts(categoryFilter?: string[]) {
        this.prodService
            .getProducts(categoryFilter)
            .subscribe((resProducts) => {
                this.products = resProducts;
            });
    }

    private _getCategories() {
        this.catService
            .getCategories()
            .subscribe((resCats) => {
                this.categories = resCats;
            });
    }

    categoriesFilter() {
        // console.log(this.categories);
        const selectedCategories = this.categories
            .filter((category) => category.checked)
            .map((category) => category.id);
        // console.log(selectedCategories);
        this._getProducts(selectedCategories);
    }
}

// ngOnDestroy(): void {
//     // console.log('featured-products form is destroyed');
//     this.endsubs$.next(true);
//     // found error "Expected 1 arguments, but got 0 .next()", just give fake .next(true)
//     this.endsubs$.complete(); // this is the way to end subscription
// }

// private _getProducts(categoryFilter?: string[]) {
//     this.prodService
//         .getProducts(categoryFilter)
//         .pipe(takeUntil(this.endsubs$))
//         .subscribe((resProducts) => {
//             this.products = resProducts;
//         });
// }

// private _getCategories() {
//     this.catService
//         .getCategories()
//         .pipe(takeUntil(this.endsubs$))
//         .subscribe((resCats) => {
//             this.categories = resCats;
//         });
// }
