import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentBranchComponent } from './comment-branch.component';

describe('CommentBranchComponent', () => {
  let component: CommentBranchComponent;
  let fixture: ComponentFixture<CommentBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
