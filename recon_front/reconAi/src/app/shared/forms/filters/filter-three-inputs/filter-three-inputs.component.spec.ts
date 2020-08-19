import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterThreeInputsComponent } from './filter-three-inputs.component';

describe('FilterThreeInputsComponent', () => {
  let component: FilterThreeInputsComponent;
  let fixture: ComponentFixture<FilterThreeInputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterThreeInputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterThreeInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
