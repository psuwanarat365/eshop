import { Location } from '@angular/common';
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
import { ActivatedRoute } from '@angular/router';
import {
    CategoriesService,
    Category
} from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'admin-categories-form',
    templateUrl: './categories-form.component.html',
    styles: []
})
export class CategoriesFormComponent
    implements OnInit, OnDestroy
{
    form: FormGroup;
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    isSubmited: boolean = false;
    editmode = false;
    currentCategoryId: string;
    endsubs$: Subject<any> = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        private categoriesService: CategoriesService,
        private messageService: MessageService,
        private location: Location,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            icon: ['', Validators.required],
            color: ['#fff']
        });

        this._checkEditMode();
    }

    ngOnDestroy(): void {
        console.log('categories form is destroyed');
        this.endsubs$.next(true);
        // found error "Expected 1 arguments, but got 0 .next()", just give fake .next(true)
        this.endsubs$.complete(); // this is the way to end subscription
    }
    onSubmit() {
        this.isSubmited = true;
        if (this.form.invalid) {
            return;
        }

        const category: Category = {
            id: this.currentCategoryId,
            name: this.categoryForm['name'].value,
            icon: this.categoryForm['icon'].value,
            color: this.categoryForm['color'].value
        };

        if (this.editmode) {
            this._updateCategory(category);
        } else {
            this._addCategory(category);
        }
    }

    onCancel() {
        this.location.back();
    }

    private _addCategory(category: Category) {
        this.categoriesService
            .createCategory(category)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (category: Category) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Category ${category.name} is created`
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
                        detail: 'Category is not created'
                    });
                }
            );
    }

    private _updateCategory(category: Category) {
        this.categoriesService
            .updateCategory(category)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Category is updated`
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
                        detail: 'Category is not updated'
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
                    this.currentCategoryId = params['id'];
                    this.categoriesService
                        .getCategory(params['id'])
                        .pipe(takeUntil(this.endsubs$))
                        .subscribe((category) => {
                            this.categoryForm[
                                'name'
                            ].setValue(category.name);
                            this.categoryForm[
                                'icon'
                            ].setValue(category.icon);
                            this.categoryForm[
                                'color'
                            ].setValue(category.color);
                        });
                }
            });
    }

    get categoryForm() {
        return this.form.controls;
    }
}
