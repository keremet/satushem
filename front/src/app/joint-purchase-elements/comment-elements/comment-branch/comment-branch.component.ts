import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommentModel} from '../comment-model';
import {CommentSettings} from '../comment-settings';
import {RestApiService} from '../../../rest-api.service';
import {DataService} from '../../../data.service';

@Component({
  selector: 'app-comment-branch',
  templateUrl: './comment-branch.component.html',
  styleUrls: ['./comment-branch.component.scss']
})
export class CommentBranchComponent implements OnInit {

  @Input('comment')
  comment: CommentModel;

  @Input('parent')
  parent: string;

  @Input('level')
  level: number;

  @Input('settings')
  settings: CommentSettings = {
    creatorLogin: null,
    canReply: false
  };

  @Output('commentSent')
  commentSent = new EventEmitter();

  replyVisible = false;

  constructor(
    private rest: RestApiService,
    private data: DataService
  ) { }

  ngOnInit() { }

  onSend() {
    this.replyVisible = false;
    this.commentSent.emit();
  }

  get currentUser(): any {
    return this.data.user || {};
  }

  get isLoggedIn(): boolean {
    return !!this.data.user;
  }

}
