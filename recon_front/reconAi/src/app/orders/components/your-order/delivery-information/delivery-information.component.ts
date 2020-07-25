import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-delivery-information',
  templateUrl: './delivery-information.component.html',
  styleUrls: ['./delivery-information.component.less'],
})
export class DeliveryInformationComponent implements OnInit {
  @Input() company = 'HQSoftware';
  @Input() person = 'Julia Zhdanovich';
  @Input() phone = '+123412341234';
  @Input() email = 'Julia_Zhda@gmail.com';
  @Input() address = 'Minsk, Pobeditelei Pr., 57 and 108';
  constructor() {}

  ngOnInit(): void {}
}
