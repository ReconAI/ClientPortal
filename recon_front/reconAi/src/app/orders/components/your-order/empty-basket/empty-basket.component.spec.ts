import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyBasketComponent } from './empty-basket.component';

describe('EmptyBasketComponent', () => {
  let component: EmptyBasketComponent;
  let fixture: ComponentFixture<EmptyBasketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyBasketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyBasketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
