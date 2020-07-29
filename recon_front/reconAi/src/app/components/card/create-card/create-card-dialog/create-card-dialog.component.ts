import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { StripeService } from 'app/core/services/stripe/stripe.service';
@Component({
  selector: 'recon-create-card-dialog',
  templateUrl: './create-card-dialog.component.html',
  styleUrls: ['./create-card-dialog.component.less'],
})
export class CreateCardDialogComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() loadingStatus = false;
  // stripe & back end error
  @Input() validationError = '';
  @Output() submitStripe$ = new EventEmitter();
  elements: any;
  card: any;
  cardHandler = this.onChange.bind(this);
  // stripe front error
  error: string;
  constructor(
    private cdr: ChangeDetectorRef,
    private stripeService: StripeService
  ) {}

  @ViewChild('cardInfo') cardInfo: ElementRef;

  ngAfterViewInit() {
    this.elements = this.stripeService.elements();
    const style = {
      // input card style optional
      base: {
        fontSize: '16px',
        color: '#32325d',
      },
    };
    this.card = this.elements.create('card', {
      style,
      hidePostalCode: true,
    });
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cdr.detectChanges();
  }

  onSubmitStripe() {
    this.submitStripe$.emit(this.card);
  }
}
