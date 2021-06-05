import {Component, OnInit} from '@angular/core';
import {DataService} from '../../data.service';
import {FormControl} from '@angular/forms';
import {RestApiService} from '../../rest-api.service';


@Component({selector: 'app-replenishment', templateUrl: './replenishment.component.html', styleUrls: ['./replenishment.component.scss']})
export class ReplenishmentComponent implements OnInit {

  currentReplenishment: any = {};

  userLogin: FormControl;

  constructor(private data: DataService, private rest: RestApiService) {
  }

  async ngOnInit() {
    this.data.setTitle('Пополнение - Профиль');
    this.userLogin = new FormControl('');
  }

  updateUserLogin(member: any) {
    this.userLogin.setValue(member);
  }

  async update() {
    try {
      await this
        .rest
        .replenishment(this.userLogin.value['_id'], this.currentReplenishment.value);

      this
        .data
        .success('Счет пополнен');
    } catch (error) {
      this
        .data
        .error(error['message']);
    }
  }

}
