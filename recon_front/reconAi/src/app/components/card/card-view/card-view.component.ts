import { DeleteCardDialogComponent } from './delete-card-dialog/delete-card-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'recon-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.less'],
})
export class CardViewComponent implements OnInit {
  @Input() brand = '';
  @Input() expired = '';
  @Input() last4 = '';
  @Input() id = '';
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  deleteCard(): void {
    this.dialog.open(DeleteCardDialogComponent, {
      data: {
        last4: this.last4,
        id: this.id,
      },
      height: '200px',
      width: '460px',
    });
  }
}
