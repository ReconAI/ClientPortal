import { Router } from '@angular/router';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  AfterViewInit,
  ElementRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { PurchaseClientInterface } from 'app/constants/types/purchase';

@Component({
  selector: 'recon-purchases-list',
  templateUrl: './purchases-list.component.html',
  styleUrls: ['./purchases-list.component.less'],
})
export class PurchasesListComponent implements OnInit, AfterViewInit {
  @ViewChild('successColumn') successColumnRef: TemplateRef<
    PurchaseClientInterface
  >;

  @Input() purchases: PurchaseClientInterface[] = [];
  @Input() currentPage = 0;
  @Input() totalCount = 0;
  @Input() pageSize = 0;
  @Input() loadingStatus = false;
  @Output() loadData$ = new EventEmitter<number>();

  columns = [];

  constructor(private router: Router) {}

  loadPurchases(page: number) {
    this.loadData$.emit(page);
  }

  purchaseClick(purchase: PurchaseClientInterface) {
    if (purchase.type === 'purchase') {
      this.router.navigate(['invoice/', purchase.id]);
    }
  }

  ngAfterViewInit(): void {
    this.columns = [
      {
        header: 'Order ID',
        id: 'id',
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
      {
        header: 'Status',
        id: 'status',
        cellTemplate: this.successColumnRef,
      },
    ];
  }
  ngOnInit(): void {}
}
