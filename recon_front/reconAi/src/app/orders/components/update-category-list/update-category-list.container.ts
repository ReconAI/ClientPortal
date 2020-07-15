import { selectOrderCategoriesList } from './../../../store/orders/orders.selectors';
import { CategoryInterface } from './../../constants/types/category';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { loadCategoriesRequestedAction } from 'app/store/orders';

@Component({
  selector: 'recon-update-category-list-container',
  templateUrl: './update-category-list.container.html',
})
export class UpdateCategoryListContainer implements OnInit {
  constructor(private store: Store<AppState>) {}

  categoriesList$: Observable<CategoryInterface[]> = this.store.pipe(
    select(selectOrderCategoriesList)
  );

  ngOnInit(): void {
    this.store.dispatch(loadCategoriesRequestedAction());
  }
}
