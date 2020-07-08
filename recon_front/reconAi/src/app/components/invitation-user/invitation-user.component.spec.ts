import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationUserComponent } from './invitation-user.component';

describe('InvitationUserComponent', () => {
  let component: InvitationUserComponent;
  let fixture: ComponentFixture<InvitationUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
