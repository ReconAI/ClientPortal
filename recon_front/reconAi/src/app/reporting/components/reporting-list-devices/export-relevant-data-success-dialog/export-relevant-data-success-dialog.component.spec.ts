import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportRelevantDataSuccessDialogComponent } from './export-relevant-data-success-dialog.component';

describe('ExportRelevantDataSuccessDialogComponent', () => {
  let component: ExportRelevantDataSuccessDialogComponent;
  let fixture: ComponentFixture<ExportRelevantDataSuccessDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportRelevantDataSuccessDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportRelevantDataSuccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
