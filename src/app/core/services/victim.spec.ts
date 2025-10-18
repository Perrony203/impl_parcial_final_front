import { TestBed } from '@angular/core/testing';

import { Victim } from './victim';

describe('Victim', () => {
  let service: Victim;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Victim);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
