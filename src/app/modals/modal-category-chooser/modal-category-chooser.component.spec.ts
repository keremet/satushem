import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCategoryChooserComponent } from './modal-category-chooser.component';

describe('ModalCategoryChooserComponent', () => {
  let component: ModalCategoryChooserComponent;
  let fixture: ComponentFixture<ModalCategoryChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCategoryChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCategoryChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
