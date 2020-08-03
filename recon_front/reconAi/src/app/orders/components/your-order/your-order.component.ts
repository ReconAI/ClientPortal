import { tap } from 'rxjs/operators';
import {
  FinishedPaymentDialogComponent,
  FinishedPaymentDialogDataInterface,
} from './finished-payment-dialog/finished-payment-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  payBasketSucceededAction,
  payBasketErrorAction,
} from './../../../store/orders/orders.actions';
import { BasketPaymentSucceededInterface } from './../../../store/orders/orders.server.helpers';
import { ofType } from '@ngrx/effects';
import { Subscription, Observable } from 'rxjs';
import { ActionsSubject, Action } from '@ngrx/store';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { BasketItemClientInterface } from 'app/orders/constants/types/basket';
import { FormServerErrorInterface } from 'app/constants/types/requests';

@Component({
  selector: 'recon-your-order',
  templateUrl: './your-order.component.html',
  styleUrls: ['./your-order.component.less'],
})
export class YourOrderComponent implements OnInit, OnDestroy {
  @Input() basketItems: BasketItemClientInterface[] = [];
  @Input() phone = '';
  @Input() invoicingPhone = '';
  @Input() email = '';
  @Input() address = '';
  @Input() company = '';
  @Input() firstName = '';
  @Input() lastName = '';
  @Input() loadingOverviewStatus = false;
  @Input() payingBasketStatus = false;

  @Output() deleteClick$ = new EventEmitter<number>();
  @Output() buyClick$ = new EventEmitter<string>();

  succeededPaymentSubscription$: Subscription;
  failedPaymentSubscription$: Subscription;

  paymentMethod: string;

  succeededPaymentAction$: Observable<
    Action & BasketPaymentSucceededInterface
  > = this.actionsSubject.pipe(ofType(payBasketSucceededAction));

  failedPaymentAction$: Observable<
    Action & FormServerErrorInterface
  > = this.actionsSubject.pipe(ofType(payBasketErrorAction));

  get vatAmount(): number {
    return this.basketItems.reduce((sum, item) => (sum += item.vatAmount), 0);
  }

  get priceWithoutVat(): number {
    return this.basketItems.reduce(
      (sum, item) => (sum += item.totalWithoutVat),
      0
    );
  }

  get priceWithVat(): number {
    return this.basketItems.reduce(
      (sum, item) => (sum += item.totalWithVat),
      0
    );
  }

  constructor(
    private actionsSubject: ActionsSubject,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.succeededPaymentSubscription$ = this.succeededPaymentAction$.subscribe(
      ({ id }) => {
        this.openDialog({
          id,
          succeeded: true,
          message: 'Your order has been completed successfully!',
        });
      }
    );

    this.failedPaymentSubscription$ = this.failedPaymentAction$.subscribe(
      ({ general }) => {
        this.openDialog({
          succeeded: false,
          message:
            general || 'Something went wrong and your order was not registered',
        });
      }
    );
  }

  openDialog(data: FinishedPaymentDialogDataInterface): void {
    this.dialog.open(FinishedPaymentDialogComponent, {
      height: '300px',
      width: '420px',
      data,
    });
  }

  deleteClick(deviceId: number): void {
    this.deleteClick$.emit(deviceId);
  }

  selectPayment(value: string): void {
    this.paymentMethod = value;
  }

  buyClick(): void {
    this.buyClick$.emit(this.paymentMethod);
  }

  ngOnDestroy(): void {
    this.succeededPaymentSubscription$.unsubscribe();
    this.failedPaymentSubscription$.unsubscribe();
  }
}
