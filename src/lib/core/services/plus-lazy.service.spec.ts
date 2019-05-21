import { TestBed } from '@angular/core/testing';

import { PlusLazyService } from './plus-lazy.service';

describe('PlusLazyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlusLazyService = TestBed.get(PlusLazyService);
    expect(service).toBeTruthy();
  });
});
