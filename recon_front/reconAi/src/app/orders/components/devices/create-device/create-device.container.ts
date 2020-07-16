import { selectOrderCategoriesList } from './../../../../store/orders/orders.selectors';
import { Observable } from 'rxjs';
import { loadCategoriesRequestedAction } from 'app/store/orders';
import { Store, select } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { CategoryInterface } from 'app/orders/constants';

@Component({
  selector: 'recon-create-device-container',
  templateUrl: './create-device.container.html',
})
export class CreateDeviceContainer implements OnInit {
  constructor(private store: Store<AppState>) {}

  categories$: Observable<CategoryInterface[]> = this.store.pipe(
    select(selectOrderCategoriesList)
  );
  ngOnInit(): void {
    this.store.dispatch(loadCategoriesRequestedAction());
  }
}
