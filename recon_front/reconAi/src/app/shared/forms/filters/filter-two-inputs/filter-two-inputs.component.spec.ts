import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTwoInputsComponent } from './filter-two-inputs.component';

describe('FilterTwoInputsComponent', () => {
  let component: FilterTwoInputsComponent;
  let fixture: ComponentFixture<FilterTwoInputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterTwoInputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTwoInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
