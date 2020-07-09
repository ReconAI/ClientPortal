import { UserProfileFormInterface } from './../../constants/types/user';
import {
  selectInvitedUserLastName,
  selectInvitedUserEmail,
  selectInvitedUserFirstName,
  selectInvitedUserUsername,
  selectInvitedSignUpError,
} from './../../store/users/users.selectors';
import { Observable } from 'rxjs';
import {
  inviteUserRequestedAction,
  invitationSignUpRequestedAction,
} from './../../store/users/users.actions';
import { Store, select } from '@ngrx/store';
import { AppState } from 'app/store/reducers';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  selectInviteUserLoadingStatus,
  selectInviteSignUpUserLoadingStatus,
} from 'app/store/loaders/loaders.selectors';
import { FormServerErrorInterface } from 'app/constants/types/requests';

@Component({
  selector: 'recon-invitation-user-container',
  templateUrl: './invitation-user.container.html',
})
export class InvitationUserContainer implements OnInit {
  uidb64: string;
  token: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router
  ) {}

  userFirstName$: Observable<string> = this.store.pipe(
    select(selectInvitedUserFirstName)
  );

  userLastName$: Observable<string> = this.store.pipe(
    select(selectInvitedUserLastName)
  );

  userEmail$: Observable<string> = this.store.pipe(
    select(selectInvitedUserEmail)
  );

  userUsername$: Observable<string> = this.store.pipe(
    select(selectInvitedUserUsername)
  );

  isLoadingActivating$: Observable<boolean> = this.store.pipe(
    select(selectInviteUserLoadingStatus)
  );

  isLoadingSignUp$: Observable<boolean> = this.store.pipe(
    select(selectInviteSignUpUserLoadingStatus)
  );

  errors$: Observable<FormServerErrorInterface> = this.store.pipe(
    select(selectInvitedSignUpError)
  );

  invitationSignUpClick(user: UserProfileFormInterface) {
    this.store.dispatch(invitationSignUpRequestedAction(user));
  }

  ngOnInit(): void {
    this.uidb64 = this.activatedRoute.snapshot.paramMap.get('uidb');
    this.token = this.activatedRoute.snapshot.paramMap.get('token');

    this.store.dispatch(
      inviteUserRequestedAction({
        uidb64: this.uidb64,
        token: this.token,
      })
    );
  }
}
