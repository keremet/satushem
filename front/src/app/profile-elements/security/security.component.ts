import { Component, OnInit } from '@angular/core';

import {DataService} from '../../data.service';
import {RestApiService} from '../../rest-api.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {

  old_password = '';
  password = '';
  confirmation_password = '';

  constructor(private rest: RestApiService, private data: DataService) { }

  ngOnInit() {
    this.data.setTitle('Безопасность - Профиль');
  }

  validate(): boolean {
    if (this.old_password) {
      if (this.password) {
        if (this.password === this.confirmation_password) {
          return true;
        } else {
          this
            .data
            .addToast('Пароли не совпадают', '', 'error');
        }
      } else {
        this
          .data
          .addToast('Введите новый пароль', '', 'error');
      }
    } else {
      this
        .data
        .addToast('Введите старый пароль', '', 'error');
    }

    return false;
  }

  async update() {
    try {
      if (this.validate()) {
        await this.rest.updatePassword({
          password: this.password,
          old_password: this.old_password,
          confirmation_password: this.confirmation_password
        });

        this
          .data
          .success('Информация обновлена');
      }
    } catch (error) {
      this
        .data
        .error(error['message']);
    }
  }

}
