import { OrderItemInterface } from './../../constants/types/order';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.less'],
})
export class OrderItemComponent implements OnInit {
  @Input() imgUrl =
    'https://ayrusglobal.com/wp-content/uploads/2017/05/AY-ECU-B2MPR-I-600x600.jpg';
  @Input() price = 2000;
  @Input() name =
    'Edge Ai - Machine vision: Camera + ECU set for outdoor usage';

  constructor() {}

  ngOnInit(): void {}
}
