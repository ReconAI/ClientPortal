import { CategoryInterface } from './../../constants/types/category';
import { CLOSE_ICON_TOOLTIP_TEXT } from './../../constants/labels/categories';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-update-category-list',
  templateUrl: './update-category-list.component.html',
  styleUrls: ['./update-category-list.component.less'],
})
export class UpdateCategoryListComponent implements OnInit {
  @Input() parentCategories: CategoryInterface[] = [];
  categoriesForm: FormGroup;
  readonly closeTooltip = CLOSE_ICON_TOOLTIP_TEXT;
  constructor(private fb: FormBuilder) {}

  get categories() {
    return this?.categoriesForm?.get('categories') as FormArray;
  }

  ngOnInit(): void {
    this.categoriesForm = this.fb.group({
      categories: this.fb.array(
        this.parentCategories.map(({ name }) => this.fb.control(name))
      ),
    });
  }

  addCategory(): void {
    this.categories.push(this.fb.control(''));
  }

  removeCategory(i: number): void {
    this.categories.removeAt(i);
  }
}
