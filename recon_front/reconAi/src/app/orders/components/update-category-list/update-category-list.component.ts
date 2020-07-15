import { CategoryInterface } from './../../constants/types/category';
import { CLOSE_ICON_TOOLTIP_TEXT } from './../../constants/labels/categories';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CategoriesFormInterface } from 'app/store/orders/orders.server.helpers';

@Component({
  selector: 'recon-update-category-list',
  templateUrl: './update-category-list.component.html',
  styleUrls: ['./update-category-list.component.less'],
})
export class UpdateCategoryListComponent implements OnInit {
  @Input() parentCategories: string[] = [];
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
        this.parentCategories.map((category: string) =>
          this.fb.control(category)
        )
      ),
    });
  }

  addCategory(): void {
    this.categories.push(this.fb.control(''));
  }

  sendCategories(): void {
    this.sendCategories$.emit(this.categoriesForm.value);
  }

  removeCategory(i: number): void {
    this.categories.removeAt(i);
  }
}
