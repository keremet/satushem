import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JointPurchasesComponent } from './joint-purchases.component';

describe('JointPurchasesComponent', () => {
  let component: JointPurchasesComponent;
  let fixture: ComponentFixture<JointPurchasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JointPurchasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JointPurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
