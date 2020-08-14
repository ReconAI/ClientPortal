import { Component, OnInit, Input } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'recon-form-range-picker',
  templateUrl: './form-range-picker.component.html',
  styleUrls: ['./form-range-picker.component.less'],
})
export class FormRangePickerComponent implements OnInit {
  start: string;
  end: string;
  @Input() label = '';
  constructor() {}

  ngOnInit(): void {}

  handleChanges(event): void {
    console.log(event);
  }

  getDatePresentation(dateStr: string): string {
    return (dateStr && moment(dateStr).format('YYYY.MM.DD')) || '';
  }

  getTimePresentation(dateStr: string): string {
    return (dateStr && moment(dateStr).format('HH:mm:ss')) || '';
  }
}
