import { Location } from '@angular/common';
import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
    CategoriesService,
    Product,
    ProductsService
} from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'admin-products-form',
    templateUrl: './products-form.component.html',
    styles: []
})
export class ProductsFormComponent
    implements OnInit, OnDestroy
{
    editmode = false;
    form: FormGroup;
    isSubmited = false;
    categories = [];
    imageDisplay: string | ArrayBuffer;
    currentProductId: string;
    endsubs$: Subject<any> = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        private categoriesService: CategoriesService,
        private location: Location,
        private productsService: ProductsService,
        private messageService: MessageService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this._initForm();
        this._getCategories();
        this._checkEditMode();
    }

    // found error "Expected 1 arguments, but got 0 .next()", just give fake .next(true)
    ngOnDestroy(): void {
        // console.log('productform is destroyed');
        this.endsubs$.next(true);
        this.endsubs$.complete(); // this is the way to end subscription
    }

    private _initForm() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            brand: ['', Validators.required],
            price: ['', Validators.required],
            category: ['', Validators.required],
            countInStock: ['', Validators.required],
            description: ['', Validators.required],
            richDescription: [''],
            image: ['', Validators.required],
            isFeatured: [false]
        });
    }

    private _getCategories() {
        this.categoriesService
            .getCategories()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((categories) => {
                this.categories = categories;
            });
    }

    private _addProduct(productData: FormData) {
        this.productsService
            .createProduct(productData)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (product: Product) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Product ${product.name} is created`
                    });
                    timer(2000)
                        .toPromise()
                        .then(() => {
                            this.location.back();
                        });
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Product is not created'
                    });
                }
            );
    }

    private _updateProduct(productFormData: FormData) {
        this.productsService
            .updateProduct(
                productFormData,
                this.currentProductId
            )
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Product is updated`
                    });
                    timer(2000)
                        .toPromise()
                        .then(() => {
                            this.location.back();
                        });
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Product is not updated'
                    });
                }
            );
    }

    private _checkEditMode() {
        this.route.params
            .pipe(takeUntil(this.endsubs$))
            .subscribe((params) => {
                if (params['id']) {
                    this.editmode = true;
                    this.currentProductId = params['id'];
                    this.productsService
                        .getProduct(params['id'])
                        .pipe(takeUntil(this.endsubs$))
                        .subscribe((product) => {
                            this.productForm[
                                'name'
                            ].setValue(product.name);
                            this.productForm[
                                'category'
                            ].setValue(product.category.id);
                            this.productForm[
                                'brand'
                            ].setValue(product.brand);
                            this.productForm[
                                'price'
                            ].setValue(product.price);
                            this.productForm[
                                'countInStock'
                            ].setValue(
                                product.countInStock
                            );
                            this.productForm[
                                'isFeatured'
                            ].setValue(product.isFeatured);
                            this.productForm[
                                'description'
                            ].setValue(product.description);
                            this.productForm[
                                'richDescription'
                            ].setValue(
                                product.richDescription
                            );
                            this.imageDisplay =
                                product.image;
                            this.productForm[
                                'image'
                            ].setValidators([]);
                            this.productForm[
                                'image'
                            ].updateValueAndValidity();
                        });
                }
            });
    }

    onSubmit() {
        this.isSubmited = true;
        if (this.form.invalid) {
            return;
        }

        // add product as formData, not as json type
        const productFormData = new FormData();

        Object.keys(this.productForm).map((key) => {
            // console.log(key);
            // console.log(this.productForm[key].value);
            // productFormData.append('name', this.productForm['name'].value) // this like hardcode
            productFormData.append(
                key,
                this.productForm[key].value
            ); // better do as loop to form.
        });
        //
        if (this.editmode) {
            this._updateProduct(productFormData);
        } else {
            this._addProduct(productFormData);
        }
    }

    onCancel() {
        this.location.back();
    }

    onImageUpload(event) {
        // console.log(event);
        const file = event.target.files[0];
        if (file) {
            this.form.patchValue({ image: file });
            this.form.get('image').updateValueAndValidity();
            const fileReader = new FileReader();
            // .onload is event before reading file
            fileReader.onload = () => {
                this.imageDisplay = fileReader.result;
            };
            fileReader.readAsDataURL(file);
        }
    }

    get productForm() {
        return this.form.controls;
    }
}
