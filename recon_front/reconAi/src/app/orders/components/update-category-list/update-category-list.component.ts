import { CategoryInterface } from './../../constants/types/category';
import { CLOSE_ICON_TOOLTIP_TEXT } from './../../constants/labels/categories';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CategoriesFormInterface } from 'app/store/orders/orders.server.helpers';

@Component({
  selector: 'recon-update-category-list',
  templateUrl: './update-category-list.component.html',
  styleUrls: ['./update-category-list.component.less'],
})
export class UpdateCategoryListComponent implements OnInit {
  @Input() parentCategories: CategoryInterface[] = [];
  @Input() loadingUpdateStatus = false;
  @Output() sendCategories$ = new EventEmitter<CategoriesFormInterface>();
  categoriesForm: FormGroup;
  readonly closeTooltip = CLOSE_ICON_TOOLTIP_TEXT;
  constructor(private fb: FormBuilder) {}

  get categories() {
    return this?.categoriesForm?.get('categories') as FormArray;
  }

  ngOnInit(): void {
    this.categoriesForm = this.fb.group({
      categories: this.fb.array(
        this.parentCategories.map((category: CategoryInterface) =>
          this.fb.group({
            name: [category.name, Validators.required],
            id: [category.id],
            manufacturers_count: [category.manufacturers_count],
          })
        )
      ),
    });
  }

  addCategory(): void {
    this.categories.push(
      this.fb.group({
        name: ['', Validators.required],
      })
    );
  }

  sendCategories(): void {
    console.log(this.categoriesForm.value, 'VALUE');
    this.sendCategories$.emit(this.categoriesForm.value);
  }

  removeCategory(i: number, category: CategoryInterface): void {
    if (!category.manufacturers_count) {
      this.categories.removeAt(i);
    }
  }
}
