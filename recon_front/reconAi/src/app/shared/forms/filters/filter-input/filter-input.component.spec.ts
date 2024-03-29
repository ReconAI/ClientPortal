import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterInputComponent } from './filter-input.component';

describe('FilerInputComponent', () => {
  let component: FilterInputComponent;
  let fixture: ComponentFixture<FilterInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterInputComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
