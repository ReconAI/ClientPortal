import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'recon-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class OrdersListComponent implements OnInit {
  @Input() categories: string[] = [
    'All',
    'Edge Calculation Unit',
    'Cameras',
    'Lidars',
    'Sonars',
    'Routers',
  ];
  @Input() sortValue = 'new';
  constructor(private router: Router) {}

  navigateTo(url: string): void {
    this.router.navigate([url]);
  }

  ngOnInit(): void {}
}
