import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalResetPasswordComponent } from './modal-reset-password.component';

describe('ModalResetPasswordComponent', () => {
  let component: ModalResetPasswordComponent;
  let fixture: ComponentFixture<ModalResetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalResetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
