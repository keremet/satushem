import { TestBed, inject } from '@angular/core/testing';

import { JointPurchaseHistoryService } from './joint-purchase-history.service';

describe('JointPurchaseHistoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JointPurchaseHistoryService]
    });
  });

  it('should be created', inject([JointPurchaseHistoryService], (service: JointPurchaseHistoryService) => {
    expect(service).toBeTruthy();
  }));
});
