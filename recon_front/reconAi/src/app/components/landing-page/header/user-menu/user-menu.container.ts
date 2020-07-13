import { logoutUserRequestedAction } from './../../../../store/user/user.actions';
import {
  selectUserRolePriority,
  selectCurrentUserName,
  selectUserRole,
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

  userName$ = this.store.pipe(select(selectCurrentUserName));
  userRole$ = this.store.pipe(select(selectUserRole));

  logout(): void {
    this.store.dispatch(logoutUserRequestedAction());
  }

  ngOnInit(): void {}
}
