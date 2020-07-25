import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.less'],
})
export class OrderItemComponent implements OnInit {
  @Input() selected = false;
  @Input() amount = 1;
  @Input() vat = 20;
  @Input() price = 134124.1241241232;
  @Input() name =
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  @Input() imgUrl = 'https://www.canon.ru/media/eos_range_tcm203-1266213.png';

  constructor() {}

  ngOnInit(): void {}
}
