import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JointPurchaseCartComponent } from './joint-purchase-cart.component';

describe('JointPurchaseCartComponent', () => {
  let component: JointPurchaseCartComponent;
  let fixture: ComponentFixture<JointPurchaseCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JointPurchaseCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JointPurchaseCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
