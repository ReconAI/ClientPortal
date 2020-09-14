import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorAdditionalInfoComponent } from './sensor-additional-info.component';

describe('SensorAdditionalInfoComponent', () => {
  let component: SensorAdditionalInfoComponent;
  let fixture: ComponentFixture<SensorAdditionalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorAdditionalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorAdditionalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
