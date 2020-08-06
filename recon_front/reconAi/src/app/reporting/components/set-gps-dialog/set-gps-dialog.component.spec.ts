import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetGpsDialogComponent } from './set-gps-dialog.component';

describe('SetGpsDialogComponent', () => {
  let component: SetGpsDialogComponent;
  let fixture: ComponentFixture<SetGpsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetGpsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetGpsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
