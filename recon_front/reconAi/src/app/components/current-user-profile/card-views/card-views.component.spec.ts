import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardViewsComponent } from './card-views.component';

describe('CardViewsComponent', () => {
  let component: CardViewsComponent;
  let fixture: ComponentFixture<CardViewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardViewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
