import { TestBed, inject } from '@angular/core/testing';

import { JointPurchaseSearchService } from './joint-purchase-search.service';

describe('JointPurchaseSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JointPurchaseSearchService]
    });
  });

  it('should be created', inject([JointPurchaseSearchService], (service: JointPurchaseSearchService) => {
    expect(service).toBeTruthy();
  }));
});
