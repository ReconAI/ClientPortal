import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Input } from '@angular/core';
import { DeleteDeviceDialogComponent } from './delete-device-dialog/delete-device-dialog.component';

@Component({
  selector: 'recon-device-item',
  templateUrl: './device-item.component.html',
  styleUrls: ['./device-item.component.less'],
})
export class DeviceItemComponent implements OnInit {
  @Input() imgUrl;
  @Input() price;
  @Input() name;
  @Input() id: number;
  @Input() showActions = false;
  constructor(private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {}

  deleteClick() {
    this.dialog.open(DeleteDeviceDialogComponent, {
      data: {
        id: this.id,
      },
    });
  }

  editClick() {
    this.router.navigate(['orders/update-device', this.id]);
  }
}
