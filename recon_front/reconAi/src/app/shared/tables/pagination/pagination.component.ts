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
export class PaginationComponent implements OnChanges {
  constructor() {}
  @Input() totalCount = 0;
  @Input() currentPage = 0;
  @Input() pageSize = 0;

  @Output() changePage$ = new EventEmitter<number>();

  start = 0;
  end = 0;
  startDisabled = false;
  endDisabled = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.totalCount || changes.currentPage || changes.pageSize) {
      if (this.isStart()) {
        this.startDisabled = true;
      } else {
        this.startDisabled = false;
      }
      this.start = (this.currentPage - 1) * this.pageSize + 1;
      this.end = Math.min(this.currentPage * this.pageSize, this.totalCount);
      if (this.isEnd()) {
        this.endDisabled = true;
      } else {
        this.endDisabled = false;

      }
    }
  }

  isEnd() {
    return this.end === this.totalCount;
  }

  isStart() {
    return this.currentPage === 1;
  }

  get label(): string {
    if (this.currentPage) {
      return `${this.start} - ${this.end} of ${this.totalCount}`;
    }

    return '';
  }

  selectPage(page: number, isNext: boolean): void {
    if (this.currentPage !== page) {
      if (isNext ? !this.isEnd() : !this.isStart()) {
        this.changePage$.emit(page);
      }
    }
  }
}
