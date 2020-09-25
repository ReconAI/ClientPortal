import {
  Component,
  OnInit,
  Input,
  Self,
  Optional,
  Output,
  EventEmitter,
} from '@angular/core';
import { v4 as uuid } from 'uuid';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'recon-filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.less'],
})
export class FilterInputComponent implements OnInit, ControlValueAccessor {
  constructor(@Optional() @Self() public controlDir: NgControl) {
    controlDir.valueAccessor = this;
  }

  value: string;
  uniqueId: string;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() isWithSearchIcon = false;
  @Input() autocompleteOptions: string[] = [];
  @Input() isInvalid = false;
  @Output() changeVal = new EventEmitter<string>();
  @Output() blurVal = new EventEmitter<string>();

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: string) {
    this.value = value || '';

    // this.onChange(this.value);
    // this.changeVal.emit(this.value);
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  changeValue(value: string): void {
    this.value = value;
    this.onChange(value);
    this.changeVal.emit(value);
  }

  blurValue(): void {
    this.onTouched();
    this.blurVal.emit(this.value);
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get hasErrors() {
    return (
      this.controlDir.control &&
      this.controlDir.control.touched &&
      this.controlDir.control.errors
    );
  }

  ngOnInit(): void {}
}
