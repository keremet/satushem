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

  joinToPurchase() {
    console.log('joint');
  }

}
