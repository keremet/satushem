import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementUnitChooserComponent } from './measurement-unit-chooser.component';

describe('MeasurementUnitChooserComponent', () => {
  let component: MeasurementUnitChooserComponent;
  let fixture: ComponentFixture<MeasurementUnitChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasurementUnitChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasurementUnitChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
