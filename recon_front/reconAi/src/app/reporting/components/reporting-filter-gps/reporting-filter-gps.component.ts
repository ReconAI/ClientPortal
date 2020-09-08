import { NgControl, ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  SetBoundsDialogComponent,
  GpsFormClientInterface,
} from './set-bounds-dialog/set-bounds-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Optional,
  Self,
} from '@angular/core';

@Component({
  selector: 'recon-reporting-filter-gps',
  templateUrl: './reporting-filter-gps.component.html',
  styleUrls: ['./reporting-filter-gps.component.less'],
})
export class ReportingFilterGpsComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  closeDialogSubscriptions: Subscription[] = [];
  constructor(
    private dialog: MatDialog,
    @Optional() @Self() public controlDir: NgControl
  ) {
    controlDir.valueAccessor = this;
  }
  @Output() changeVal = new EventEmitter<GpsFormClientInterface>();

  topLeftLat: string;
  topLeftLng: string;
  bottomRightLat: string;
  bottomRightLng: string;

  ngOnInit(): void {}

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: GpsFormClientInterface) {
    this.handleChanges(value);
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  handleChanges(data: GpsFormClientInterface): void {
    this.topLeftLat = data.topLeft.lat;
    this.topLeftLng = data.topLeft.lng;
    this.bottomRightLat = data.bottomRight.lat;
    this.bottomRightLng = data.bottomRight.lng;

    this.onChange(data);
    this.changeVal.emit({
      topLeft: {
        lat: this.topLeftLat,
        lng: this.topLeftLng,
      },
      bottomRight: {
        lat: this.bottomRightLat,
        lng: this.bottomRightLng,
      },
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SetBoundsDialogComponent, {
      width: '600px',
    });

    const sendGpsSubscription = dialogRef.componentInstance.sendGps.subscribe(
      (data: GpsFormClientInterface) => {
        this.handleChanges(data);
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
