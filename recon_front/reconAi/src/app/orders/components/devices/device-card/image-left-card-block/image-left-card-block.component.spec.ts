import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageLeftCardBlockComponent } from './image-left-card-block.component';

describe('ImageLeftCardBlockComponent', () => {
  let component: ImageLeftCardBlockComponent;
  let fixture: ComponentFixture<ImageLeftCardBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageLeftCardBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageLeftCardBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
