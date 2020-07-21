import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightInfoPartBlockComponent } from './right-info-part-block.component';

describe('RightInfoPartBlockComponent', () => {
  let component: RightInfoPartBlockComponent;
  let fixture: ComponentFixture<RightInfoPartBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightInfoPartBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightInfoPartBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
