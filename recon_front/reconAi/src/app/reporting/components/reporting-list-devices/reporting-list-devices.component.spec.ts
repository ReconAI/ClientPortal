import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingListDevicesComponent } from './reporting-list-devices.component';

describe('ReportingListDevicesComponent', () => {
  let component: ReportingListDevicesComponent;
  let fixture: ComponentFixture<ReportingListDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingListDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingListDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
