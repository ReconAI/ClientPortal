import { SetGpsDialogComponent } from './../set-gps-dialog/set-gps-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'recon-reporting-list-devices',
  templateUrl: './reporting-list-devices.component.html',
  styleUrls: ['./reporting-list-devices.component.less'],
})
export class ReportingListDevicesComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openDialog(): void {
    this.dialog.open(SetGpsDialogComponent, {
      width: '430px',
    });
  }
}
