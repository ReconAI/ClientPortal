import { Component, OnInit } from '@angular/core';
import { AddUserInterface } from 'app/users/constants';

@Component({
  selector: 'recon-add-user-dialog-container',
  templateUrl: './add-user-dialog.container.html',
})
export class AddUserDialogContainer implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  submitAddUser(user: AddUserInterface): void {
    console.log(user);
  }
}
