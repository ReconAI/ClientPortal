import { Store } from '@ngrx/store';
import { AppState } from 'app/store/reducers';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'recon-invitation-user',
  templateUrl: './invitation-user.component.html',
  styleUrls: ['./invitation-user.component.less'],
})
export class InvitationUserComponent implements OnInit {
  uidb64: string;
  token: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.uidb64 = this.activatedRoute.snapshot.paramMap.get('uidb');
    this.token = this.activatedRoute.snapshot.paramMap.get('token');
  }
}
