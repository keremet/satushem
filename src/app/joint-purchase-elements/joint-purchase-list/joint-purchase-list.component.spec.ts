import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JointPurchaseListComponent } from './joint-purchase-list.component';

describe('JointPurchaseListComponent', () => {
  let component: JointPurchaseListComponent;
  let fixture: ComponentFixture<JointPurchaseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JointPurchaseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JointPurchaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
