import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeekToSideDetectorComponent } from './peek-to-side-detector.component';

describe('PeekToSideDetectorComponent', () => {
  let component: PeekToSideDetectorComponent;
  let fixture: ComponentFixture<PeekToSideDetectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeekToSideDetectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeekToSideDetectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
