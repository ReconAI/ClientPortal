import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineStreamingComponent } from './online-streaming.component';

describe('OnlineStreamingComponent', () => {
  let component: OnlineStreamingComponent;
  let fixture: ComponentFixture<OnlineStreamingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineStreamingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineStreamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
