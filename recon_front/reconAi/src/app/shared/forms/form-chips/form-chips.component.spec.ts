import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormChipsComponent } from './form-chips.component';

describe('FormChipsComponent', () => {
  let component: FormChipsComponent;
  let fixture: ComponentFixture<FormChipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormChipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
