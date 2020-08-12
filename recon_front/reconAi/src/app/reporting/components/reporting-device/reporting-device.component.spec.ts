import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingDeviceComponent } from './reporting-device.component';

describe('ReportingDeviceComponent', () => {
  let component: ReportingDeviceComponent;
  let fixture: ComponentFixture<ReportingDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
