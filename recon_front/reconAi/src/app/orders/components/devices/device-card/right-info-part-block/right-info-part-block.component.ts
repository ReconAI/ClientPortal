import {
  VAT,
  FEE,
} from './../../../../../constants/globalVariables/globalVariables';
import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'recon-right-info-part-block',
  templateUrl: './right-info-part-block.component.html',
  styleUrls: ['./right-info-part-block.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class RightInfoPartBlockComponent implements OnInit {
  @Input() name: string;
  @Input() description: string;
  @Input() category: string;
  @Input() manufacturer: string;
  @Input() salesPrice: string;
  @Input() salesPriceWithVat: string;
  @Input() isAbleToBuy: boolean;
  @Input() product: string;
  @Output() addToBasket$ = new EventEmitter<number>();

  readonly vat = VAT;
  readonly fee = FEE;

  amount = 1;

  addValue(value: number): void {
    if (this.amount + value >= 1) {
      this.amount = +this.amount + value;
    }
  }

  get totalDevicesPrice(): number {
    return +this.salesPriceWithVat * this.amount || 0;
  }

  get vatAmount(): number {
    return this.totalDevicesPrice - this.totalDevicesPriceWithoutVat || 0;
  }

  get totalDevicesPriceWithoutVat(): number {
    return +this.salesPrice * this.amount || 0;
  }

  get singleDevicePrice(): number {
    return +this.salesPriceWithVat || 0;
  }

  validateInput(value: string | number) {
    const numberedValue = +value;
    if (Number.isNaN(numberedValue)) {
      this.amount = 1;
    }

    this.amount = Math.floor(this.amount);
  }

  addToBasket(): void {
    this.addToBasket$.emit(+this.amount);
    this.amount = 1;
  }
  constructor() {}

  ngOnInit(): void {}
}
