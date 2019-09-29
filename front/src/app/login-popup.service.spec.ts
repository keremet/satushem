import { TestBed, inject } from '@angular/core/testing';

import { LoginPopupService } from './login-popup.service';

describe('LoginPopupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginPopupService]
    });
  });

  it('should be created', inject([LoginPopupService], (service: LoginPopupService) => {
    expect(service).toBeTruthy();
  }));
});
