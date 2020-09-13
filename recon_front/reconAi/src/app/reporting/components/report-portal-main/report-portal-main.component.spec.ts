import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPortalMainComponent } from './report-portal-main.component';

describe('ReportPortalMainComponent', () => {
  let component: ReportPortalMainComponent;
  let fixture: ComponentFixture<ReportPortalMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPortalMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPortalMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
