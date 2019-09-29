import { TestBed, inject } from '@angular/core/testing';

import { SearchFieldService } from './search-field.service';

describe('SearchFieldService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchFieldService]
    });
  });

  it('should be created', inject([SearchFieldService], (service: SearchFieldService) => {
    expect(service).toBeTruthy();
  }));
});
