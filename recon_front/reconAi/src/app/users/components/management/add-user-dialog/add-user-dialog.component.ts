import { AddUserInterface } from './../../../constants/types/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SERVER_USER_ROLES } from 'app/constants/types';

@Component({
  selector: 'recon-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.less'],
})
export class AddUserDialogComponent implements OnInit {
  @Output() submitAddUser$ = new EventEmitter<AddUserInterface>();
  constructor(private fb: FormBuilder) {}
  newUserForm: FormGroup;
  readonly USER_ROLES = SERVER_USER_ROLES;

  ngOnInit(): void {
    this.newUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  submitAddUser(): void {
    this.submitAddUser$.emit(this.newUserForm.value);
  }
}
