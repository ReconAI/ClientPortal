import { UserProfileFormInterface } from './../../constants/types/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store/reducers';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormServerErrorInterface } from 'app/constants/types/requests';

@Component({
  selector: 'recon-invitation-user',
  templateUrl: './invitation-user.component.html',
  styleUrls: ['./invitation-user.component.less'],
})
export class InvitationUserComponent implements OnInit {
  @Input() uidb64: string;
  @Input() token: string;
  @Input() email: string;
  @Input() firstName: string;
  @Input() lastName: string;
  @Input() userUsername: string;
  @Input() isLoadingActivating: boolean;
  @Input() errors: FormServerErrorInterface;
  @Input() isLoadingSignUp: boolean;
  @Output() invitationSignUp$ = new EventEmitter();

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.uidb64 = this.activatedRoute.snapshot.paramMap.get('uidb');
    this.token = this.activatedRoute.snapshot.paramMap.get('token');
  }

  invitationSignUp(user: UserProfileFormInterface) {
    this.invitationSignUp$.emit(user);
  }
}
