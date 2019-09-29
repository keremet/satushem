import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRegistrationComponent } from './modal-registration.component';

describe('RegistrationComponent', () => {
  let component: ModalRegistrationComponent;
  let fixture: ComponentFixture<ModalRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
