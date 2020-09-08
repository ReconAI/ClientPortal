import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetBoundsDialogComponent } from './set-bounds-dialog.component';

describe('SetBoundsDialogComponent', () => {
  let component: SetBoundsDialogComponent;
  let fixture: ComponentFixture<SetBoundsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetBoundsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetBoundsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
