import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalCategoryNodeComponent } from './internal-category-node.component';

describe('InternalCategoryNodeComponent', () => {
  let component: InternalCategoryNodeComponent;
  let fixture: ComponentFixture<InternalCategoryNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalCategoryNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalCategoryNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
