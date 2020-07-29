import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedPaymentDialogComponent } from './finished-payment-dialog.component';

describe('FinishedPaymentDialogComponent', () => {
  let component: FinishedPaymentDialogComponent;
  let fixture: ComponentFixture<FinishedPaymentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishedPaymentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishedPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
