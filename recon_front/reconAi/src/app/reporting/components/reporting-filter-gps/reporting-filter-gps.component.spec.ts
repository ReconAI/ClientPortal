import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingFilterGpsComponent } from './reporting-filter-gps.component';

describe('ReportingFilterGpsComponent', () => {
  let component: ReportingFilterGpsComponent;
  let fixture: ComponentFixture<ReportingFilterGpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingFilterGpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingFilterGpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
