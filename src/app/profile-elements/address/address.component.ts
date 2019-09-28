import { Component, OnInit } from '@angular/core';

import {DataService} from '../../data.service';
import {RestApiService} from '../../rest-api.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  address: any = {
    addr1: '',
    addr2: '',
    country: '',
    postalCode: ''
  };

  constructor(private rest: RestApiService, private data: DataService) { }

  ngOnInit() {
    Object.assign(this.address, this.data.user.address);
    this.data.setTitle('Адрес - Профиль');
  }

  validate(): boolean {
    const re = /^\d+$/;
    if (this.address.postalCode.trim().match(re)) {
      return true;
    } else {
      this
        .data
        .addToast('Неверный почтовый индекс', '', 'error');
    }

    return false;
  }

  async update() {
    try {
      if (this.validate()) {
        await this.rest.updateAddress({
          addr1: this.address.addr1,
          addr2: this.address.addr2,
          city: this.address.city,
          country: this.address.country,
          postalCode: this.address.postalCode
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
