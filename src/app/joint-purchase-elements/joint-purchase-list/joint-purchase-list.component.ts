import {Component, Input, OnInit} from '@angular/core';
import {DataService} from '../../data.service';
import {RestApiService} from '../../rest-api.service';

@Component({
  selector: 'app-joint-purchase-list',
  templateUrl: './joint-purchase-list.component.html',
  styleUrls: ['./joint-purchase-list.component.scss']
})
export class JointPurchaseListComponent implements OnInit {
  @Input('purchase')
  purchase: any;

  constructor(
    private data: DataService,
    private rest: RestApiService
  ) { }

  ngOnInit() {  }

  get measurementUnit(): string {
    return this.purchase['measurement_unit']['name'] || '';
  }

  get date(): string {
    const date = new Date(this.purchase['date']);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  joinToPurchase() {
    console.log('joint');
  }

}
