import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRequestEventComponent } from './modal-request-event.component';

describe('ModalRequestEventComponent', () => {
  let component: ModalRequestEventComponent;
  let fixture: ComponentFixture<ModalRequestEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRequestEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRequestEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
