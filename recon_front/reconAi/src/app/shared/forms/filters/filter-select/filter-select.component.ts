import { NgControl } from '@angular/forms';
import { ReconSelectOption } from 'app/shared/types';
import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  Self,
  Optional,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'recon-filter-select',
  templateUrl: './filter-select.component.html',
  styleUrls: ['./filter-select.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class FilterSelectComponent implements OnInit {
  constructor(@Optional() @Self() public controlDir: NgControl) {
    controlDir.valueAccessor = this;
  }

  selectedOption: ReconSelectOption;
  @Input() label = '';
  @Input() options: ReconSelectOption[] = [];
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() isInvalid = false;
  @Output() changeVal = new EventEmitter<any>();

  isActive = false;

  ngOnInit(): void {}

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: string) {
    this.selectedOption = this.options.find(
      (option) => option?.value?.toString() === value?.toString()
    );

    // this.onChange(this.selectedOption?.value || '');
    // this.changeVal.emit(this.selectedOption?.value || '');
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

  optionClick(option: ReconSelectOption) {
    this.selectedOption = option;
    this.onChange(this.selectedOption.value);
    this.changeVal.emit(this.selectedOption.value);
    this.isActive = false;
  }

  headerClick() {
    this.isActive = true;
  }

  get headerLabel(): string {
    return (
      this.selectedOption?.label?.toString() ||
      this.placeholder ||
      'Choose an option'
    );
  }
}
