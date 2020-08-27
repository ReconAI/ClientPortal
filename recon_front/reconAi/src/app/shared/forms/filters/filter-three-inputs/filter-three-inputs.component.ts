import { NgControl } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  Optional,
  Self,
} from '@angular/core';

export interface FilterThreeInputsInterface {
  left: string;
  middle: string;
  right: string;
  checked: boolean;
}

@Component({
  selector: 'recon-filter-three-inputs',
  templateUrl: './filter-three-inputs.component.html',
  styleUrls: ['./filter-three-inputs.component.less'],
})
export class FilterThreeInputsComponent implements OnInit {
  constructor(@Optional() @Self() public controlDir: NgControl) {
    controlDir.valueAccessor = this;
  }

  left = '';
  middle = '';
  right = '';
  checked = false;
  @Input() disabled = false;
  @Output() changeVal = new EventEmitter<FilterThreeInputsInterface>();
  @Output() blurVal = new EventEmitter<FilterThreeInputsInterface>();

  @Input() leftPlaceholder = '';
  @Input() middlePlaceholder = '';
  @Input() rightPlaceholder = '';

  @Input() leftLabel = '';
  @Input() middleLabel = '';
  @Input() rightLabel = '';
  @Input() checkboxLabel = '';

  @Input() label = '';

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: FilterThreeInputsInterface) {
    this.left = value.left;
    this.middle = value.middle;
    this.right = value.right;
    this.checked = !!value.checked;

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
      middle: this.middle,
      right: this.right,
      checked: this.checked,
    };

    this.onChange(newValue);
    this.changeVal.emit(newValue);
  }

  blurValue(): void {
    this.onTouched();
    this.blurVal.emit({
      left: this.left,
      middle: this.middle,
      right: this.right,
      checked: this.checked,
    });
  }

  ngOnInit(): void {}
}
