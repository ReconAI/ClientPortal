import {
  selectCurrentUserProfileId,
  selectCurrentUserProfileInvoicingPhone,
  selectCurrentUserProfileInvoicingEmail,
  selectCurrentUserProfileInvoicingLastName,
  selectCurrentUserProfileInvoicingFirstName,
  selectCurrentUserProfileOrganizationName,
  selectCurrentUserProfileInvoicingAddress,
  selectCurrentUserProfileOrganizationPhone,
  selectCurrentUserProfileOrganizationLastName,
  selectCurrentUserProfileOrganizationFirstName,
  selectCurrentUserProfileOrganizationDefaultCardId,
} from './../../../store/user/user.selectors';
import { tap } from 'rxjs/operators';
import { selectUserProfileId } from './../../../store/users/users.selectors';
import { BasketService } from './../../../core/services/basket/basket.service';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'app/store/reducers';
import {
  loadBasketOverviewRequestedAction,
  payBasketRequestedAction,
} from 'app/store/orders';
import { selectBasketItems } from 'app/store/orders/orders.selectors';
import { Observable, Subscription } from 'rxjs';
import { BasketItemClientInterface } from 'app/orders/constants/types/basket';
import {
  selectPayingBasketLoadingStatus,
  selectBasketOverviewLoadingStatus,
} from 'app/store/loaders/loaders.selectors';

@Component({
  selector: 'recon-your-order-container',
  templateUrl: './your-order.container.html',
})
export class YourOrderContainer implements OnInit, OnDestroy {
  constructor(
    private store: Store<AppState>,
    private basketService: BasketService
  ) {}

  currentUserId: string;
  currentUserIdSubscription$: Subscription;

  basketItems$: Observable<BasketItemClientInterface[]> = this.store.pipe(
    select(selectBasketItems)
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

  currentUserProfileId$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileId)
  );

  loadingOverviewStatus$: Observable<boolean> = this.store.pipe(
    select(selectBasketOverviewLoadingStatus)
  );

  payingBasketStatus$: Observable<boolean> = this.store.pipe(
    select(selectPayingBasketLoadingStatus)
  );

  selectDefaultCardId$: Observable<string> = this.store.pipe(
    select(selectCurrentUserProfileOrganizationDefaultCardId)
  );

  deleteDeviceOfUser(deviceId: number): void {
    this.basketService.deleteDeviceOfUser(deviceId, +this.currentUserId);
    this.store.dispatch(loadBasketOverviewRequestedAction());
  }

  ngOnInit(): void {
    this.currentUserIdSubscription$ = this.currentUserProfileId$.subscribe(
      (id) => {
        this.currentUserId = id;
      }
    );
    this.store.dispatch(loadBasketOverviewRequestedAction());
  }

  buyClick(cardId: string): void {
    this.store.dispatch(
      payBasketRequestedAction({
        cardId,
      })
    );
  }
  ngOnDestroy(): void {
    this?.currentUserIdSubscription$?.unsubscribe();
  }
}
