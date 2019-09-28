import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGoodPurchaseChooserComponent } from './modal-good-purchase-chooser.component';

describe('ModalGoodPurchaseChooserComponent', () => {
  let component: ModalGoodPurchaseChooserComponent;
  let fixture: ComponentFixture<ModalGoodPurchaseChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGoodPurchaseChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGoodPurchaseChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
