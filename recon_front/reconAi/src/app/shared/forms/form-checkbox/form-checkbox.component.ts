import { NgControl, ControlValueAccessor } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  Self,
  Optional,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'recon-form-checkbox',
  templateUrl: './form-checkbox.component.html',
  styleUrls: ['./form-checkbox.component.less'],
})
export class FormCheckboxComponent implements OnInit, ControlValueAccessor {
  @Input() label = '';
  @Input() checked = false;
  @Input() disabled = false;
  @Input() isInvalid = false;

  @Output() changeVal = new EventEmitter<boolean>();

  constructor(@Optional() @Self() public controlDir: NgControl) {
    controlDir.valueAccessor = this;
  }
  onChange = (value: any) => {};
  onTouched = () => {};
  ngOnInit(): void {}

  writeValue(value: boolean) {
    this.checked = !!value;

    // this.onChange(this.checked);
    // this.changeVal.emit(this.checked);
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

  changeStatus(checked: boolean): void {
    this.onChange(checked);
    this.changeVal.emit(checked);
  }
}
