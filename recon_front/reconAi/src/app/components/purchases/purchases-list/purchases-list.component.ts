import { Router } from '@angular/router';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PurchaseClientInterface } from 'app/constants/types/purchase';

@Component({
  selector: 'recon-purchases-list',
  templateUrl: './purchases-list.component.html',
  styleUrls: ['./purchases-list.component.less'],
})
export class PurchasesListComponent implements OnInit {
  @Input() purchases: PurchaseClientInterface[] = [];
  @Input() currentPage = 0;
  @Input() totalCount = 0;
  @Input() pageSize = 0;
  @Input() loadingStatus = false;
  @Output() loadData$ = new EventEmitter<number>();

  readonly columns = [
    {
      header: 'Order ID',
      id: 'paymentId',
    },
    {
      header: 'Payment date',
      id: 'date',
    },
    {
      header: 'Type',
      id: 'type',
      render: (purchase: PurchaseClientInterface) =>
        purchase.type === 'purchase' ? 'Purchase device' : 'Monthly invoice',
    },
    {
      header: 'Amount, €',
      id: 'total',
    },
  ];

  constructor(private router: Router) {}

  loadPurchases(page: number) {
    this.loadData$.emit(page);
  }

  purchaseClick(purchase: PurchaseClientInterface) {
    this.router.navigate(['invoice/', purchase.paymentId]);
  }
  ngOnInit(): void {}
}
