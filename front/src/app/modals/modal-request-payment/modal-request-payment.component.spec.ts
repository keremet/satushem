import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRequestPaymentComponent } from './modal-request-payment.component';

describe('ModalRequestPaymentComponent', () => {
  let component: ModalRequestPaymentComponent;
  let fixture: ComponentFixture<ModalRequestPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRequestPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRequestPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
