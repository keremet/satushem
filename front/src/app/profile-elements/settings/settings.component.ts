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

  async loadProfile() {
    await this
      .data
      .getProfile();

    Object.assign(this.currentSettings, this.data.user);
  }

  async update() {
    try {
      await this
        .rest
        .updateUserProfile(this.currentSettings.visible_name, this.currentSettings.contacts);

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
