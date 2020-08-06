import { NgControl, ControlValueAccessor } from '@angular/forms';
import {
  Component,
  OnInit,
  Optional,
  Self,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'recon-form-slider',
  templateUrl: './form-slider.component.html',
  styleUrls: ['./form-slider.component.less'],
})
export class FormSliderComponent implements ControlValueAccessor, OnInit {
  checked = false;
  @Output() changeVal = new EventEmitter<boolean>();

  constructor(@Optional() @Self() public controlDir: NgControl) {
    controlDir.valueAccessor = this;
  }
  @Input() label = '';
  @Input() disabled = false;

  onChange = (value: any) => {};
  onTouched = () => {};
  ngOnInit(): void {}

  writeValue(value: boolean) {
    this.checked = !!value;

    this.onChange(this.checked);
    this.changeVal.emit(this.checked);
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
}
