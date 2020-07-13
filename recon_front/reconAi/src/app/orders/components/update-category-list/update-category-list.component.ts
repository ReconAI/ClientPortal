import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-update-category-list',
  templateUrl: './update-category-list.component.html',
  styleUrls: ['./update-category-list.component.less'],
})
export class UpdateCategoryListComponent implements OnInit {
  @Input() parentCategories: string[] = [
    'All',
    'Edge Calculation Unit',
    'Cameras',
    'Lidars',
    'Sonars',
    'Routers',
  ];
  categoriesForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  get categories() {
    return this?.categoriesForm?.get('categories') as FormArray;
  }

  ngOnInit(): void {
    this.categoriesForm = this.fb.group({
      categories: this.fb.array(
        this.parentCategories.map((category) => this.fb.control(category))
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
