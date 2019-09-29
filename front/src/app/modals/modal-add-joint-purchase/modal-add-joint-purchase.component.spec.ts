import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddJointPurchaseComponent } from './modal-add-joint-purchase.component';

describe('ModalAddJointPurchaseComponent', () => {
  let component: ModalAddJointPurchaseComponent;
  let fixture: ComponentFixture<ModalAddJointPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddJointPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddJointPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
