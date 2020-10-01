import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadPurchasePdfComponent } from './download-purchase-pdf.component';

describe('DownloadPurchasePdfComponent', () => {
  let component: DownloadPurchasePdfComponent;
  let fixture: ComponentFixture<DownloadPurchasePdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadPurchasePdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadPurchasePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
