import { MatDialogRef } from '@angular/material/dialog';
import {
  attachCardSucceededAction,
  resetAttachCardErrorAction,
} from './../../../../store/user/user.actions';
import { ofType } from '@ngrx/effects';
import { selectAttachCardLoadingStatus } from './../../../../store/loaders/loaders.selectors';
import { Observable, Subscription } from 'rxjs';
import { Store, select, Action, ActionsSubject } from '@ngrx/store';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { StripeService } from 'app/core/services/stripe/stripe.service';
import { AppState } from 'app/store/reducers';
import { selectAttachCardErrorsStatus } from 'app/store/user/user.selectors';
@Component({
  selector: 'recon-create-card-dialog-container',
  templateUrl: './create-card-dialog.container.html',
})
export class CreateCardDialogContainer implements OnInit, OnDestroy {
  constructor(
    private store: Store<AppState>,
    private stripeService: StripeService,
    private actionsSubject: ActionsSubject,
    private dialogRef: MatDialogRef<CreateCardDialogContainer>
  ) {}

  closeModalSubscription$: Subscription;
  loadingStatus$: Observable<boolean> = this.store.pipe(
    select(selectAttachCardLoadingStatus)
  );
  validationError$: Observable<string> = this.store.pipe(
    select(selectAttachCardErrorsStatus)
  );

  closeModal$: Observable<Action> = this.actionsSubject.pipe(
    ofType(attachCardSucceededAction)
  );

  onSubmitStripe(card): void {
    this.stripeService.createPaymentCardMethod(card);
  }

  ngOnInit(): void {
    this.closeModalSubscription$ = this.closeModal$.subscribe(() => {
      this.dialogRef.close();
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetAttachCardErrorAction());
    this.closeModalSubscription$.unsubscribe();
  }
}
