import {
  CREATED_DT_ASC,
  CREATED_DT_DESC,
  SALES_PRICE_DESC,
  SALES_PRICE_ASC,
  ALL_CATEGORIES_ID_FOR_DEVICE,
} from './../../../constants/requests';
import { CategoryInterface, DeviceFormInterface } from 'app/orders/constants';
import { Router } from '@angular/router';
import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  EventEmitter,
  Output,
} from '@angular/core';
import { PaginatedDeviceListRequestInterface } from 'app/store/orders/orders.server.helpers';
import { MatSelectChange } from '@angular/material/select';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'recon-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class DeviceListComponent implements OnInit {
  @Input() categories: CategoryInterface[] = [];
  @Input() devices: DeviceFormInterface[] = [];
  @Input() totalCount: number;
  @Input() currentPage: number;
  @Input() pageSize: number;
  @Input() loadingStatus: boolean;
  @Input() isSuperAdmin = false;
  @Input() userId = '';

  @Output() loadData$ = new EventEmitter<PaginatedDeviceListRequestInterface>();

  @Input() ordering;
  sortOptions = [
    {
      value: CREATED_DT_DESC,
      label: 'by creation date (New → Old)',
    },
    {
      value: CREATED_DT_ASC,
      label: 'by creation date (Old → New)',
    },
    {
      value: SALES_PRICE_DESC,
      label: 'by price (High → Low)',
    },
    {
      value: SALES_PRICE_ASC,
      label: 'by price (Low → High)',
    },
  ];

  constructor(private router: Router) {}

  navigateTo(url: string): void {
    console.log(url);
    this.router.navigate([url]);
  }

  loadData(pagination: PaginatedDeviceListRequestInterface) {
    this.loadData$.emit(pagination);
  }

  // the order of categories is important
  tabChange(tabChangeEvent: MatTabChangeEvent): void {
    const category = this.categories[tabChangeEvent.index];
    this.loadData({
      pagination: {
        currentPage: 1,
        categoryId: category.id,
      },
    });
  }

  cardClick(id: number): void {
    this.router.navigate(['/orders', id]);
  }

  changePage(page: number): void {
    this.loadData({
      pagination: {
        currentPage: page,
      },
    });
  }

  changeOrdering(selectChange: MatSelectChange): void {
    const ordering = selectChange.value;
    this.loadData({
      pagination: {
        ordering,
        currentPage: 1,
      },
    });
  }

  ngOnInit(): void {}
}
