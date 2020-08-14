import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRangePickerComponent } from './form-range-picker.component';

describe('FormRangePickerComponent', () => {
  let component: FormRangePickerComponent;
  let fixture: ComponentFixture<FormRangePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormRangePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
