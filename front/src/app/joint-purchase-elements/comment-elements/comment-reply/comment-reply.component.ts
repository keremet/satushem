import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommentModel} from '../comment-model';
import {ActivatedRoute} from '@angular/router';
import {RestApiService} from '../../../rest-api.service';
import {DataService} from '../../../data.service';

@Component({
  selector: 'app-comment-reply',
  templateUrl: './comment-reply.component.html',
  styleUrls: ['./comment-reply.component.scss']
})
export class CommentReplyComponent implements OnInit {

  @Input('comment')
  comment: CommentModel;

  @Output('sent')
  sent = new EventEmitter();

  reply: string = null;

  purchaseId: string = null;

  constructor(
    private route: ActivatedRoute,
    private rest: RestApiService,
    private data: DataService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.purchaseId = params['purchase_id'];
    });
  }

  get valid(): boolean {
    if (!this.reply) {
      return false;
    } else {
      return true;
    }
  }

  reset() {
    this.reply = '';
    this.comment = null;
  }

  async onSend() {
    if (this.valid) {
      const commentId = this.comment ? this.comment.id : null;

      try {
        const resp = await this.rest.addCommentToPurchase(
          this.purchaseId,
          this.reply,
          commentId
        );

        if (resp['meta'].success) {
          this.reset();
          this.sent.emit();
          this
            .data
            .addToast('Комментарий опубликован', '', 'success');
        } else {
          this
            .data
            .error(resp['meta'].message);
        }
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    }
  }

}
