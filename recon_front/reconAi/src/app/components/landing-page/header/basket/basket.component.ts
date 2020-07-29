import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'recon-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.less'],
})
export class BasketComponent implements OnInit {
  @Input() isVisible: boolean;
  @Input() amount = 0;
  constructor(private router: Router) {}

  ngOnInit(): void {}

  blockClick(): void {
    this.router.navigate(['orders/basket']);
  }
}
