import { ofType } from '@ngrx/effects';
import {
  loginUserSucceededAction,
  logoutUserRequestedAction,
} from './../../../../store/user/user.actions';
import { preSignUpUserSucceededAction } from './../../../../store/signUp/signUp.actions';
import {
  selectUserRolePriority,
  selectCurrentUserName,
  selectUserRole,
} from './../../../../store/user/user.selectors';
import { Observable } from 'rxjs';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  ViewEncapsulation,
} from '@angular/core';
import { Store, select, ActionsSubject } from '@ngrx/store';
import { AppState } from 'app/store/reducers';
import { UserRolesPriorities } from 'app/constants/types';

@Component({
  selector: 'recon-user-menu-container',
  templateUrl: './user-menu.container.html',
  encapsulation: ViewEncapsulation.None,
})
export class UserMenuContainer implements OnInit {
  constructor(
    private store: Store<AppState>,
    private actionsSubject: ActionsSubject
  ) {}

  userPriority$: Observable<UserRolesPriorities> = this.store.pipe(
    select(selectUserRolePriority)
  );

  closeModal$ = this.actionsSubject.pipe(
    ofType(loginUserSucceededAction, preSignUpUserSucceededAction)
  );

  userName$ = this.store.pipe(select(selectCurrentUserName));
  userRole$ = this.store.pipe(select(selectUserRole));

  logout(): void {
    this.store.dispatch(logoutUserRequestedAction());
  }

  ngOnInit(): void {}
}
