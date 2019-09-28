import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryNestedListComponent } from './category-nested-list.component';

describe('CategoryNestedListComponent', () => {
  let component: CategoryNestedListComponent;
  let fixture: ComponentFixture<CategoryNestedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryNestedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryNestedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
