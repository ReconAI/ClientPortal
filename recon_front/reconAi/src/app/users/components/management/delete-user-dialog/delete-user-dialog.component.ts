import { DeleteUserDialogInterface } from './../../../constants/types/user';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'recon-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.less'],
})
export class DeleteUserDialogComponent implements OnInit {
  id: string;
  name: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteUserDialogInterface) {
    this.id = data.id;
    this.name = data.name;
  }

  ngOnInit(): void {}
}
