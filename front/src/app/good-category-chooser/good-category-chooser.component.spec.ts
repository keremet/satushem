import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodCategoryChooserComponent } from './good-category-chooser.component';

describe('GoodCategoryChooserComponent', () => {
  let component: GoodCategoryChooserComponent;
  let fixture: ComponentFixture<GoodCategoryChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodCategoryChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodCategoryChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
