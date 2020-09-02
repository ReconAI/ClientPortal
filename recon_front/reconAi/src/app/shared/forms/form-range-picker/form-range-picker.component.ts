import { NgControl } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Optional,
  Self,
} from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'recon-form-range-picker',
  templateUrl: './form-range-picker.component.html',
  styleUrls: ['./form-range-picker.component.less'],
})
export class FormRangePickerComponent implements OnInit {
  start: Date;
  end: Date;

  startTimeHours = '00';
  startTimeMinutes = '00';
  endTimeHours = '00';
  endTimeMinutes = '00';

  @Input() label = '';
  @Input() disabled = false;
  @Output() changeVal = new EventEmitter<any>();

  constructor(@Optional() @Self() public controlDir: NgControl) {
    controlDir.valueAccessor = this;
  }

  ngOnInit(): void {}

  onChange = (value: any) => {};
  onTouched = () => {};

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value) {
    this.start = value.start || null;
    this.end = value.end || null;

    this.startTimeHours = this.getTimeHoursPresentation(this.start);
    this.startTimeMinutes = this.getTimeMinutesPresentation(this.start);
    this.endTimeHours = this.getTimeHoursPresentation(this.end);
    this.endTimeMinutes = this.getTimeMinutesPresentation(this.end);
    // this.onChange(value);
    // this.changeVal.emit(value);
  }

  handleChanges(type: string, value): void {
    // it's used not to send not valid changes
    if (type === 'start') {
      this.start = value;
    }
    if (type === 'end') {
      this.end = value;
    }

    this.onChange({
      start: moment(this.start),
      end: moment(this.end),
    });
    this.changeVal.emit({
      start: moment(this.start),
      end: moment(this.end),
    });
    this.startTimeHours = this.getTimeHoursPresentation(this.start);
    this.startTimeMinutes = this.getTimeMinutesPresentation(this.start);
    this.endTimeHours = this.getTimeHoursPresentation(this.end);
    this.endTimeMinutes = this.getTimeMinutesPresentation(this.end);
    // }
  }

  closedStream(): void {
    if (!this.end) {
      this.end = new Date();
      this.endTimeHours = this.getTimeHoursPresentation(this.end);
      this.endTimeMinutes = this.getTimeMinutesPresentation(this.end);

      this.onChange({
        start: moment(this.start),
        end: moment(this.end),
      });
      this.changeVal.emit({
        start: moment(this.start),
        end: moment(this.end),
      });
    }
  }

  formatTime(value: string, type = 'hours') {
    const intValue = +value;

    if (
      !intValue ||
      intValue < 0 ||
      (type === 'hours' && intValue > 23) ||
      (type === 'minutes' && intValue > 59)
    ) {
      return '00';
    }

    if (intValue < 10) {
      return `0${intValue}`;
    }

    return value;
  }

  changeTime(type: string, value: string): void {
    if (type === 'start.hours') {
      this.startTimeHours = this.formatTime(value, 'hours');
    }
    if (type === 'start.minutes') {
      this.startTimeMinutes = this.formatTime(value, 'minutes');
    }
    if (type === 'end.hours') {
      this.endTimeHours = this.formatTime(value, 'hours');
    }
    if (type === 'end.minutes') {
      this.endTimeMinutes = this.formatTime(value, 'minutes');
    }
    this.start = new Date(
      `${moment(this.start).format('YYYY-MM-DD')} ${this.startTimeHours}:${
        this.startTimeMinutes
      }`
    );

    this.end = new Date(
      `${moment(this.end).format('YYYY-MM-DD')} ${this.endTimeHours}:${
        this.endTimeMinutes
      }`
    );

    this.onChange({
      start: moment(this.start),
      end: moment(this.end),
    });
    this.changeVal.emit({
      start: moment(this.start),
      end: moment(this.end),
    });
  }

  get startDateFormatted(): string {
    return this.getDatePresentation(this.start);
  }

  get endDateFormatted(): string {
    return this.getDatePresentation(this.end);
  }

  getDatePresentation(dateStr: Date): string {
    return (dateStr && moment(dateStr).format('YYYY.MM.DD')) || '';
  }

  getTimeHoursPresentation(dateStr: Date): string {
    return (dateStr && moment(dateStr).format('HH')) || '';
  }

  getTimeMinutesPresentation(dateStr: Date): string {
    return (dateStr && moment(dateStr).format('mm')) || '';
  }
}
