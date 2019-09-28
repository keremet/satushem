import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryNestedChooserComponent } from './category-nested-chooser.component';

describe('CategoryNestedChooserComponent', () => {
  let component: CategoryNestedChooserComponent;
  let fixture: ComponentFixture<CategoryNestedChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryNestedChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryNestedChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
