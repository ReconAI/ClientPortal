import { FormBuilder, FormGroup, NgControl } from '@angular/forms';
import { ReconSelectOption } from './../../../types/recon-select';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectorRef,
  Optional,
  Self,
} from '@angular/core';

@Component({
  selector: 'recon-filter-multi-select',
  templateUrl: './filter-multi-select.component.html',
  styleUrls: ['./filter-multi-select.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class FilterMultiSelectComponent implements OnInit {
  constructor(
    @Optional() @Self() public controlDir: NgControl,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    controlDir.valueAccessor = this;
  }

  selectedOption: ReconSelectOption;
  isWithValue = false;
  selectedForm: FormGroup;
  @Input() label = '';
  @Input() options: ReconSelectOption[] = [];
  @Input() placeholder = '';
  @Input() disabled = false;
  @Output() changeVal = new EventEmitter<any>();

  isActive = false;

  ngOnInit(): void {}

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(selectedOptions: string[] = []) {
    this.selectedForm = this.fb.group({
      options: this.fb.array([
        ...this.options.map(({ value }) =>
          this.fb.group({
            value,
            checked: !!selectedOptions?.includes(value),
          })
        ),
      ]),
    });

    this.isWithValue = !!selectedOptions;
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

  optionClick() {
    const checkedOptions = this.selectedForm.value.options
      ?.filter(({ checked }) => checked)
      ?.map(({ value }) => value);

    this.isWithValue = !!checkedOptions?.length;

    this.onChange(checkedOptions);
    this.changeVal.emit(checkedOptions);
    this.isActive = false;
  }

  headerClick() {
    this.isActive = true;
  }

  toggleSelectValueWithIndex(i: number): void {
    const control = this.selectedForm.get(`options.${i}.checked`);
    control.setValue(!control.value);
  }

  setSelectValueWithIndex(i: number, value: boolean): void {
    const control = this.selectedForm.get(`options.${i}.checked`);
    control.setValue(value);
  }

  get headerLabel(): string {
    const title =
      this?.options
        ?.filter((_, i) => this.selectedForm.value.options[i].checked)
        ?.map(({ label }) => label)
        ?.join(', ')
        ?.slice(0, 14) || '';
    return title?.length >= 14 ? title + '...' : title || 'Choose options';
  }
}
