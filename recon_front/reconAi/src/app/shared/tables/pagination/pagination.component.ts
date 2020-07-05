import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'recon-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.less'],
})
export class PaginationComponent implements OnInit {
  constructor() {}
  @Input() totalCount: number;
  @Output() changePage = new EventEmitter<number>();

  readonly pageSize = 5;
  readonly countShownPages = 3;
  currentPage = 1;
  pagesCount: number;
  shownPages: number[] = [];

  ngOnInit(): void {
    this.pagesCount = Math.ceil(this.totalCount / this.pageSize);
    this.shownPages = this.calculatePaginationPages();
  }

  selectPage(page: number): void {
    if (this.currentPage !== page) {
      this.changePage.emit(page);
      this.currentPage = page;
      this.shownPages = this.calculatePaginationPages();
    }
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
    // bug 
    return Array(this.countShownPages)
      .fill(0)
      .map((_, i) => this.pagesCount - this.countShownPages + i + 1);
  }
}
