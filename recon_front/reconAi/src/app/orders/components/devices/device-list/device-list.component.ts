import {
  CREATED_DT_ASC,
  CREATED_DT_DESC,
  SALES_PRICE_DESC,
  SALES_PRICE_ASC,
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

interface Pagination {
  page?: number;
  ordering?: string;
  categoryId?: number;
}

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
  @Output() loadData$ = new EventEmitter<PaginatedDeviceListRequestInterface>();

  ordering = CREATED_DT_DESC;
  page = 1;
  selectedCategory = 0;
  sortOptions = [
    {
      value: CREATED_DT_DESC,
      label: 'New',
    },
    {
      value: CREATED_DT_ASC,
      label: 'Old',
    },
    {
      value: SALES_PRICE_DESC,
      label: 'High price',
    },
    {
      value: SALES_PRICE_ASC,
      label: 'Low price',
    },
  ];

  constructor(private router: Router) {}

  navigateTo(url: string): void {
    this.router.navigate([url]);
  }

  loadData() {
    this.loadData$.emit({
      page: this.page,
      ordering: this.ordering,
      categoryId: this.selectedCategory,
    });
  }

  // the order of categories is important
  tabChange(tabChangeEvent: MatTabChangeEvent): void {
    const category = this.categories[tabChangeEvent.index];
    this.page = 1;
    this.selectedCategory = category.id;
    this.loadData();
  }

  changePage(page: number): void {
    this.page = page;
    this.loadData();
  }

  changeOrdering(selectChange: MatSelectChange): void {
    this.ordering = selectChange.value;
    this.page = 1;
    this.loadData();
  }

  ngOnInit(): void {}
}
