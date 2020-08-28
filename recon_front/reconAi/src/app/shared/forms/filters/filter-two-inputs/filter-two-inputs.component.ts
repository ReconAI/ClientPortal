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

export interface FilterTwoInputsInterface {
  left: string;
  right: string;
}

@Component({
  selector: 'recon-filter-two-inputs',
  templateUrl: './filter-two-inputs.component.html',
  styleUrls: ['./filter-two-inputs.component.less'],
})
export class FilterTwoInputsComponent implements OnInit {
  left = '';
  right = '';
  @Input() disabled = false;
  @Output() changeVal = new EventEmitter<FilterTwoInputsInterface>();
  @Output() blurVal = new EventEmitter<FilterTwoInputsInterface>();

  @Input() leftPlaceholder = '';
  @Input() rightPlaceholder = '';

  @Input() label = '';

  constructor(@Optional() @Self() public controlDir: NgControl) {
    controlDir.valueAccessor = this;
  }

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: FilterTwoInputsInterface) {
    this.left = value.left;
    this.right = value.right;

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

  changeValue(): void {
    const newValue = {
      left: this.left,
      right: this.right,
    };

    this.onChange(newValue);
    this.changeVal.emit(newValue);
  }

  blurValue(): void {
    this.blurVal.emit({
      left: this.left,
      right: this.right,
    });
  }

  ngOnInit(): void {}
}
