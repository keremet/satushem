import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberChooserComponent } from './member-chooser.component';

describe('MemberChooserComponent', () => {
  let component: MemberChooserComponent;
  let fixture: ComponentFixture<MemberChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
