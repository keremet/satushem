import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalJoinToJointPurchaseComponent } from './modal-join-to-joint-purchase.component';

describe('ModalJoinToJointPurchaseComponent', () => {
  let component: ModalJoinToJointPurchaseComponent;
  let fixture: ComponentFixture<ModalJoinToJointPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalJoinToJointPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalJoinToJointPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
