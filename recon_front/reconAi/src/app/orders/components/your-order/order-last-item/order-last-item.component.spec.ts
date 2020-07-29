import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderLastItemComponent } from './order-last-item.component';

describe('OrderLastItemComponent', () => {
  let component: OrderLastItemComponent;
  let fixture: ComponentFixture<OrderLastItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderLastItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderLastItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
