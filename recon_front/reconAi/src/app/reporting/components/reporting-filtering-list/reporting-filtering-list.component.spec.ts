import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingFilteringListComponent } from './reporting-filtering-list.component';

describe('ReportingFilteringListComponent', () => {
  let component: ReportingFilteringListComponent;
  let fixture: ComponentFixture<ReportingFilteringListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingFilteringListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingFilteringListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
