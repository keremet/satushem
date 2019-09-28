import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyUserName'
})
export class PrettyUserNamePipe implements PipeTransform {

  transform(user: any): string {
    let {
      first_name: firstName,
      last_name: lastName,
      login
    } = user;

    firstName = firstName || '';
    lastName = lastName || '';

    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    } else {
      return login;
    }
  }

}
