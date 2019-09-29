import {Component, OnInit} from '@angular/core';
import {DataService} from '../../data.service';
import {RestApiService} from '../../rest-api.service';


@Component({selector: 'app-settings', templateUrl: './settings.component.html', styleUrls: ['./settings.component.scss']})
export class SettingsComponent implements OnInit {

  currentSettings: any = {};

  constructor(private data: DataService, private rest: RestApiService) {
  }

  async ngOnInit() {
    await this.loadProfile();
    this.data.setTitle('Настройки - Профиль');
  }

  validate(settings) {
    if (!settings.email) {
      this
        .data
        .addToast('Введите e-mail', '', 'error');
      return false;
    }

    if (!settings.phone) {
      this
        .data
        .addToast('Введите номер телефона', '', 'error');
      return false;
    }

    return true;
  }

  async loadProfile() {
    await this
      .data
      .getProfile();

    Object.assign(this.currentSettings, this.data.user);
  }

  async update() {
    if (this.validate(this.currentSettings)) {
      try {
        await this
          .rest
          .updateUserProfile({
            first_name: this.currentSettings.first_name,
            last_name: this.currentSettings.last_name,
            phone: this.currentSettings.phone,
            email: this.currentSettings.email,
            city: this.currentSettings.city['_id']
          });

        await this.loadProfile();

        this
          .data
          .success('Информация обновлена');
      } catch (error) {
        this
          .data
          .error(error['message']);
      }
    }
  }

}
