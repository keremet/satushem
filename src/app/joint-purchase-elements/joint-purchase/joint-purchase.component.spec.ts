import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JointPurchaseComponent } from './joint-purchase.component';

describe('JointPurchaseComponent', () => {
  let component: JointPurchaseComponent;
  let fixture: ComponentFixture<JointPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JointPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JointPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
