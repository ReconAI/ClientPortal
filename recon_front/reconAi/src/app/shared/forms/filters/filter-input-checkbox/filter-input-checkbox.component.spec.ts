import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterInputCheckboxComponent } from './filter-input-checkbox.component';

describe('FilterInputCheckboxComponent', () => {
  let component: FilterInputCheckboxComponent;
  let fixture: ComponentFixture<FilterInputCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterInputCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterInputCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
