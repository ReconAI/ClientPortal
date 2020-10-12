import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { activationRequestedAction } from 'app/store/signUp';
import { Component, OnInit } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { setAuthStatusAction } from 'app/store/user';

@Component({
  selector: 'recon-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.less'],
})
export class ActivationComponent implements OnInit {
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

    this.store.dispatch(
      setAuthStatusAction({
        status: false,
      })
    );

    this.store.dispatch(
      activationRequestedAction({
        uidb64: this.uidb64,
        token: this.token,
      })
    );

    this.router.navigate(['/']);
  }
}
