import { Component, OnInit } from '@angular/core';

import {DataService} from '../../data.service';
import {RestApiService} from '../../rest-api.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  address = "";

  constructor(private rest: RestApiService, private data: DataService) { }

  ngOnInit() {
    this.address = this.data.user.address;
    this.data.setTitle('Адрес - Профиль');
  }

  async update() {
    try {
      await this.rest.updateAddress(this.address);

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
