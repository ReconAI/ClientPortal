import { selectPurchaseLoadingStatus } from './../../../store/loaders/loaders.selectors';
import {
  selectCurrentUserProfileInvoicingEmail,
  selectCurrentUserProfileOrganizationLastName,
  selectCurrentUserProfileOrganizationFirstName,
  selectCurrentUserProfileOrganizationName,
  selectCurrentUserProfileInvoicingAddress,
} from './../../../store/user/user.selectors';
import { Observable } from 'rxjs';
import { loadPurchaseRequestedAction } from './../../../store/purchases/purchases.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppState } from 'app/store/reducers';
import { Store, select } from '@ngrx/store';
import { PurchaseCardClientInterface } from 'app/constants/types/purchase';
import { selectPurchaseCard } from 'app/store/purchases/purchases.selectors';
import {
  selectCurrentUserProfileOrganizationPhone,
  selectCurrentUserProfileInvoicingPhone,
} from 'app/store/user/user.selectors';

@Component({
  selector: 'recon-purchase-card',
  templateUrl: './purchase-card.container.html',
  styleUrls: ['./purchase-card.container.less'],
})
export class PurchaseCardContainer implements OnInit {
  id: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectPurchaseLoadingStatus)
  );

  purchases$: Observable<PurchaseCardClientInterface[]> = this.store.pipe(
    select(selectPurchaseCard)
  );

  phone$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileOrganizationPhone)
  );

  invoicingPhone$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileInvoicingPhone)
  );

  email$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileInvoicingEmail)
  );

  lastName$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileOrganizationLastName)
  );

  firstName$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileOrganizationFirstName)
  );

  company$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileOrganizationName)
  );

  address$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileInvoicingAddress)
  );

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.store.dispatch(loadPurchaseRequestedAction({ id: this.id }));
  }
}
