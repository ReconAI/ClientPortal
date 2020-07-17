import { map } from 'rxjs/operators';
import { selectUserRolePriority } from './../../../../store/user/user.selectors';
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
    select(selectUserRolePriority),
    map(
      (priority) =>
        priority === UserRolesPriorities.DEVELOPER_ROLE ||
        priority === UserRolesPriorities.ADMIN_ROLE
    )
  );
  ngOnInit(): void {}
}
