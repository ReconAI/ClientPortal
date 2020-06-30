import {
  Component,
  OnInit,
  Input,
  Self,
  ViewChild,
  ElementRef,
  Optional,
  Output,
  EventEmitter,
} from '@angular/core';
import { v4 as uuid } from 'uuid';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'recon-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.less'],
  providers: [],
})
export class FormInputComponent implements ControlValueAccessor, OnInit {
  constructor(@Optional() @Self() public controlDir: NgControl) {
    controlDir.valueAccessor = this;
  }

  @ViewChild('input') input: ElementRef;

  value: string;
  uniqueId: string;

  @Input() label = '';
  @Input() placeholder = '';
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() disabled = false;
  @Input() showRequiredSymbol = false;
  // add types
  @Input() fieldType = 'text';
  @Output() changeVal = new EventEmitter<any>();

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: string) {
    this.value = value;

    this.onChange(this.value);
    this.changeVal.emit(this.value);
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
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

  ngOnInit() {
    this.uniqueId = uuid();
  }
}
