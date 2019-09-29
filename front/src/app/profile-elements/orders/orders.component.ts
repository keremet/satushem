import { Component, OnInit } from '@angular/core';
import {DataService} from '../../data.service';
import {RestApiService} from '../../rest-api.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders = [];

  purchaseOrders = [];

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private spinner: NgxSpinnerService
  ) { }

  async ngOnInit() {
    this.spinner.show();
    await this.fetchOrdersInfo();
    this.spinner.hide();
    this.data.setTitle('Мои заказы - Профиль');
  }

  async fetchOrdersInfo() {
    // good orders
    const respGoods = await this.rest.getOrders();
    const orders = respGoods['data']['orders'];
    this.orders = orders.filter(_order => _order.good);

    // purchase orders
    const respPurchases = await this.rest.getPurchaseOrders();
    const purchases = respPurchases['data']['purchases'];
    this.purchaseOrders = purchases
      .map(purchase => {
        const index = purchase['participants']
          .findIndex(participant => participant['user'] === this.data.user['_id']);
        const orderInfo = purchase['participants'][index];
        return {
          purchase: purchase,
          volume: orderInfo['volume'],
          paid: orderInfo['paid'],
          delivered: orderInfo['delivered'],
          sent: orderInfo['sent'],
          price: purchase['price_per_unit'],
          unit: purchase['measurement_unit']['name']
        };
      });
  }

  async updateDeliveryStatus(order: any, status: boolean) {
    try {
      await this.rest.updateDeliveryPurchase(
        order['purchase']['_id'],
        this.data.user['_id'],
        status
      );

      this
        .data
        .addToast('Информация обновлена', '', 'success');

      await this.ngOnInit();
    } catch (error) {
      this
        .data
        .error(error['message']);
    }
  }

  async updateObtainedStatus(order: any) {
    try {
      await this.rest.updateOrderStatusObtained(order._id);

      this
        .data
        .success('Информация обновлена');

      await this.ngOnInit();
    } catch (error) {
      this
        .data
        .error(error['message']);
    }
  }
}
