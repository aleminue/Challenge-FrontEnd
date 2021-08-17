import { TestBed } from '@angular/core/testing';

import { FechasPromoService } from './fechas-promo.service';

describe('FechasPromoService', () => {
  let service: FechasPromoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FechasPromoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
