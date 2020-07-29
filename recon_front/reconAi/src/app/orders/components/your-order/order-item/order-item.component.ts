import { VAT } from './../../../../constants/globalVariables/globalVariables';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  readonly vat = VAT;
  @Output() deleteClick$ = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  onDelete(): void {
    this.deleteClick$.emit(this.id);
  }
}
