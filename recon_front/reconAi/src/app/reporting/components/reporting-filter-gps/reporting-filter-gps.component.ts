import { Subscription } from 'rxjs';
import {
  SetBoundsDialogComponent,
  GpsFormClientInterface,
} from './set-bounds-dialog/set-bounds-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'recon-reporting-filter-gps',
  templateUrl: './reporting-filter-gps.component.html',
  styleUrls: ['./reporting-filter-gps.component.less'],
})
export class ReportingFilterGpsComponent implements OnInit, OnDestroy {
  closeDialogSubscriptions: Subscription[] = [];
  constructor(private dialog: MatDialog) {}

  topLeftLat: string;
  topLeftLng: string;
  bottomRightLat: string;
  bottomRightLng: string;

  ngOnInit(): void {}

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: GpsFormClientInterface) {
    // this.value = value || '';

    // this.onChange(this.value);
    // this.changeVal.emit(this.value);
  }

  handleChanges(data: GpsFormClientInterface): void {
    this.topLeftLat = data.topLeft.lat;
    this.topLeftLng = data.topLeft.lng;
    this.bottomRightLat = data.bottomRight.lat;
    this.bottomRightLng = data.bottomRight.lng;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SetBoundsDialogComponent, {
      width: '600px',
    });

    const sendGpsSubscription = dialogRef.componentInstance.sendGps.subscribe(
      (data: GpsFormClientInterface) => {
        console.log(data, 'DATA');
      }
    );

    const closedSubscription = dialogRef.afterClosed().subscribe(() => {
      sendGpsSubscription.unsubscribe();
    });

    this.closeDialogSubscriptions.push(closedSubscription);
  }

  ngOnDestroy(): void {
    this.closeDialogSubscriptions.forEach((sub) => {
      sub?.unsubscribe();
    });
  }
}
