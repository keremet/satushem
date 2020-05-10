import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataService} from '../data.service';
import {RestApiService} from '../rest-api.service';

@Component({
  selector: 'app-member-chooser',
  templateUrl: './member-chooser.component.html',
  styleUrls: ['./member-chooser.component.scss']
})
export class MemberChooserComponent implements OnInit {

  menu_visible = false;

  members: Array<any>;

  new_member_visible_name: string;
  new_member_login: string;
  new_member_passwd: string;

  private _member: any;

  @Input('member')
  set member(value: any) {
    this._member = value;
    this.selected_member = this.member || {};
  }

  get member(): any {
    return this._member;
  }

  @Input('readonly')
  readonly = false;

  selected_member = {};

  @Output('memberChanged')
  memberChanged = new EventEmitter();

  constructor(
    private data: DataService,
    private rest: RestApiService
  ) { }

  async ngOnInit() {
    const resp = await this.rest.getAllMembers();
    this.members = resp['data']['members'];

    this.selected_member = this.member || {};
  }

  selectMember(member: any) {
    this.hideMenu();
    if (this.selected_member['_id'] !== member['_id']) {
      this.selected_member = member;
      this.memberChanged.emit(this.selected_member);
    }
  }

  toggleMenu() {
    if (!this.readonly) {
      this.menu_visible = !this.menu_visible;
    }
  }

  hideMenu() {
    this.menu_visible = false;
  }

  async addNewMember() {
    const index = this
      .members
      .findIndex(category => category.login === this.new_member_login);
    if (index !== -1) {
      this
        .data
        .addToast('Ошибка', 'Такой логин уже есть', 'error');
      return;
    }
    try {
      const resp = await this.rest.addMember(this.new_member_login, this.new_member_passwd, this.new_member_visible_name);

      if (resp['meta'].success) {
        this.members.push(resp['data']['member']);
        this.new_member_login = '';
        this.new_member_passwd = '';
        this.new_member_visible_name = '';
        this.selectMember(this.members[this.members.length - 1]);
      } else {
        this
          .data
          .addToast('Ошибка', resp['meta'].message, 'error');
      }
    } catch (error) {
      this
        .data
        .addToast('Ошибка', error.toString(), 'error');
    }
  }

}
