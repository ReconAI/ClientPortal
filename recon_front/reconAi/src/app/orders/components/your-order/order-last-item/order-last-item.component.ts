import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-order-last-item',
  templateUrl: './order-last-item.component.html',
  styleUrls: ['./order-last-item.component.less'],
})
export class OrderLastItemComponent implements OnInit {
  @Input() vatAmount = 0;
  @Input() totalPriceWithoutVat = 0;
  @Input() totalPriceWithVat = 0;
  constructor() {}

  ngOnInit(): void {}
}
