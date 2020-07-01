import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'recon-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<LoginModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // change
  ) {}

  ngOnInit(): void {}
}
