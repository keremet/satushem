import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyUserName'
})
export class PrettyUserNamePipe implements PipeTransform {

  transform(user: any): string {
    let visible_name = user.visible_name || '';

    if (visible_name) {
      return `${visible_name}`.trim() + ' (' + user.login + ')';
    } else {
      return user.login;
    }
  }

}
