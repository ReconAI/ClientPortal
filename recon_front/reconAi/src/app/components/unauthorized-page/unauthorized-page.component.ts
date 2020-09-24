import { LoginModalComponent } from './../login-modal/login-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'recon-unauthorized-page',
  templateUrl: './unauthorized-page.component.html',
  styleUrls: ['./unauthorized-page.component.less'],
})
export class UnauthorizedPageComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dialog.open(LoginModalComponent, {
      width: '460px',
      height: '410px',
      panelClass: 'login-modal',
      disableClose: true,
    });
  }
}
