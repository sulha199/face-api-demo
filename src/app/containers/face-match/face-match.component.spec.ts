import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceMatchComponent } from './face-match.component';

describe('FaceMatchComponent', () => {
  let component: FaceMatchComponent;
  let fixture: ComponentFixture<FaceMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaceMatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
