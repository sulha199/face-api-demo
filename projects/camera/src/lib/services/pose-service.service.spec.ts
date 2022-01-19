import { TestBed } from '@angular/core/testing';

import { PoseServiceService } from './pose-service.service';

describe('PoseServiceService', () => {
  let service: PoseServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoseServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
