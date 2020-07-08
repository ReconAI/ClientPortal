import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  DoCheck,
  SimpleChanges,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'recon-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.less'],
})
export class PaginationComponent implements OnInit, OnChanges {
  constructor() {}
  @Input() totalCount: number;
  @Input() currentPage: number;

  @Output() changePage$ = new EventEmitter<number>();

  @Input() pageSize;
  readonly countShownPages = 3;
  pagesCount: number;
  shownPages: number[] = [];

  ngOnInit(): void {
    this.pagesCount = Math.ceil(this.totalCount / this.pageSize || 1);
    this.shownPages = this.calculatePaginationPages();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.totalCount || changes.shownPages || changes.currentPage) {
      this.pagesCount = Math.ceil(this.totalCount / this.pageSize || 1);
      this.shownPages = this.calculatePaginationPages();
    }
  }

  selectPage(page: number): void {
    if (this.currentPage !== page) {
      this.changePage$.emit(page);
      this.shownPages = this.calculatePaginationPages();
    }
  }

  calculatePaginationPages(): number[] {
    if (this.currentPage < this.countShownPages) {
      return Array(Math.min(this.pagesCount, this.countShownPages))
        .fill(0)
        .map((_, i) => i + 1);
    }

    if (this.currentPage <= this.pagesCount - this.countShownPages + 1) {
      const middleElement = Math.floor(this.countShownPages / 2);
      return Array(this.countShownPages)
        .fill(0)
        .map((_, i) => i - middleElement + this.currentPage);
    }

    return Array(this.countShownPages)
      .fill(0)
      .map((_, i) => this.pagesCount - this.countShownPages + i + 1);
  }
}
