import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterMultiSelectComponent } from './filter-multi-select.component';

describe('FilterMultiSelectComponent', () => {
  let component: FilterMultiSelectComponent;
  let fixture: ComponentFixture<FilterMultiSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterMultiSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
