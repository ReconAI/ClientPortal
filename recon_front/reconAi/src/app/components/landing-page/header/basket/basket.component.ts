import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.less']
})
export class BasketComponent implements OnInit {
  @Input() isVisible: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
