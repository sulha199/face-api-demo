import { TestBed } from '@angular/core/testing';

import { FaceService } from './face-service.service';

describe('FaceServiceService', () => {
  let service: FaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
