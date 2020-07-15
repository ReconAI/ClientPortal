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

  categoriesList$: Observable<string[]> = this.store.pipe(
    select(selectOrderCategoriesList),
    tap((cat) => console.log(cat, 'BEFORE')),
    map((categories: CategoryInterface[]) =>
      categories.map(({ name }: CategoryInterface): string => name)
    ),
    tap((cat) => console.log(cat, 'AFTER'))
  );

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectCategoriesListLoadingStatus),
    tap((status) => console.log(status, 'STATUS'))
  );

  loadingUpdatingStatus$: Observable<boolean> = this.store.pipe(
    select(selectUpdateCategoriesListLoadingStatus),
    tap((status) => console.log(status, 'STATUS UPDATING'))
  );

  sendCategories({ categories }: CategoriesFormInterface): void {
    this.store.dispatch(
      updateCategoriesRequestedAction({
        categories: Array.from(categories).map((category) => ({
          name: category,
        })),
      })
    );
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
