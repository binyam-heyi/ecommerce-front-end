import { TestBed } from '@angular/core/testing';

import { CheckoutfromService } from './checkoutfrom.service';

describe('CheckoutfromService', () => {
  let service: CheckoutfromService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutfromService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
