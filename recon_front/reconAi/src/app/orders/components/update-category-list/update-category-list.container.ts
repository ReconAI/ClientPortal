import { selectCategoriesListLoadingStatus } from './../../../store/loaders/loaders.selectors';
import { map, tap } from 'rxjs/operators';
import { updateCategoriesRequestedAction } from './../../../store/orders/orders.actions';
import { selectOrderCategoriesList } from './../../../store/orders/orders.selectors';
import { CategoryInterface } from './../../constants/types/category';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { loadCategoriesRequestedAction } from 'app/store/orders';
import {
  CategoriesClientInterface,
  CategoriesFormInterface,
} from 'app/store/orders/orders.server.helpers';
import { selectUpdateCategoriesListLoadingStatus } from 'app/store/loaders/loaders.selectors';

@Component({
  selector: 'recon-update-category-list-container',
  templateUrl: './update-category-list.container.html',
})
export class UpdateCategoryListContainer implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>) {}
  loadingStatus = true;
  loadingStatusSubscription: Subscription;

  categoriesList$: Observable<CategoryInterface[]> = this.store.pipe(
    select(selectOrderCategoriesList)
  );

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectCategoriesListLoadingStatus),
  );

  loadingUpdatingStatus$: Observable<boolean> = this.store.pipe(
    select(selectUpdateCategoriesListLoadingStatus),
  );

  sendCategories(categories: CategoriesClientInterface): void {
    this.store.dispatch(updateCategoriesRequestedAction(categories));
  }

  ngOnInit(): void {
    this.loadingStatusSubscription = this.loadingStatus$.subscribe((status) => {
      this.loadingStatus = status;
    });
    this.store.dispatch(loadCategoriesRequestedAction());
  }

  ngOnDestroy(): void {
    this.loadingStatusSubscription.unsubscribe();
  }
}
