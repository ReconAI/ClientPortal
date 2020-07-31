import {
  ROLES_AND_PRIORITIES_CONNECTIONS,
  ROLES_CONNECTIONS,
} from './../../../../constants/types/user';
import { map, tap } from 'rxjs/operators';
import { logoutUserRequestedAction } from './../../../../store/user/user.actions';
import {
  selectUserRolePriority,
  selectCurrentUserName,
  selectUserRole,
  selectIsUserAbleToBuy,
} from './../../../../store/user/user.selectors';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'app/store/reducers';
import { UserRolesPriorities } from 'app/constants/types';

@Component({
  selector: 'recon-user-menu-container',
  templateUrl: './user-menu.container.html',
  encapsulation: ViewEncapsulation.None,
})
export class UserMenuContainer implements OnInit {
  constructor(private store: Store<AppState>) {}

  userPriority$: Observable<UserRolesPriorities> = this.store.pipe(
    select(selectUserRolePriority)
  );

  isUserAbleToBuy$: Observable<boolean> = this.store.pipe(
    select(selectIsUserAbleToBuy)
  );
  userName$ = this.store.pipe(select(selectCurrentUserName));
  userRole$ = this.store.pipe(
    select(selectUserRole),
    map((serverRole) => ROLES_CONNECTIONS[serverRole] || serverRole)
  );

  logout(): void {
    this.store.dispatch(logoutUserRequestedAction());
  }

  ngOnInit(): void {}
}
