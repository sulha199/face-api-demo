import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceYawComponent } from './face-yaw.component';

describe('FaceYawComponent', () => {
  let component: FaceYawComponent;
  let fixture: ComponentFixture<FaceYawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaceYawComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceYawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
