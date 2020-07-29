import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-delivery-information',
  templateUrl: './delivery-information.component.html',
  styleUrls: ['./delivery-information.component.less'],
})
export class DeliveryInformationComponent implements OnInit {
  @Input() company = '';
  @Input() person = '';
  @Input() phone = '';
  @Input() invoicingPhone = '';
  @Input() email = '';
  @Input() address = '';
  constructor() {}

  ngOnInit(): void {}
}
