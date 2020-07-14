import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFileWithListComponent } from './form-file-with-list.component';

describe('FormFileWithListComponent', () => {
  let component: FormFileWithListComponent;
  let fixture: ComponentFixture<FormFileWithListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormFileWithListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFileWithListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
