import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTwoInputsCheckboxComponent } from './filter-two-inputs-checkbox.component';

describe('FilterTwoInputsCheckboxComponent', () => {
  let component: FilterTwoInputsCheckboxComponent;
  let fixture: ComponentFixture<FilterTwoInputsCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterTwoInputsCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTwoInputsCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
