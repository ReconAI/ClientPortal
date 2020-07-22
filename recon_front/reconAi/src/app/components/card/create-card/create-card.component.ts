import { CreateCardDialogComponent } from './create-card-dialog/create-card-dialog.component';

import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';

@Component({
  selector: 'recon-create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.less'],
})
export class CreateCardComponent {
  constructor(private dialog: MatDialog) {}

  openDialog(): void {
    this.dialog.open(CreateCardDialogComponent, {
      width: '460px',
      height: '230px',
    });
  }
}
