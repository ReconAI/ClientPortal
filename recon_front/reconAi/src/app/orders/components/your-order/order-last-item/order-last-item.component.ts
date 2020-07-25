import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-order-last-item',
  templateUrl: './order-last-item.component.html',
  styleUrls: ['./order-last-item.component.less'],
})
export class OrderLastItemComponent implements OnInit {
  @Input() selected = false;
  @Input() vatSum = 20;
  @Input() price = 10000;
  constructor() {}

  ngOnInit(): void {}
}
