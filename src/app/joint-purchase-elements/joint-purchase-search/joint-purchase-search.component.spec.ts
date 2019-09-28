import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JointPurchaseSearchComponent } from './joint-purchase-search.component';

describe('JointPurchaseSearchComponent', () => {
  let component: JointPurchaseSearchComponent;
  let fixture: ComponentFixture<JointPurchaseSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JointPurchaseSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JointPurchaseSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
