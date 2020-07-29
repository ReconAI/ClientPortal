import { map } from 'rxjs/operators';
import {
  selectUserRolePriority,
  selectUserBasketAmount,
  selectIsUserAbleToBuy,
} from './../../../../store/user/user.selectors';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { UserRolesPriorities } from 'app/constants/types';

@Component({
  selector: 'recon-basket-container',
  templateUrl: './basket.container.html',
})
export class BasketContainer implements OnInit {
  constructor(private store: Store<AppState>) {}

  hasToShow$: Observable<boolean> = this.store.pipe(
    select(selectIsUserAbleToBuy)
  );

  basketAmount$: Observable<number> = this.store.pipe(
    select(selectUserBasketAmount)
  );
  ngOnInit(): void {}
}
