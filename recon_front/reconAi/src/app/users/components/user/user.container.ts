import { UserRolesPriorities } from './../../../constants/types/user';
import { setAppTitleAction } from './../../../store/app/app.actions';
import {
  selectUserProfileLoadingStatus,
  selectUpdateUserLoadingStatus,
} from './../../../store/loaders/loaders.selectors';
import { Observable } from 'rxjs';
import {
  selectUserProfileOrganizationName,
  selectUserProfileOrganizationPhone,
  selectUserProfileOrganizationEmail,
  selectUserProfileOrganizationAddress,
  selectUserProfileOrganizationVat,
  selectUserProfileOrganizationFirstName,
  selectUserProfileOrganizationLastName,
  selectUserProfileUserPhone,
  selectUserProfileUserEmail,
  selectUserProfileUserAddress,
  selectUserProfileUserFirstName,
  selectUserProfileUserLastName,
  selectUserProfileInvoicingPhone,
  selectUserProfileInvoicingEmail,
  selectUserProfileInvoicingAddress,
  selectUserProfileInvoicingFirstName,
  selectUserProfileInvoicingLastName,
  selectWhetherUserProfileFound,
  selectUserProfileRolePriority,
} from './../../../store/users/users.selectors';
import {
  loadUserProfileRequestedAction,
  resetUserProfileAction,
  updateUserRequested,
} from './../../../store/users/users.actions';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { UserProfileFormInterface } from 'app/constants/types';

@Component({
  selector: 'recon-user-container',
  templateUrl: './user.container.html',
})
export class UserContainer implements OnInit, OnDestroy {
  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  isUserFound$: Observable<boolean> = this.store.pipe(
    select(selectWhetherUserProfileFound)
  );

  isLoading$: Observable<boolean> = this.store.pipe(
    select(selectUserProfileLoadingStatus)
  );

  organizationName$: Observable<string> = this.store.pipe(
    select(selectUserProfileOrganizationName)
  );

  organizationPhone$: Observable<string> = this.store.pipe(
    select(selectUserProfileOrganizationPhone)
  );
  organizationEmail$: Observable<string> = this.store.pipe(
    select(selectUserProfileOrganizationEmail)
  );
  organizationAddress$: Observable<string> = this.store.pipe(
    select(selectUserProfileOrganizationAddress)
  );
  organizationVat$: Observable<string> = this.store.pipe(
    select(selectUserProfileOrganizationVat)
  );
  organizationFirstName$: Observable<string> = this.store.pipe(
    select(selectUserProfileOrganizationFirstName)
  );
  organizationLastName$: Observable<string> = this.store.pipe(
    select(selectUserProfileOrganizationLastName)
  );

  userPhone$: Observable<string> = this.store.pipe(
    select(selectUserProfileUserPhone)
  );

  userEmail$: Observable<string> = this.store.pipe(
    select(selectUserProfileUserEmail)
  );
  userAddress$: Observable<string> = this.store.pipe(
    select(selectUserProfileUserAddress)
  );
  userFirstName$: Observable<string> = this.store.pipe(
    select(selectUserProfileUserFirstName)
  );
  userLastName$: Observable<string> = this.store.pipe(
    select(selectUserProfileUserLastName)
  );

  invoicingPhone$: Observable<string> = this.store.pipe(
    select(selectUserProfileInvoicingPhone)
  );

  isUpdating$: Observable<boolean> = this.store.pipe(
    select(selectUpdateUserLoadingStatus)
  );

  invoicingEmail$: Observable<string> = this.store.pipe(
    select(selectUserProfileInvoicingEmail)
  );
  invoicingAddress$: Observable<string> = this.store.pipe(
    select(selectUserProfileInvoicingAddress)
  );
  invoicingFirstName$: Observable<string> = this.store.pipe(
    select(selectUserProfileInvoicingFirstName)
  );
  invoicingLastName$: Observable<string> = this.store.pipe(
    select(selectUserProfileInvoicingLastName)
  );

  userRolePriority$: Observable<UserRolesPriorities> = this.store.pipe(
    select(selectUserProfileRolePriority)
  );

  userId: string;

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    this.store.dispatch(loadUserProfileRequestedAction({ id: this.userId }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetUserProfileAction());
  }

  sendUser(user: UserProfileFormInterface): void {
    this.store.dispatch(updateUserRequested(user.user));
  }
}
