import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VAT } from 'app/constants/globalVariables/globalVariables';

@Component({
  selector: 'recon-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.less'],
})
export class OrderItemComponent implements OnInit {
  @Input() id: number;
  @Input() selected = false;
  @Input() amount = 1;
  @Input() priceWithoutVat = 0;
  @Input() priceWithVat = 0;
  @Input() vatAmount = 0;
  @Input() name = '';
  @Input() imgUrl;
  @Input() orderId: string;
  @Input() paymentDate: string;

  @Input() hideOrderId: boolean;
  @Input() hidePaymentDate: boolean;
  @Input() hideDelete: boolean;
  readonly vat = VAT;
  @Output() deleteClick$ = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  onDelete(): void {
    this.deleteClick$.emit(this.id);
  }
}
