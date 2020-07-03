import { Component, OnInit, Input } from '@angular/core';
import { CrudTableColumn } from 'app/shared/types';

@Component({
  selector: 'recon-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.less'],
})
export class CrudTableComponent implements OnInit {
  @Input() data = [];

  // type
  @Input() columns: CrudTableColumn[] = [];
  @Input() isWithActions = true;

  constructor() {}

  // pagination config
  readonly pageSize = 5;
  readonly countShownPages = 3;
  currentPage = 1;
  pagesCount: number;
  totalCount: number;
  shownPages: number[] = [];

  columnsIds: string[] = [];

  selectPage(page: number): void {
    if (this.currentPage !== page) {
      this.currentPage = page;
      this.shownPages = this.calculatePaginationPages();
    }
  }

  // types
  // TO DO: add ngTemplateOutlet supporting if we need it
  // https://stackblitz.com/edit/angular-zfhohe-5rvhci?file=cards%2Fcards.component.ts
  renderElement(column, element: any): string {
    if (column.render) {
      return column.render(element);
    }

    return element[column.id];
  }

  calculatePaginationPages(): number[] {
    if (this.currentPage < this.countShownPages) {
      return Array(Math.min(this.pagesCount, this.countShownPages))
        .fill(0)
        .map((_, i) => i + 1);
    }

    if (this.currentPage <= this.pagesCount - this.countShownPages) {
      const middleElement = Math.floor(this.countShownPages / 2);
      return Array(this.countShownPages)
        .fill(0)
        .map((_, i) => i - middleElement + this.currentPage);
    }

    return Array(this.countShownPages)
      .fill(0)
      .map((_, i) => this.pagesCount - this.countShownPages + i + 1);
  }

  ngOnInit(): void {
    this.totalCount = this.data.length;
    this.pagesCount = Math.ceil(this.data.length / this.pageSize);
    this.shownPages = this.calculatePaginationPages();

    this.columnsIds = this.columns.map(({ id }) => id);

    // add actions to update and delete
    if (this.isWithActions) {
      // create constant
      this.columnsIds.push('actions');
    }
  }
}
