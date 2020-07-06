import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CrudTableColumn } from 'app/shared/types';

@Component({
  selector: 'recon-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.less'],
})
export class CrudTableComponent implements OnInit {
  @Input() data = [];
  @Input() pageSize = 3;
  @Input() totalCount = 0;

  @Input() columns: CrudTableColumn[] = [];
  @Input() isWithActions = true;

  @Output() changePage$ = new EventEmitter<number>();
  constructor() {}
  columnsIds: string[] = [];

  // types
  // TO DO: add ngTemplateOutlet supporting if we need it
  // https://stackblitz.com/edit/angular-zfhohe-5rvhci?file=cards%2Fcards.component.ts
  renderElement(column, element: any): string {
    if (column.render) {
      return column.render(element);
    }

    return element[column.id];
  }

  changePage(page: number) {
    this.changePage$.emit(page);
  }

  ngOnInit(): void {
    this.columnsIds = this.columns.map(({ id }) => id);

    // add actions to update and delete
    if (this.isWithActions) {
      // create constant
      this.columnsIds.push('actions');
    }
  }
}
