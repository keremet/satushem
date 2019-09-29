import { Component, OnInit } from '@angular/core';
import {RestApiService} from '../../rest-api.service';
import {DataService} from '../../data.service';

@Component({
  selector: 'app-joint-purchases',
  templateUrl: './joint-purchases.component.html',
  styleUrls: ['./joint-purchases.component.scss']
})
export class JointPurchasesComponent implements OnInit {

  purchases = [];

  constructor(
    private rest: RestApiService,
    private data: DataService
  ) { }

  async ngOnInit() {
    await this.loadPurchasesInfo();
  }

  async loadPurchasesInfo() {
    const resp = await this
      .rest
      .getUserPurchases(this.data.user['_id']);

    this.purchases = resp['data']['purchases'];
  }

}
