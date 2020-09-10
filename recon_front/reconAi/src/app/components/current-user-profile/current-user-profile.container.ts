import { changePasswordRequestedAction } from './../../store/user/user.actions';
import {
  selectUpdateCurrentUserLoadingStatus,
  selectChangePasswordStatus,
} from './../../store/loaders/loaders.selectors';
import {
  selectCurrentUserProfileOrganizationName,
  selectCurrentUserProfileOrganizationPhone,
  selectCurrentUserProfileOrganizationEmail,
  selectCurrentUserProfileOrganizationAddress,
  selectCurrentUserProfileOrganizationVat,
  selectCurrentUserProfileOrganizationFirstName,
  selectCurrentUserProfileOrganizationLastName,
  selectCurrentUserProfileUserPhone,
  selectCurrentUserProfileUserEmail,
  selectCurrentUserProfileUserAddress,
  selectCurrentUserProfileUserFirstName,
  selectCurrentUserProfileUserLastName,
  selectCurrentUserProfileInvoicingPhone,
  selectCurrentUserProfileInvoicingEmail,
  selectCurrentUserProfileInvoicingAddress,
  selectCurrentUserProfileInvoicingFirstName,
  selectCurrentUserProfileInvoicingLastName,
  selectUserRolePriority,
  selectCurrentUserUpdateError,
} from './../../store/user/user.selectors';
import { Store, select } from '@ngrx/store';
import { AppState } from './../../store/reducers/index';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import {
  UserRolesPriorities,
  UserProfileFormInterface,
} from 'app/constants/types';
import { FormServerErrorInterface } from 'app/constants/types/requests';
import {
  updateCurrentUserRequestedAction,
  resetUpdateCurrentUserErrorAction,
} from 'app/store/user';

@Component({
  selector: 'recon-current-user-profile-container',
  templateUrl: './current-user-profile.container.html',
})
export class CurrentUserProfileContainer implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>) {}

  isLoading$: Observable<boolean> = this.store.pipe(
    select(selectUpdateCurrentUserLoadingStatus)
  );

  changingPassword$: Observable<boolean> = this.store.pipe(
    select(selectChangePasswordStatus)
  );

  error$: Observable<FormServerErrorInterface> = this.store.pipe(
    select(selectCurrentUserUpdateError)
  );

  organizationName$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileOrganizationName)
  );

  organizationPhone$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileOrganizationPhone)
  );
  organizationEmail$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileOrganizationEmail)
  );
  organizationAddress$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileOrganizationAddress)
  );
  organizationVat$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileOrganizationVat)
  );
  organizationFirstName$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileOrganizationFirstName)
  );
  organizationLastName$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileOrganizationLastName)
  );

  userPhone$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileUserPhone)
  );

  userEmail$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileUserEmail)
  );
  userAddress$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileUserAddress)
  );
  userFirstName$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileUserFirstName)
  );
  userLastName$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileUserLastName)
  );

  invoicingPhone$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileInvoicingPhone)
  );

  invoicingEmail$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileInvoicingEmail)
  );
  invoicingAddress$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileInvoicingAddress)
  );
  invoicingFirstName$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileInvoicingFirstName)
  );
  invoicingLastName$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileInvoicingLastName)
  );

  userRolePriority$: Observable<UserRolesPriorities> = this.store.pipe(
    select(selectUserRolePriority)
  );

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.store.dispatch(resetUpdateCurrentUserErrorAction());
  }

  changePassword(): void {
    this.store.dispatch(changePasswordRequestedAction());
  }

  updateUser(user: UserProfileFormInterface): void {
    this.store.dispatch(updateCurrentUserRequestedAction(user));
  }
}
