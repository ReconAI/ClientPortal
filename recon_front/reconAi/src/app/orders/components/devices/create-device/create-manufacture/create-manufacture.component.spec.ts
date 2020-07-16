import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateManufactureComponent } from './create-manufacture.component';

describe('CreateManufactureComponent', () => {
  let component: CreateManufactureComponent;
  let fixture: ComponentFixture<CreateManufactureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateManufactureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateManufactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
