export class CommentModel {

  id: string;

  user: string;

  date: Date;

  body: string;

  children: Array<CommentModel>;

}
